// src/types/resume.type.ts

export type ResumeStatus = "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED";

export interface IResume {
  _id: string;
  email: string;
  userId: string;
  url: string;
  status: ResumeStatus;
  companyId: string;
  // Sửa chỗ này để không phải dùng 'any' ở component
  jobId:
    | {
        _id: string;
        name: string;
      }
    | string;
  history: {
    status: ResumeStatus;
    updatedAt: string;
    updatedBy: {
      _id: string;
      email: string;
    };
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateResumePayload {
  url: string; // Tên file CV sau khi upload
  companyId: string;
  jobId: string;
}
