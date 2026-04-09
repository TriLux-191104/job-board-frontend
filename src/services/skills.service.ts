// src/services/skills.service.ts
import axiosInstance from "../config/axios.instance";
import type { IBackendRes, IModelPaginate } from "../types/backend";
import type { ISkill } from "../types/job.type";

export const fetchSkillsAPI = async (): Promise<
  IBackendRes<IModelPaginate<ISkill>>
> => {
  // Lấy list dài để thả vào Dropdown (Ví dụ 100 kỹ năng)
  return axiosInstance.get("/skills?current=1&pageSize=100");
};
