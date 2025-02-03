import { httpClient } from "./https";

export const checkEmail = async (email: string) => {
  const response = await httpClient.post("/users/verify-email", { email });
  return response.data;
};
