import { create } from "zustand";
import { logout } from "../api/auth.api";

interface StoreState {
  isLoggedIn: boolean;
  storeLogin: (token: string) => void;
  storeLogout: () => Promise<void>;
}

export const getToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
};

export const useAuthstore = create<StoreState>((set) => ({
  isLoggedIn: !!getToken(),

  storeLogin: (token: string) => {
    document.cookie = `token=${token}; path=/; secure; samesite=strict`;
    set({ isLoggedIn: true });
  },

  storeLogout: async () => {
    try {
      await logout();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    set({ isLoggedIn: false });
    window.location.href = "/users/login";
  },
}));
