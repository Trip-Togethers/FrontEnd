import { requestHandler } from "./https";

export const showDetailPlan = async(tripId: number) => {
 const data = await requestHandler('get', `/trips/activities/${tripId}`);
  console.log(data); // data 확인
  return data; // data를 그대로 반환
}
