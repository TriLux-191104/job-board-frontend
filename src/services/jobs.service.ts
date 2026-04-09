// src/services/jobs.service.ts
import axiosInstance from "../config/axios.instance";
import type { IBackendRes, IModelPaginate } from "../types/backend";
import type {
  IJob,
  ICreateJobPayload,
  IUpdateJobPayload,
} from "../types/job.type";

export const fetchJobsAPI = async (
  current: number = 1,
  pageSize: number = 10,
  queryString?: string,
): Promise<IBackendRes<IModelPaginate<IJob>>> => {
  const qs = queryString ? `&${queryString}` : "";
  return axiosInstance.get(
    `/jobs?current=${current}&pageSize=${pageSize}${qs}`,
  );
};

export const createJobAPI = async (
  data: ICreateJobPayload,
): Promise<IBackendRes<IJob>> => {
  return axiosInstance.post("/jobs", data);
};

export const updateJobAPI = async (
  id: string,
  data: IUpdateJobPayload,
): Promise<IBackendRes<IJob>> => {
  return axiosInstance.patch(`/jobs/${id}`, data);
};

export const deleteJobAPI = async (id: string): Promise<IBackendRes<IJob>> => {
  return axiosInstance.delete(`/jobs/${id}`);
};
