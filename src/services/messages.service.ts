import axiosInstance from "../config/axios.instance";
import type { IBackendRes, IModelPaginate } from "../types/backend";
import type { ICreateMessagePayload, IMessage } from "../types/chat.type";

export const fetchMessagesAPI = async (
  conversationId: string,
  current: number = 1,
  pageSize: number = 100,
  queryString?: string,
): Promise<IBackendRes<IModelPaginate<IMessage>>> => {
  const qs = queryString ? `&${queryString}` : "";
  return axiosInstance.get(
    `/messages?current=${current}&pageSize=${pageSize}&conversationId=${conversationId}${qs}`,
  );
};

export const createMessageAPI = async (
  data: ICreateMessagePayload,
): Promise<IBackendRes<IMessage>> => {
  return axiosInstance.post("/messages", data);
};
