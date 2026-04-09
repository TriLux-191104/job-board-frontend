// src/services/auth.service.ts
import axiosInstance from "../config/axios.instance";
import { API_ENDPOINTS } from "../config/constants";
// Thêm chữ 'type' vào dòng import này
import type { IAuthUser, IBackendRes, ILoginResponse } from "../types/backend";

export const loginAPI = async (
  email: string,
  password: string,
): Promise<IBackendRes<ILoginResponse>> => {
  return axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, {
    username: email,
    password,
  });
};

export const getAccountAPI = async (): Promise<
  IBackendRes<{ user: IAuthUser }>
> => {
  return axiosInstance.get(API_ENDPOINTS.AUTH.ACCOUNT);
};

// Đã đổi any thành string (vì backend trả về 'ok')
export const logoutAPI = async (): Promise<IBackendRes<string>> => {
  return axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
};

export const refreshTokenAPI = async (): Promise<
  IBackendRes<ILoginResponse>
> => {
  return axiosInstance.get(API_ENDPOINTS.AUTH.REFRESH);
};
