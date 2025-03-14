import { CreateSubData } from "models/schedule.model";
import { createClientFormData, requestHandler } from "./https";

export const showDetailPlan = async(tripId: number) => {
 const data = await requestHandler('get', `/trips/activities/${tripId}`);
  console.log(data); // data 확인
  return data; // data를 그대로 반환
}

export const createSubPlan = async(tripId: number, createData: CreateSubData) => {
  const data = await requestHandler('post', `/trips/activities/${tripId}`, createData);
  console.log(data); // data 확인
  return data;
}

export const editSubPlan = async(tripId: number, detailId: number, createData: CreateSubData) => {
  const data = await requestHandler('put', `/trips/activities/${tripId}/${detailId}`, createData);
  console.log(data); // data 확인
  return data;
}

export const removeSubPlan = async(tripId: number, detailId: number) => {
  const data = await requestHandler('delete', `/trips/activities/${tripId}/${detailId}`);
  console.log(data); // data 확인
  return data;
}
