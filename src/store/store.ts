import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./postReducer.js";
import { planReducer } from "./planReducer.js";
import participantReducer from "./participantReducer.js";

// 공통 기본 타입 정의
export interface ImageInfo {
  url: string;
  originalName?: string;
  file?: File;
  toDelete?: boolean;
}

export interface Guest {
  name: string;
  // 추가적인 게스트 정보가 있으면 여기에 정의
}

export interface Schedule {
  id: number;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  photoUrl: string;
  owner: number;
  guests: string[]; // 여기에 guest 목록이나 정보가 들어갈 수 있습니다.
}

export interface Plan {
  id: number;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  image?: string;
  guests: Guest[]; // 여기서 guests 배열의 타입을 정의
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id?: string;
  title: string;
  content: string;
  author: string;
  createdAt?: string;
  likes: number;
  comments?: Comment[];
  hasLiked?: boolean;
  image: File | null | string;
  planId?: string;
  planInfo?: Plan;
  tripId?: string | "";
}

export interface GetPost {
  id: number;
  postTitle: string; // 기존 'title'을 'postTitle'로 변경
  postContent: string;
  postPhotoUrl: string;
  author: {
    nick: string;
    profile: string;
  };
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments_count: number;
}

// State 인터페이스
export interface PostState {
  posts: Post[];
}

export interface PlanState {
  plans: Plan[];
}

export interface ParticipantsState {
  [planId: string]: string[];
}

// Store 설정
export const store = configureStore({
  reducer: {
    post: postReducer,
    plan: planReducer,
    participants: participantReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;