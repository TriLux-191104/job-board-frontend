import { useEffect, useState } from "react";
import {
  createBookmarkAPI,
  deleteBookmarkAPI,
  fetchBookmarksAPI,
} from "../../services/bookmarks.service";

interface BookmarkButtonProps {
  jobId: string;
  className?: string;
}

const BookmarkButton = ({ jobId, className = "" }: BookmarkButtonProps) => {
  const [bookmarkId, setBookmarkId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadBookmarkState = async () => {
      try {
        const res = await fetchBookmarksAPI(1, 100, `jobId=${jobId}`);
        const matchedBookmark = res.data?.result?.[0];
        setBookmarkId(matchedBookmark?._id || "");
      } catch {
        setBookmarkId("");
      }
    };

    void loadBookmarkState();
  }, [jobId]);

  const handleToggleBookmark = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (bookmarkId) {
        await deleteBookmarkAPI(bookmarkId);
        setBookmarkId("");
      } else {
        const res = await createBookmarkAPI({ jobId });
        const createdBookmark =
          res.data && "_id" in res.data
            ? res.data
            : res.data?.bookmark;

        setBookmarkId(createdBookmark?._id || "");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggleBookmark}
      disabled={isLoading}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition ${
        bookmarkId
          ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900"
      } ${className}`}
    >
      <span>{bookmarkId ? "Da luu" : "Luu job"}</span>
    </button>
  );
};

export default BookmarkButton;
