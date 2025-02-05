import { LoginProps } from "@pages/Login";
import { httpClient, requestHandler } from "./https";
import { RegisterProps } from "@pages/Join";

export interface SignupResponse {
  // 회원가입 서버 응답 데이터 타입 (Response Body)
  id: number;
  email: string;
  name: string;
  // password: string;
  contact: string;
}

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

  localStorage.setItem("token", response.data.token);
  return response.data;
};

interface LoginResponse {
  // 로그인 서버 응답 데이터 타입 (Response Body)
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export const logout = async () => {
  const response = await httpClient.delete(`/users/logout`, {
    withCredentials: true,
  });
  return response.data;
};

interface LoginResponse {
  // 로그인 서버 응답 데이터 타입 (Response Body)
  token: string;
}

export const verifyEmail = async (code: string) => {
  return await httpClient.post("/auth/verify-email", { code });
};
