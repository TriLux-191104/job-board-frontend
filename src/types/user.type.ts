// src/types/user.type.ts

export interface IRole {
  _id: string;
  name: string;
  description?: string;
}

export interface ICompany {
  _id: string;
  name: string;
}

// Kiểu dữ liệu chuẩn của 1 User trả về từ Backend
export interface IUser {
  _id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  address: string;
  role: IRole;
  company?: ICompany; // Có thể không có nếu user là NORMAL_USER
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateUserPayload {
  name: string;
  email: string;
  password?: string; // Chỉ dùng khi Create
  age: number;
  gender: string;
  address: string;
  role: string; // MongoID của role
  company: {
    _id: string; // MongoID của company
    name: string;
  };
}

// Khi Update thì không gửi password
export interface IUpdateUserPayload extends Omit<
  ICreateUserPayload,
  "password"
> {
  _id: string;
}
