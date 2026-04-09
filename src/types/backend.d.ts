// src/types/backend.d.ts

// Chuẩn Response chung của Backend
export interface IBackendRes<T> {
  error?: string | string[];
  message: string;
  statusCode: number | string;
  data?: T;
}

// Chuẩn Response cho data phân trang (Paginate)
export interface IModelPaginate<T> {
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: T[];
}

// Type cho User khi đăng nhập thành công (Dựa trên Auth.service và Jwt.strategy)
export interface IAuthUser {
  _id: string;
  name: string;
  email: string;
  role: {
    _id: string;
    name: string;
  };
  permissions: {
    _id: string;
    name: string;
    apiPath: string;
    method: string;
    module: string;
  }[];
}

// Payload trả về khi gọi API Login thành công
export interface ILoginResponse {
  access_token: string;
  user: IAuthUser;
}
