// src/services/skills.service.ts
import axiosInstance from "../config/axios.instance";
import type { IBackendRes, IModelPaginate } from "../types/backend";
import type {
  ICreateSkillPayload,
  ISkill,
  IUpdateSkillPayload,
} from "../types/skill.type";

export const fetchSkillsAPI = async (): Promise<
  IBackendRes<IModelPaginate<ISkill>>
> => {
  // Lấy list dài để thả vào Dropdown (Ví dụ 100 kỹ năng)
  return axiosInstance.get("/skills?current=1&pageSize=100");
};

export const fetchSkillsPaginatedAPI = async (
  current: number = 1,
  pageSize: number = 10,
  queryString?: string,
): Promise<IBackendRes<IModelPaginate<ISkill>>> => {
  const qs = queryString ? `&${queryString}` : "";
  return axiosInstance.get(
    `/skills?current=${current}&pageSize=${pageSize}${qs}`,
  );
};

export const createSkillAPI = async (
  data: ICreateSkillPayload,
): Promise<IBackendRes<ISkill>> => {
  return axiosInstance.post("/skills", data);
};

export const updateSkillAPI = async (
  id: string,
  data: IUpdateSkillPayload,
): Promise<IBackendRes<ISkill>> => {
  return axiosInstance.patch(`/skills/${id}`, data);
};

export const deleteSkillAPI = async (
  id: string,
): Promise<IBackendRes<Record<string, never>>> => {
  return axiosInstance.delete(`/skills/${id}`);
};
