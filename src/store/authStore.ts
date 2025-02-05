import { create } from "zustand";

interface StoreState {
  isLoggedIn: boolean;
  storeLogin: (token: string) => void;
  storeLogout: () => void;
}

// export const getToken = () => {
//   const token = localStorage.getItem("token");
//   return token;

interface AuthState {
  email: string | null;
  setEmail: (email: string) => void;
}

export const getToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
};

const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const useAuthstore = create<StoreState>((set) => ({
  isLoggedIn: getToken() ? true : false, // 초기값
  storeLogin: (token: string) => {
    set({ isLoggedIn: true });
    setToken(token);
  },
  storeLogout: async () => {
    try {
      await logout();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
    set({ isLoggedIn: false });
    removeToken();
    window.location.href = "/users/login";
  },
}));

export const useEmail = create<AuthState>((set) => ({
  email: null,
  setEmail: (email) => set({ email }),
}));
