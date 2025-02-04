import axios, { AxiosRequestConfig } from "axios";

// 모든 요청에 기본적으로 포함되는 설정
const BASE_URL = "http://localhost:5173"; // 백엔드 URL로 변경 필요
const DEFAULT_TIMEOUT = 30000;

export const createClient = (config?: AxiosRequestConfig) => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: DEFAULT_TIMEOUT,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, // 쿠키 자동 전송
    ...config,
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        document.cookie =
          "jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; HttpOnly;";
        window.location.href = "/users/login"; // 로그인 페이지로 이동
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const httpClient = createClient();
