import type { IUser } from "./user.type";

export interface IConversationParticipant {
  _id: string;
  name: string;
  email: string;
  role?: IUser["role"];
  company?: IUser["company"];
}

export interface IConversation {
  _id: string;
  participants: Array<IConversationParticipant | string>;
  lastMessageSender?: string;
  lastMessageContent?: string;
  lastMessageAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateConversationPayload {
  participants: [string, string];
}

export interface IMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  readAt: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateMessagePayload {
  conversationId: string;
  content: string;
}
