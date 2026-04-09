// src/services/resumes.service.ts
import axiosInstance from "../config/axios.instance";
import type { IBackendRes, IModelPaginate } from "../types/backend";
import type { IResume, ResumeStatus } from "../types/resume.type";
import type { ICreateResumePayload } from "../types/resume.type";

export const fetchResumesAPI = async (
  current: number,
  pageSize: number,
  queryString?: string,
): Promise<IBackendRes<IModelPaginate<IResume>>> => {
  const qs = queryString ? `&${queryString}` : "";
  return axiosInstance.get(
    `/resumes?current=${current}&pageSize=${pageSize}${qs}`,
  );
};

// Sửa any thành string vì backend trả về message 'ok' hoặc status mới
export const updateResumeStatusAPI = async (
  id: string,
  status: ResumeStatus,
): Promise<IBackendRes<string>> => {
  return axiosInstance.patch(`/resumes/${id}`, { status });
};

export const deleteResumeAPI = async (
  id: string,
): Promise<IBackendRes<string>> => {
  return axiosInstance.delete(`/resumes/${id}`);
};

export const createResumeAPI = async (
  data: ICreateResumePayload,
): Promise<IBackendRes<unknown>> => {
  return axiosInstance.post("/resumes", data);
};
