export interface ISkill {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateSkillPayload {
  name: string;
  description: string;
}

export interface IUpdateSkillPayload extends ICreateSkillPayload {
  _id: string;
}
