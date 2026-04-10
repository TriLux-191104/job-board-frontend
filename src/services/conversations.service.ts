import axiosInstance from "../config/axios.instance";
import type { IBackendRes, IModelPaginate } from "../types/backend";
import type {
  IConversation,
  ICreateConversationPayload,
} from "../types/chat.type";

export const fetchConversationsAPI = async (
  current: number = 1,
  pageSize: number = 50,
  queryString?: string,
): Promise<IBackendRes<IModelPaginate<IConversation>>> => {
  const qs = queryString ? `&${queryString}` : "";
  return axiosInstance.get(
    `/conversations?current=${current}&pageSize=${pageSize}${qs}`,
  );
};

export const createConversationAPI = async (
  data: ICreateConversationPayload,
): Promise<IBackendRes<IConversation>> => {
  return axiosInstance.post("/conversations", data);
};
