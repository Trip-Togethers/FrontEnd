import { httpClient } from "./https";

export const checkEmail = async (email: string) => {
  try {
    const response = await httpClient.post("/users/verify-email", { email });
    return response.data;
  } catch (error) {
    throw new Error("이메일 확인 중 오류가 발생했습니다.");
  }
};
