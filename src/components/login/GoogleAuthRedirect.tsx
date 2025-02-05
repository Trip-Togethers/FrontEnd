import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthstore } from "@store/authStore";

function GoogleAuthRedirect() {
  const navigate = useNavigate();
  const { storeLogin } = useAuthstore();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      storeLogin(token); // JWT 저장
      navigate("/trips"); // 로그인 후 메인 페이지 이동
    } else {
      navigate("users/login"); // 실패 시 로그인 페이지로 이동
    }
  }, [navigate, storeLogin]);

  return <div>로그인 중...</div>;
}

export default GoogleAuthRedirect;
