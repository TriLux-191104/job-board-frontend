import axiosInstance from "../config/axios.instance";
import type { IBackendRes } from "../types/backend";
import type {
  ISubscriber,
  IUpdateSubscriberPayload,
} from "../types/subscriber.type";

export const getSubscriberSkillsAPI = async (): Promise<
  IBackendRes<ISubscriber>
> => {
  return axiosInstance.post("/subscribers/skills"); // Lấy skills của user đang logged in
};

export const updateSubscriberAPI = async (
  data: IUpdateSubscriberPayload,
): Promise<IBackendRes<unknown>> => {
  // Vì Backend dùng email từ token để update nên không cần truyền ID vào URL
  return axiosInstance.patch("/subscribers/0", data);
};
