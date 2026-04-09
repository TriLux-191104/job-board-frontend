// Skill là một mảng Object chứa _id và name, nhưng trong payload gửi lên chỉ cần mảng string ID
export interface ISkill {
  _id: string;
  name: string;
}

export interface IJob {
  _id: string;
  name: string;
  skills: ISkill[]; // Mảng object lấy về từ DB
  company: {
    _id: string;
    name: string;
    logo?: string;
  };
  salary: number;
  quantity: number;
  level: string;
  description: string;
  startDate: string; // Trả về dạng ISO String
  endDate: string;
  isActive: boolean;
  location: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateJobPayload {
  name: string;
  skills: string[]; // Mảng chứa ObjectId của Skill
  company: {
    _id: string;
    name: string;
  };
  salary: number;
  quantity: number;
  level: string;
  description: string;
  startDate: string | Date;
  endDate: string | Date;
  isActive: boolean;
  location: string;
}

export interface IUpdateJobPayload extends Omit<ICreateJobPayload, "company"> {
  _id: string;
  // Khi update Job, thông thường ta vẫn cho phép update Company, nhưng tùy logic Backend.
  // Dựa vào UpdateJobDto bạn gửi, nó kế thừa CreateJobDto, nghĩa là vẫn có object company.
  company: {
    _id: string;
    name: string;
  };
}
