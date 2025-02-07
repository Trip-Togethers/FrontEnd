import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { getToken, removeToken } from '../store/authStore';

const BASE_URL = "http://3.39.232.234:80";
const DEFAULT_TIMEOUT = 30000;

// Axios 인스턴스 생성
export const createClient = (config?: AxiosRequestConfig) => {
    const axiosInstance = axios.create({
        baseURL: BASE_URL,
        timeout: DEFAULT_TIMEOUT,
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true, // 쿠키 포함
        ...config
    });

    // 요청 인터셉터 (Authorization 헤더 자동 추가)
    axiosInstance.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });
    return axiosInstance;
};

export const httpClient = createClient();

// Axios 인스턴스 생성
export const createClientFormData = (config?: AxiosRequestConfig) => {
    const axiosInstance = axios.create({
        baseURL: BASE_URL,
        timeout: DEFAULT_TIMEOUT,
        headers: {
            "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // 쿠키 포함
        ...config
    });

    // 요청 인터셉터 (Authorization 헤더 자동 추가)
    axiosInstance.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });
    return axiosInstance;
};

// 공통 요청 처리 함수
type RequestMethod = "get" | "post" | "put" | "delete";

export const requestHandler = async <T>(
    method: RequestMethod,
    url: string,
    payload?: T
) => {
    try {
        let response;

        switch (method) {
            case "post":
                response = await httpClient.post(url, payload, { withCredentials: true });
                console.log("POST:", url, payload);
                break;
            case "get":
                response = await httpClient.get(url, { withCredentials: true });
                console.log("GET:", url);
                break;
            case "put":
                response = await httpClient.put(url, payload, { withCredentials: true });
                console.log("PUT:", url, payload);
                break;
            case "delete":
                response = await httpClient.delete(url, { withCredentials: true });
                console.log("DELETE:", url);
                break;
            default:
                throw new Error("지원하지 않는 HTTP 메서드입니다.");
        }

        return response.data;
    } catch (error) {
        console.error(`API 요청 실패: ${method.toUpperCase()} ${url}`, error);
        throw error;
    }
};
