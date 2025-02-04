import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./postReducer";
import { planReducer } from "./planReducer";
import participantReducer from "./participantReducer";

// 공통 기본 타입 정의
export interface ImageInfo {
  url: string;
  originalName?: string;
  file?: File;
  toDelete?: boolean;
}

export interface Plan {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  image?: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
  hasLiked?: boolean;
  images?: ImageInfo[];
  planId?: string;
  planInfo?: Plan;
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