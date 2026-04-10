import axiosInstance from "../config/axios.instance";
import type { IBackendRes, IModelPaginate } from "../types/backend";
import type {
  IBookmark,
  ICreateBookmarkPayload,
} from "../types/bookmark.type";

export const fetchBookmarksAPI = async (
  current: number = 1,
  pageSize: number = 20,
  queryString?: string,
): Promise<IBackendRes<IModelPaginate<IBookmark>>> => {
  const qs = queryString ? `&${queryString}` : "";
  return axiosInstance.get(
    `/bookmarks?current=${current}&pageSize=${pageSize}${qs}`,
  );
};

export const createBookmarkAPI = async (
  data: ICreateBookmarkPayload,
): Promise<IBackendRes<IBookmark | { message: string; bookmark: IBookmark }>> => {
  return axiosInstance.post("/bookmarks", data);
};

export const deleteBookmarkAPI = async (
  id: string,
): Promise<IBackendRes<Record<string, never>>> => {
  return axiosInstance.delete(`/bookmarks/${id}`);
};
