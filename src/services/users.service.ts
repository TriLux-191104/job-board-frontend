// src/services/users.service.ts
import axiosInstance from "../config/axios.instance";
import type { IBackendRes, IModelPaginate } from "../types/backend";
import type { IResume } from "../types/resume.type";
import type { IUser } from "../types/user.type";
import type {
  ICreateUserPayload,
  IUpdateUserPayload,
} from "../types/user.type";

export const fetchUsersAPI = async (
  current: number,
  pageSize: number,
  queryString?: string,
): Promise<IBackendRes<IModelPaginate<IUser>>> => {
  // Nối thêm query string (ví dụ filter, sort) nếu có
  const qs = queryString ? `&${queryString}` : "";

  // Gọi endpoint GET /users
  return axiosInstance.get(
    `/users?current=${current}&pageSize=${pageSize}${qs}`,
  );
};

export const createUserAPI = async (
  data: ICreateUserPayload,
): Promise<IBackendRes<IUser>> => {
  return axiosInstance.post("/users", data);
};

export const updateUserAPI = async (
  data: IUpdateUserPayload,
): Promise<IBackendRes<IUser>> => {
  return axiosInstance.patch("/users", data);
};

export const fetchResumeByUserAPI = async (): Promise<
  IBackendRes<IResume[]>
> => {
  return axiosInstance.post("/resumes/by-user");
};
