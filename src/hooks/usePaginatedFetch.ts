// src/hooks/usePaginatedFetch.ts
import { useState, useEffect, useCallback } from "react";
import type { IBackendRes, IModelPaginate } from "../types/backend";

// Định nghĩa kiểu trả về của Hook
interface UsePaginatedFetchResult<T> {
  data: T[];
  total: number;
  isLoading: boolean;
  error: string;
  current: number;
  pageSize: number;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  refetch: () => Promise<void>;
}

export const usePaginatedFetch = <T>(
  apiCall: (
    current: number,
    pageSize: number,
    qs?: string,
  ) => Promise<IBackendRes<IModelPaginate<T>>>,
  initialPageSize: number = 5,
  queryString?: string,
): UsePaginatedFetchResult<T> => {
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  // Dùng useCallback để tránh hàm bị tạo lại vô tận, fix lỗi ESLint dependency
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await apiCall(current, pageSize, queryString);
      if (res && res.data) {
        setData(res.data.result);
        setTotal(res.data.meta.total);
      }
    } catch (err) {
      const errorResponse = err as { message?: string };
      setError(errorResponse?.message || "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, current, pageSize, queryString]); // Dependencies của fetchData

  // Tự động gọi lại API khi dependencies thay đổi
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Chỉ phụ thuộc vào fetchData đã được memoize

  return {
    data,
    total,
    isLoading,
    error,
    current,
    pageSize,
    setCurrent,
    setPageSize,
    refetch: fetchData,
  };
};
