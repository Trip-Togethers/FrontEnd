import { LoginProps } from "@pages/Login";
import { httpClient } from "./https";
import { RegisterProps } from "@pages/Join";

export interface SignupResponse {
  id: number;
  email: string;
  name: string;
  contact: string;
}

// 회원가입 요청
export const signup = async (
  userData: RegisterProps
): Promise<SignupResponse> => {
  const response = await httpClient.post<SignupResponse>(
    `/users/register`,
    userData
  );
  return response.data;
};

// 일반 로그인 요청
export const login = async (userData: LoginProps) => {
  const response = await httpClient.post<{ token: string }>(
    `/users/login`,
    userData,
    { withCredentials: true }
  );
  return response.data;
};

// 구글 로그인 요청
export const googleLogin = async (idToken: string) => {
  const response = await httpClient.post<{ token: string }>(
    `/users/login/social`,
    { token: idToken },
    { withCredentials: true }
  );
  return response.data;
};

// 로그아웃 요청
export const logout = async () => {
  const response = await httpClient.delete(`/users/logout`, {
    withCredentials: true,
  });
  return response.data;
};
