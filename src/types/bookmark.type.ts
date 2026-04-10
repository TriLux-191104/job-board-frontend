import type { IJob } from "./job.type";

export interface IBookmark {
  _id: string;
  userId: string;
  jobId: IJob | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateBookmarkPayload {
  jobId: string;
}
