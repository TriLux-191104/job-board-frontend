import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "../../contexts/AuthContext";
import {
  createConversationAPI,
  fetchConversationsAPI,
} from "../../services/conversations.service";
import {
  createMessageAPI,
  fetchMessagesAPI,
} from "../../services/messages.service";
import { fetchUsersAPI } from "../../services/users.service";
import type {
  IConversation,
  IConversationParticipant,
  IMessage,
} from "../../types/chat.type";
import type { IUser } from "../../types/user.type";
import { getSocketBaseUrl } from "../../utils/socket";

const sortConversations = (items: IConversation[]): IConversation[] => {
  return [...items].sort((first, second) => {
    const firstTime = new Date(
      first.lastMessageAt || first.updatedAt || first.createdAt || 0,
    ).getTime();
    const secondTime = new Date(
      second.lastMessageAt || second.updatedAt || second.createdAt || 0,
    ).getTime();
    return secondTime - firstTime;
  });
};

const isParticipantObject = (
  participant: IConversation["participants"][number],
): participant is Exclude<IConversation["participants"][number], string> => {
  return typeof participant !== "string";
};

const getConversationPeer = (
  conversation: IConversation,
  currentUserId?: string,
): IConversationParticipant | null => {
  const participant = conversation.participants.find((item) => {
    return isParticipantObject(item) && item._id !== currentUserId;
  });

  if (!participant || !isParticipantObject(participant)) {
    return null;
  }

  return participant;
};

const formatShortTime = (value?: string) => {
  if (!value) return "";
  return new Date(value).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatShortDate = (value?: string) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
};

const patchConversationPreview = (
  conversation: IConversation,
  message: IMessage,
): IConversation => {
  return {
    ...conversation,
    lastMessageContent: message.content,
    lastMessageSender: message.senderId,
    lastMessageAt: message.createdAt || new Date().toISOString(),
  };
};

const hydrateConversationParticipants = (
  conversations: IConversation[],
  users: IUser[],
): IConversation[] => {
  return conversations.map((conversation) => ({
    ...conversation,
    participants: conversation.participants.map((participant) => {
      if (isParticipantObject(participant)) {
        return participant;
      }

      const matchedUser = users.find((user) => user._id === participant);
      if (!matchedUser) {
        return participant;
      }

      return {
        _id: matchedUser._id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
        company: matchedUser.company,
      };
    }),
  }));
};

const ChatPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [directoryUsers, setDirectoryUsers] = useState<IUser[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const [draftMessage, setDraftMessage] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isStartingConversation, setIsStartingConversation] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [pageError, setPageError] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const currentRoomRef = useRef("");
  const selectedConversationIdRef = useRef("");
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const selectedConversation = useMemo(() => {
    return conversations.find(
      (conversation) => conversation._id === selectedConversationId,
    );
  }, [conversations, selectedConversationId]);

  const selectedPeer = useMemo(() => {
    if (!selectedConversation || !user?._id) return null;
    return getConversationPeer(selectedConversation, user._id);
  }, [selectedConversation, user?._id]);

  const filteredUsers = useMemo(() => {
    const normalized = userSearch.trim().toLowerCase();

    return directoryUsers.filter((candidate) => {
      if (candidate._id === user?._id) return false;
      if (!normalized) return true;

      return (
        candidate.name.toLowerCase().includes(normalized) ||
        candidate.email.toLowerCase().includes(normalized)
      );
    });
  }, [directoryUsers, user?._id, userSearch]);

  const updateQueryConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setSearchParams(
      conversationId ? { conversationId } : {},
      {
        replace: true,
      },
    );
  };

  const loadInitialData = async () => {
    setPageError("");
    setIsLoadingConversations(true);

    try {
      const [conversationRes, userRes] = await Promise.all([
        fetchConversationsAPI(1, 100, "sort=-lastMessageAt"),
        fetchUsersAPI(1, 100),
      ]);

      const directory = userRes.data?.result ?? [];
      const nextConversations = sortConversations(
        hydrateConversationParticipants(
          conversationRes.data?.result ?? [],
          directory,
        ),
      );
      setConversations(nextConversations);
      setDirectoryUsers(directory);

      const queryConversationId = searchParams.get("conversationId");
      if (
        queryConversationId &&
        nextConversations.some(
          (conversation) => conversation._id === queryConversationId,
        )
      ) {
        setSelectedConversationId(queryConversationId);
      } else if (nextConversations[0]?._id) {
        setSelectedConversationId(nextConversations[0]._id);
      }
    } catch {
      setPageError("Khong tai duoc danh sach chat.");
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    setIsLoadingMessages(true);
    setPageError("");

    try {
      const res = await fetchMessagesAPI(
        conversationId,
        1,
        200,
        "sort=createdAt",
      );
      setMessages(res.data?.result ?? []);
    } catch {
      setMessages([]);
      setPageError("Khong tai duoc tin nhan.");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const selectConversation = (conversationId: string) => {
    setPageError("");
    updateQueryConversation(conversationId);
  };

  const startConversation = async (targetUserId: string) => {
    if (!user?._id || targetUserId === user._id || isStartingConversation) {
      return;
    }

    const existingConversation = conversations.find((conversation) => {
      return conversation.participants.some((participant) => {
        return isParticipantObject(participant) && participant._id === targetUserId;
      });
    });

    if (existingConversation) {
      selectConversation(existingConversation._id);
      return;
    }

    setIsStartingConversation(true);
    setPageError("");

    try {
      const res = await createConversationAPI({
        participants: [user._id, targetUserId],
      });

      const createdConversation = res.data;
      if (!createdConversation) return;

      const targetUser = directoryUsers.find(
        (candidate) => candidate._id === targetUserId,
      );

      const hydratedConversation: IConversation = {
        ...createdConversation,
        participants: [
          {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          ...(targetUser
            ? [
                {
                  _id: targetUser._id,
                  name: targetUser.name,
                  email: targetUser.email,
                  role: targetUser.role,
                  company: targetUser.company,
                },
              ]
            : []),
        ],
      };

      setConversations((prev) =>
        sortConversations([hydratedConversation, ...prev]),
      );
      selectConversation(hydratedConversation._id);
    } catch {
      setPageError("Khong tao duoc cuoc tro chuyen moi.");
    } finally {
      setIsStartingConversation(false);
    }
  };

  const sendMessage = async () => {
    const content = draftMessage.trim();
    if (!selectedConversationId || !content || isSending) return;

    setIsSending(true);
    setPageError("");

    try {
      const res = await createMessageAPI({
        conversationId: selectedConversationId,
        content,
      });
      const createdMessage = res.data;
      if (!createdMessage) return;

      setDraftMessage("");
      setMessages((prev) => {
        if (prev.some((message) => message._id === createdMessage._id)) {
          return prev;
        }
        return [...prev, createdMessage];
      });

      setConversations((prev) =>
        sortConversations(
          prev.map((conversation) =>
            conversation._id === selectedConversationId
              ? patchConversationPreview(conversation, createdMessage)
              : conversation,
          ),
        ),
      );
    } catch {
      setPageError("Gui tin nhan that bai.");
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    void loadInitialData();
  }, []);

  useEffect(() => {
    const targetUserId = searchParams.get("userId");
    if (!targetUserId || !user?._id || directoryUsers.length === 0) return;

    const existingConversation = conversations.find((conversation) => {
      return conversation.participants.some((participant) => {
        return isParticipantObject(participant) && participant._id === targetUserId;
      });
    });

    if (existingConversation) {
      selectConversation(existingConversation._id);
      return;
    }

    void startConversation(targetUserId);
  }, [conversations, directoryUsers.length, searchParams, user?._id]);

  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }

    void loadMessages(selectedConversationId);
  }, [selectedConversationId]);

  useEffect(() => {
    selectedConversationIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

  useEffect(() => {
    const socket = io(`${getSocketBaseUrl()}/conversations`, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      if (selectedConversationIdRef.current) {
        socket.emit("join_conversation", {
          conversationId: selectedConversationIdRef.current,
        });
        currentRoomRef.current = selectedConversationIdRef.current;
      }
    });

    socket.on("new_message", (incomingMessage: IMessage) => {
      setConversations((prev) => {
        const hasConversation = prev.some(
          (conversation) => conversation._id === incomingMessage.conversationId,
        );
        if (!hasConversation) return prev;

        return sortConversations(
          prev.map((conversation) =>
            conversation._id === incomingMessage.conversationId
              ? patchConversationPreview(conversation, incomingMessage)
              : conversation,
          ),
        );
      });

      setMessages((prev) => {
        if (
          incomingMessage.conversationId !== selectedConversationIdRef.current
        ) {
          return prev;
        }
        if (prev.some((message) => message._id === incomingMessage._id)) {
          return prev;
        }
        return [...prev, incomingMessage];
      });
    });

    return () => {
      socket.close();
      socketRef.current = null;
      currentRoomRef.current = "";
    };
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !selectedConversationId) return;

    if (
      currentRoomRef.current &&
      currentRoomRef.current !== selectedConversationId
    ) {
      socket.emit("leave_conversation", {
        conversationId: currentRoomRef.current,
      });
    }

    if (socket.connected) {
      socket.emit("join_conversation", {
        conversationId: selectedConversationId,
      });
    }
    currentRoomRef.current = selectedConversationId;
  }, [selectedConversationId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="grid min-h-[calc(100vh-10rem)] grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <h1 className="text-xl font-black text-gray-900">Tin nhan</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quan ly hoi thoai va gui tin theo thoi gian thuc.
          </p>

          <input
            value={userSearch}
            onChange={(event) => setUserSearch(event.target.value)}
            placeholder="Tim ten hoac email..."
            className="mt-4 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:bg-white"
          />
        </div>

        <div className="max-h-72 overflow-y-auto border-b border-gray-100 p-3">
          <p className="px-2 pb-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            Bat dau chat moi
          </p>

          {filteredUsers.length === 0 ? (
            <div className="px-3 py-4 text-sm text-gray-400">
              Khong tim thay nguoi dung phu hop.
            </div>
          ) : (
            filteredUsers.slice(0, 8).map((candidate) => (
              <button
                key={candidate._id}
                type="button"
                disabled={isStartingConversation}
                onClick={() => void startConversation(candidate._id)}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-sm font-black text-red-600">
                  {candidate.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-gray-900">
                    {candidate.name}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {candidate.email}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="max-h-[calc(100vh-22rem)] overflow-y-auto p-3">
          <p className="px-2 pb-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            Cuoc tro chuyen
          </p>

          {isLoadingConversations ? (
            <div className="px-3 py-4 text-sm text-gray-400">
              Dang tai danh sach hoi thoai...
            </div>
          ) : conversations.length === 0 ? (
            <div className="px-3 py-4 text-sm text-gray-400">
              Chua co cuoc tro chuyen nao.
            </div>
          ) : (
            conversations.map((conversation) => {
              const peer = getConversationPeer(conversation, user?._id);

              return (
                <button
                  key={conversation._id}
                  type="button"
                  onClick={() => selectConversation(conversation._id)}
                  className={`mb-2 flex w-full items-start gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                    conversation._id === selectedConversationId
                      ? "border-red-200 bg-red-50"
                      : "border-transparent hover:bg-gray-50"
                  }`}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-black text-white">
                    {(peer?.name || "?").slice(0, 1).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="truncate text-sm font-bold text-gray-900">
                        {peer?.name || "Nguoi dung"}
                      </p>
                      <span className="shrink-0 text-[11px] text-gray-400">
                        {formatShortDate(conversation.lastMessageAt)}
                      </span>
                    </div>
                    <p className="truncate text-xs text-gray-500">
                      {conversation.lastMessageContent || "Chua co tin nhan"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      <section className="flex min-h-[42rem] flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        {selectedConversation ? (
          <>
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-black text-gray-900">
                  {selectedPeer?.name || "Cuoc tro chuyen"}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedPeer?.email || "San sang nhan tin theo thoi gian thuc"}
                </p>
              </div>

              {selectedPeer && (
                <Link
                  to={`?userId=${selectedPeer._id}`}
                  className="rounded-full border border-gray-200 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-500 transition hover:border-red-200 hover:text-red-600"
                >
                  Dang chat
                </Link>
              )}
            </div>

            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white px-6 py-5">
              {isLoadingMessages ? (
                <div className="text-sm text-gray-400">Dang tai tin nhan...</div>
              ) : messages.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-400">
                  Cuoc tro chuyen nay chua co tin nhan nao. Hay gui mot loi chao
                  dau tien.
                </div>
              ) : (
                messages.map((message) => {
                  const isMine = message.senderId === user?._id;

                  return (
                    <div
                      key={message._id}
                      className={`mb-4 flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-3xl px-4 py-3 shadow-sm ${
                          isMine
                            ? "rounded-br-md bg-gray-900 text-white"
                            : "rounded-bl-md border border-gray-200 bg-white text-gray-900"
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm leading-6">
                          {message.content}
                        </p>
                        <p
                          className={`mt-2 text-[11px] ${
                            isMine ? "text-gray-300" : "text-gray-400"
                          }`}
                        >
                          {formatShortTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}

              <div ref={messageEndRef} />
            </div>

            <div className="border-t border-gray-100 p-4">
              {pageError && (
                <div className="mb-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {pageError}
                </div>
              )}

              <div className="flex items-end gap-3">
                <textarea
                  value={draftMessage}
                  onChange={(event) => setDraftMessage(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void sendMessage();
                    }
                  }}
                  rows={3}
                  placeholder="Nhap tin nhan..."
                  className="min-h-24 flex-1 resize-none rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:bg-white"
                />
                <button
                  type="button"
                  disabled={!draftMessage.trim() || isSending}
                  onClick={() => void sendMessage()}
                  className="rounded-3xl bg-red-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-red-100 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
                >
                  {isSending ? "Dang gui..." : "Gui"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="max-w-md rounded-[2rem] border border-dashed border-gray-200 bg-gray-50 p-8">
              <h2 className="text-2xl font-black text-gray-900">
                San sang tro chuyen
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                Chon mot nguoi hoac mot cuoc tro chuyen ben trai de bat dau chat.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ChatPage;
