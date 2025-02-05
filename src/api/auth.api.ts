import { LoginProps } from "@pages/Login";
import { httpClient } from "./https";
import { RegisterProps } from "@pages/Join";

export interface SignupResponse {
  // 회원가입 서버 응답 데이터 타입 (Response Body)
  id: number;
  email: string;
  name: string;
  // password: string;
  contact: string;
}

//테스트용-회원가입
export const signup = async (
  userData: RegisterProps
): Promise<SignupResponse> => {
  const response = await httpClient.post<SignupResponse>(
    `/users/register`,
    userData
  );
  return response.data;
};

export const login = async (userData: LoginProps) => {
  const response = await httpClient.post<{ token: string }>(
    `/users/login`,
    userData,
    { withCredentials: true }
  );

  localStorage.setItem("token", response.data.token)
  return response.data;
};

export const logout = async () => {
  const response = await httpClient.delete(`/users/logout`, { withCredentials: false });
  return response.data;
};

interface LoginResponse {
  // 로그인 서버 응답 데이터 타입 (Response Body)
  token: string;
}