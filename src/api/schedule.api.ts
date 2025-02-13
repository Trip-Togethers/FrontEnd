import { CreateData, EditData } from "models/schedule.model"
import { createClientFormData, requestHandler } from "./https"

export const createPlan = async (createData: CreateData) => {
  const axiosInstance = createClientFormData(); // Axios 인스턴스 생성

  const formData = new FormData();

  // createData 객체의 속성들을 formData에 추가
  formData.append('title', createData.title);
  formData.append('destination', createData.destination);
  
  // Date를 문자열로 변환하여 추가
  formData.append('startDate', createData.startDate.toISOString().split('T')[0]); // 'YYYY-MM-DD' 형식으로 변환
  formData.append('endDate', createData.endDate.toISOString().split('T')[0]); // 'YYYY-MM-DD' 형식으로 변환

  // 이미지 파일이 존재하면 해당 파일을 formData에 추가
  if (createData.image) {
    formData.append('image', createData.image); // image는 파일 객체여야 함
  }

  try {
    const response = await axiosInstance.post('/trips', formData); // 'trips' 엔드포인트로 POST 요청
    console.log('플랜 생성 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('플랜 생성 실패:', error);
    throw error;
  }
}

export const editPlan = async (createData: EditData, tripId : number) => {
  const axiosInstance = createClientFormData(); // Axios 인스턴스 생성

  const formData = new FormData();

  // createData 객체의 속성들을 formData에 추가
  if (createData.title) formData.append('title', createData.title);
  if (createData.destination) formData.append('description', createData.destination);
  
  // Date를 문자열로 변환하여 추가
  if (createData.startDate) 
    formData.append('startDate', createData.startDate.toISOString().split('T')[0]); // 'YYYY-MM-DD' 형식으로 변환
  if (createData.endDate) 
    formData.append('endDate', createData.endDate.toISOString().split('T')[0]); // 'YYYY-MM-DD' 형식으로 변환

  // 이미지 파일이 존재하면 해당 파일을 formData에 추가
  if (createData.photoUrl) {
    formData.append('image', createData.photoUrl); // image는 파일 객체여야 함
  }

  try {
    const response = await axiosInstance.put(`/trips/${tripId}`, formData); // 'trips' 엔드포인트로 POST 요청
    console.log('플랜 수정 성공:', response.data);

    return response.data;
  } catch (error) {
    console.error('플랜 수정 실패:', error);
    throw error;
  }
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