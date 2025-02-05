import { CreateData } from "models/schedule.model"
import { requestHandler } from "./https"
import { getToken } from "@store/authStore"

export const createPlan = async (createData: CreateData) => {
  console.log(createData)
  return await requestHandler('post', '/trips', createData)
}

export const showPlan = async () => {
  const data = await requestHandler('get', '/trips');
  console.log(data); // data 확인
  return data; // data를 그대로 반환
}

export const showUsers = async (planId: number) => {
  const data = await requestHandler('get', `/trips/companions/${planId}`)
  console.log(data); // data 확인
  return data; // data를 그대로 반환
}

export const removePlan = async (planId: number) => {
  const data = await requestHandler('delete', `/trips/${planId}`)
  console.log(data);
  return data;
}

export const createLink = async (planId: number, owner: number) => {
  const data = await requestHandler(`post`, `trips/companions/${planId}/invite`, {owner})
  console.log(data);
  return data.link;
}