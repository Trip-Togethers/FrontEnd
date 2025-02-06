import { httpClient } from "./https";

export const getUserPlan = async (userId: number) => {
  const response = await httpClient.get(`/calendar/${userId}`, {
    withCredentials: true,
  });
  return response.data;
};
