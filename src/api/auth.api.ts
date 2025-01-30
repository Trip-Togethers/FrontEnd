import {httpClient} from "./https";
import { RegisterProps } from "@/pages/Join";

// export const signup = async (userData: RegisterProps) => {
//   const response = await httpClient.post(`/users/register`, userData);
//   return response.data; 
// };

//테스트용
export const signup = async (userData: RegisterProps) => {
  const response = await httpClient.post(`https://jsonplaceholder.typicode.com/posts`, userData);
  return response.data;
};


