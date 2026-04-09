export interface ISubscriber {
  _id?: string;
  name: string;
  email: string;
  skills: string[]; // Lưu danh mục/thể loại quần áo yêu thích
  createdAt?: string;
  updatedAt?: string;
}

export interface IUpdateSubscriberPayload {
  name?: string;
  skills: string[];
}
