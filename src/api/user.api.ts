import { UserFormData } from "models/user.model";
import { createClientFormData, httpClient } from "./https";

export const userPage = async (userId: number) => {
  const response = await httpClient.get(`/users/${userId}`, {
    withCredentials: true,
  });
  return response.data;
};

export const editUser = async (userId: number, userData: FormData) => {
  const axiosInstance = createClientFormData(); // Axios 인스턴스 생성
  try {
    const response = await axiosInstance.put(`/users/${userId}`, userData);
    console.log("유저 수정 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("유저 수정 실패:", error);
    throw error;
  }
};

export const getUserInfo = async (tripId: number) => {
  const response = await httpClient.get(`/trips/companions/${tripId}`, {
    withCredentials: true,
  });
  return response.data;
};

export const addUser = async () => {};
