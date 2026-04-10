const DEFAULT_BACKEND_URL = "http://localhost:8000/api/v1";

export const getSocketBaseUrl = (): string => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL || DEFAULT_BACKEND_URL;

  try {
    const parsedUrl = new URL(apiUrl);
    const trimmedPath = parsedUrl.pathname.replace(/\/api(?:\/v\d+)?\/?$/, "");
    return `${parsedUrl.origin}${trimmedPath}`;
  } catch {
    return apiUrl.replace(/\/api(?:\/v\d+)?\/?$/, "");
  }
};
