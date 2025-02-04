import { create } from "zustand";

interface StoreState {
  isLoggedIn: boolean;
  storeLogin: (token: string) => void;
  storeLogout: () => void;
}

interface AuthState {
  email: string | null;
  setEmail: (email: string) => void;
}

export const getToken = () => {
  const token = localStorage.getItem("token");

  return token;
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
  storeLogout: () => {
    set({ isLoggedIn: false });
    window.location.href = "users/login";
    removeToken();
  },
}));

export const useEmail = create<AuthState>((set) => ({
  email: null,
  setEmail: (email) => set({ email }),
}));
