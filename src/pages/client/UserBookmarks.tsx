import { useMemo } from "react";
import { Link } from "react-router-dom";
import { deleteBookmarkAPI, fetchBookmarksAPI } from "../../services/bookmarks.service";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import type { IBookmark } from "../../types/bookmark.type";
import type { IJob } from "../../types/job.type";

const UserBookmarks = () => {
  const {
    data: bookmarks,
    total,
    isLoading,
    error,
    current,
    pageSize,
    setCurrent,
    refetch,
  } = usePaginatedFetch<IBookmark>(
    fetchBookmarksAPI,
    8,
    "sort=-createdAt&populate=jobId",
  );

  const totalPages = Math.ceil(total / pageSize);

  const normalizedBookmarks = useMemo(() => {
    return bookmarks.filter((bookmark) => typeof bookmark.jobId === "object");
  }, [bookmarks]);

  const handleRemoveBookmark = async (bookmarkId: string) => {
    try {
      await deleteBookmarkAPI(bookmarkId);
      await refetch();
    } catch {
      alert("Khong xoa duoc bookmark");
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black text-gray-900">Job da luu</h1>
        <p className="mt-2 text-gray-500">
          Quan ly danh sach cong viec ban quan tam va quay lai ung tuyen bat cu
          luc nao.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-48 animate-pulse rounded-3xl border border-gray-200 bg-white"
            />
          ))}
        </div>
      ) : normalizedBookmarks.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-6 py-20 text-center text-gray-500">
          Ban chua luu cong viec nao.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {normalizedBookmarks.map((bookmark) => {
            const job = bookmark.jobId as IJob;

            return (
              <div
                key={bookmark._id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                      {job.company.name}
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-gray-900">
                      {job.name}
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                      {job.location} • {job.level}
                    </p>
                  </div>
                  <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-600">
                    ${job.salary.toLocaleString()}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill._id}
                      className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold uppercase text-gray-600"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <Link
                    to={`/job/${job._id}`}
                    className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-black"
                  >
                    Xem chi tiet
                  </Link>
                  <button
                    type="button"
                    onClick={() => void handleRemoveBookmark(bookmark._id)}
                    className="rounded-2xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-600 transition hover:border-red-200 hover:text-red-600"
                  >
                    Bo luu
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="flex justify-end items-center gap-2">
          <button
            disabled={current === 1}
            onClick={() => setCurrent((prev) => prev - 1)}
            className="rounded-xl border px-3 py-2 text-sm disabled:opacity-40"
          >
            Truoc
          </button>
          <span className="text-sm font-medium text-gray-600">
            Trang {current} / {totalPages}
          </span>
          <button
            disabled={current === totalPages}
            onClick={() => setCurrent((prev) => prev + 1)}
            className="rounded-xl border px-3 py-2 text-sm disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default UserBookmarks;
