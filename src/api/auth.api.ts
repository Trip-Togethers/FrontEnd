import { LoginProps } from "@/pages/Login";
import {httpClient} from "./https";
import { RegisterProps } from "@/pages/Join";

//회원가입
// export const signup = async (userData: RegisterProps) => {
//   const response = await httpClient.post(`/users/register`, userData);
//   return response.data; 
// };

//테스트용-회원가입
export const signup = async (userData: RegisterProps) => {
  const response = await httpClient.post(`https://jsonplaceholder.typicode.com/posts`, userData);
  return response.data;
};

//로그인
// export const login = async (userData: LoginProps) => {
//   const response = await httpClient.post(`/users/register`, userData);
//   return response.data;
// };

interface LoginResponse{
  token: string;
}

//테스트용-로그인
export const login = async (userData: LoginProps) => {
  const response = await httpClient.post<LoginResponse>(`https://jsonplaceholder.typicode.com/posts`, userData);
  return response.data;
};




