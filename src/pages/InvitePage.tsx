import { httpClient } from '@api/https';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const InvitePage = () => {
console.log("랜더링됨")
  const navigate = useNavigate();
  const { tripId, userId, inviteCode } = useParams();
  console.log(tripId, userId, inviteCode);  // 파라미터 값 확인

  useEffect(() => {
    console.log("useEffect 실행중")
    const token = localStorage.getItem('token');
    
    // 토큰이 없다면 바로 로그인 페이지로 리다이렉션
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/users/login");
      return; // 토큰이 없으면 여기서 더 이상 진행하지 않음
    }

    // 토큰이 있을 경우 API 요청
    httpClient
      .get(`/trips/companions/${tripId}/invite/${userId}/${inviteCode}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          // 백엔드에서 인증 오류 발생 시
          const message = error.response.data.message || "알 수 없는 오류 발생";
          alert(message); // 에러 메시지를 알림으로 띄움
        } else {
          // 기타 에러
          console.error("API 요청 실패", error);
        }
      });
  }, [navigate, tripId, userId, inviteCode]);

  return (
    <div>
      <h1>초대 페이지</h1>
      {/* 초대 페이지 내용 */}
    </div>
  );
};

export default InvitePage;
