import { UserFormData } from "models/user.model";
import { httpClient } from "./https"

export const userPage = async (userId: number) => {
    const response = await httpClient.get(`/users/${userId}`, {
        withCredentials: true,
      });
    return response.data;
  }
  
  export const editUser = async (userId: number, userData: UserFormData) => {
    const response = await httpClient.put(`/users/${userId}`, userData, {
        withCredentials: true,
      });

    return response.data;
  }
