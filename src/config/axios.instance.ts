// src/config/axios.instance.ts
import axios from "axios";

// Lấy base URL từ biến môi trường Vite
const baseURL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api/v1";

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true, // BẮT BUỘC để browser tự động gửi/nhận cookie (chứa refresh_token)
});

// Interceptor cho Request: Trực tiếp gắn Token trước khi gửi đi
axiosInstance.interceptors.request.use(
  function (config) {
    // Lấy access_token từ localStorage (hoặc Zustand/Redux tùy bạn)
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// Tạm thời khai báo Interceptor cho Response (Chúng ta sẽ thêm logic Refresh Token ở đây sau khi có hàm call API refresh)
axiosInstance.interceptors.response.use(
  function (response) {
    // Trả về thẳng data cho gọn, thay vì phải .data mỗi lần call
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  function (error) {
    // Xử lý lỗi tập trung ở đây (ví dụ show Toast error)
    if (error?.response?.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
