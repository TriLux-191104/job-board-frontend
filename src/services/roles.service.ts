// src/services/roles.service.ts
import axiosInstance from "../config/axios.instance";
import type { IBackendRes, IModelPaginate } from "../types/backend";
import type { IRole } from "../types/user.type";

// Tạm thời truyền pageSize lớn (VD: 100) để lấy hết role đổ vào dropdown
export const fetchRolesAPI = async (): Promise<
  IBackendRes<IModelPaginate<IRole>>
> => {
  return axiosInstance.get("/roles?current=1&pageSize=100");
};
