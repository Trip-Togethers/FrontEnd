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

//회원가입
// export const signup = async (userData: RegisterProps) => {
//   const response = await httpClient.post(`/users/register`, userData);
//   return response.data;
// };

//테스트용-회원가입
export const signup = async (
  userData: RegisterProps
): Promise<SignupResponse> => {
  const response = await httpClient.post<SignupResponse>(
    `https://jsonplaceholder.typicode.com/posts`,
    userData
  );
  return response.data;
};

//로그인
// export const login = async (userData: LoginProps) => {
//   const response = await httpClient.post(`/users/register`, userData);
//   return response.data;
// };

interface LoginResponse {
  // 로그인 서버 응답 데이터 타입 (Response Body)
  token: string;
}

//테스트용-로그인
export const login = async (userData: LoginProps) => {
  const response = await httpClient.post<LoginResponse>(
    `https://jsonplaceholder.typicode.com/posts`,
    userData
  );
  return response.data;
};