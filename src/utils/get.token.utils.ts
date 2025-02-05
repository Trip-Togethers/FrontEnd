import { jwtDecode } from "jwt-decode";

 export const getUserIdFromToken = (token: string): number | null => {
    try {
      const decoded: any = jwtDecode(token); // JWT 디코딩
      return decoded.userId || null; // 사용자 ID가 payload에 있다고 가정
    } catch (error) {
      console.error("토큰 디코딩 실패:", error);
      return null;
    }
  };
