import { PostData } from "models/schedule.model";
import { createClientFormData, httpClient, requestHandler } from "./https";
import { Post } from "@store/store";

export const showPlans = async () => {
  const data = await requestHandler("get", "/calendar");
  console.log(data); // data 확인
  return data; // data를 그대로 반환
};

export const showPost = async (postId: number) => {
  const data = await requestHandler("get", `/posts/${postId}`);
  console.log(data);
  return data;
};

export const addPost = async (postData: Post) => {
  const axiosInstance = createClientFormData(); // Axios 인스턴스 생성

  const formData = new FormData();

  // createData 객체의 속성들을 formData에 추가
  formData.append("postTitle", postData.title);
  formData.append("postContent", postData.content);

  // 이미지 파일이 존재하면 해당 파일을 formData에 추가
  // 이미지 URL 배열이 존재하면 해당 URL들을 formData에 추가
  if (postData.image) {
    formData.append("image", postData.image);
  }

  if (postData.tripId) {
    formData.append("tripId", postData.tripId.toString())
  }

  try {
    const response = await axiosInstance.post("/posts", formData); // 'trips' 엔드포인트로 POST 요청
    console.log("플랜 생성 성공:", response.data);

    return response.data;
  } catch (error) {
    console.error("플랜 생성 실패:", error);
    throw error;
  }
};

// 이미지 없이 게시글 수정 (JSON 요청)
export const updatePost = async (postId: number, postData: { postTitle: string; postContent: string }) => {
  try {
    const response = await httpClient.put(`/posts/${postId}`, postData, {
        withCredentials: true,
      });
      return response.data;
  } catch (error) {
    console.error("게시글 수정 실패:", error);
    throw error;
  }
};

// 이미지 포함 게시글 수정 (FormData 요청)
export const updatePostWithImage = async (postId: number, formData: FormData) => {
  try {
    const axiosInstance = createClientFormData(); // Axios 인스턴스 생성
    const response = await axiosInstance.put(`/posts/${postId}`, formData)
    return response.data;
  } catch (error) {
    console.error("이미지 포함 게시글 수정 실패:", error);
    throw error;
  }
};

export const showPosts = async () => {
  const data = await requestHandler("get", "/posts");
  console.log(data);
  return data;
};

export const showDetailPosts = async (postId: number) => {
  const data = await requestHandler("get", `/posts/${postId}`);
  console.log(data);
  return data;
};

export const deleteDetailPosts = async (postId: number) => {
  const data = await requestHandler("delete", `/posts/${postId}`);
  console.log(data);
  return data;
};

export const like = async (postId: number) => {
  const data = await requestHandler("post", `/posts/${postId}/like`);
  console.log(data);
  return data;
}

export const addComemnts = async (postId: number, content: string) => {
  const data = await requestHandler("post", `/posts/${postId}/comments`, { comments: content })
  console.log(data);
  return data;
}

export const showComments = async (postId: number) => {
  const data = await requestHandler("get", `/posts/${postId}/comments`)
  console.log(data);
  return data;
}

export const editComments = async (postId: number, commentId: number, content: string) => {
  const data = await requestHandler("put", `/posts/${postId}/comments/${commentId}`, { comments: content })
  console.log(data);
  return data;
}

export const deleteComments = async (postId: number, commentId: number) => {
  const data = await requestHandler("delete", `/posts/${postId}/comments/${commentId}`)
  console.log(data);
  return data;
}