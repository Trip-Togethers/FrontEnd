import { httpClient } from "./https";

export const checkEmail = async (email: string) => {
  const response = await httpClient.get(`/auth/check-email?email=${email}`);
  return response.data;
};