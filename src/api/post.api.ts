import { requestHandler } from "./https";

export const showPlans = async () => {
  const data = await requestHandler('get', '/calendar');
  console.log(data); // data 확인
  return data; // data를 그대로 반환
}