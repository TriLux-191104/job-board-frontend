// src/services/companies.service.ts
import axiosInstance from "../config/axios.instance";
import type { IBackendRes, IModelPaginate } from "../types/backend";
import type {
  ICompany,
  ICreateCompanyPayload,
  IUpdateCompanyPayload,
} from "../types/company.type";

// Hỗ trợ cả phân trang (cho Table) và không phân trang (cho Dropdown khi gọi pageSize lớn)
export const fetchCompaniesAPI = async (
  current: number = 1,
  pageSize: number = 10,
  queryString?: string,
): Promise<IBackendRes<IModelPaginate<ICompany>>> => {
  const qs = queryString ? `&${queryString}` : "";
  return axiosInstance.get(
    `/companies?current=${current}&pageSize=${pageSize}${qs}`,
  );
};

export const createCompanyAPI = async (
  data: ICreateCompanyPayload,
): Promise<IBackendRes<ICompany>> => {
  return axiosInstance.post("/companies", data);
};

export const updateCompanyAPI = async (
  id: string,
  data: IUpdateCompanyPayload,
): Promise<IBackendRes<ICompany>> => {
  return axiosInstance.patch(`/companies/${id}`, data);
};

export const deleteCompanyAPI = async (
  id: string,
): Promise<IBackendRes<ICompany>> => {
  return axiosInstance.delete(`/companies/${id}`);
};
