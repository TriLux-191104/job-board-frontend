// src/types/company.type.ts

export interface ICompany {
  _id: string;
  name: string;
  address: string;
  description: string;
  logo: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateCompanyPayload {
  name: string;
  address: string;
  description: string;
  logo: string;
}

export interface IUpdateCompanyPayload extends ICreateCompanyPayload {
  _id: string;
}
