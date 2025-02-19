import { useState, useEffect } from "react";
import styled from "styled-components";
import Avatar from "@assets/svg/Avatar";
import { Link, useNavigate } from "react-router-dom";
import { useAuthstore } from "@store/authStore";
import { userPage } from "@api/user.api"; // userPage API import
import { getUserIdFromToken } from "@utils/get.token.utils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar: React.FC<Props> = ({ isOpen }) => {
  const [userData, setUserData] = useState<any>(null); // 유저 정보를 저장할 상태
  const { storeLogout } = useAuthstore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 가져오기
      if (!token) {
        return;
      }

      const userId = getUserIdFromToken(token); // 토큰에서 userId 가져오기
      if (!userId) {
        return;
      }

      try {
        const response = await userPage(userId); // userPage API 호출
        setUserData({ ...response.user, userId }); // 유저 정보 저장
      } catch (error) {
        console.error("유저 정보를 가져오는 데 실패했습니다.");
      }
    };

    fetchUserData();
  }, []);

  return (
    <SidebarStyle $isOpen={isOpen}>
      <div className="user">
        {userData ? (
          <>
            <div className="img-box">
              {userData.profile_picture ? (
                <img src={userData.profile_picture} />
              ) : (
                <Avatar />
              )}
            </div>
            {userData.nickname ? (
              <span>{userData.nickname}</span>
            ) : (
              <span>노래하는 오소리</span>
            )}
          </>
        ) : (
          <span>Loading...</span>
        )}
      </div>
      <hr />
      <div className="list">
        <ul>
          <StyledLink to={`/users/${userData?.userId}`}>
            <li>내 정보</li>
          </StyledLink>
          <StyledLink to="/posts">
            <li>커뮤니티</li>
          </StyledLink>
          <StyledLink to="/maps">
            <li>지도</li>
          </StyledLink>
          <StyledLink to={`/calendar`}>
            <li>내 캘린더</li>
          </StyledLink>
        </ul>
        <span className="logout" onClick={storeLogout}>
          로그아웃
        </span>
      </div>
    </SidebarStyle>
  );
};

const SidebarStyle = styled.div<{ $isOpen: boolean }>`
  background-color: ${({ theme }) => theme.color.primary_white};
  color: ${({ theme }) => theme.color.input_text};
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  right: 0;
  text-align: center;
  border-left: 1px solid #afafaf;
  z-index: 1000;
  height: 100%;
  width: 20rem;
  margin-top: 2.7rem;

  /* 애니메이션 적용 */
  transform: ${({ $isOpen }) => ($isOpen ? "translateX(0)" : "translateX(100%)")};
  transition: transform 0.3s ease-in-out; /* 슬라이딩 애니메이션이 적용되는 부분 */
  
  font-family: ${({ theme }) => theme.font.family.contents};

  /* 사이드바가 일정과 겹치지 않도록 하단 여백 추가 */
  @media (max-width: 768px) {
    margin-top: 0; /* 모바일에서는 top 값 조정 */
    margin-bottom: 0;
  }

  .avatar {
    height: 10rem;
    margin: 3rem 0 1rem;
  }

  .user {
    color: ${({ theme }) => theme.color.name_gray};
    display: flex;
    flex-direction: column;
    align-items: center; /* 수직 중앙 정렬 */
    justify-content: center;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  hr {
    width: 80%;
    border: none;
    height: 0.5px;
    background-color: ${({ theme }) => theme.color.input_text};
  }

  .list {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 50vh;
    justify-content: space-between;
  }

  ul {
    list-style-type: none;
    padding: 0;
    font-family: ${({ theme }) => theme.font.family.title};
    font-weight: ${({ theme }) => theme.font.weight.light};
    li {
      text-decoration: none;
      margin-bottom: 1rem;
      opacity: 0.5;
      font-family: ${({ theme }) => theme.font.family.title};
      font-weight: ${({ theme }) => theme.font.weight.light};
      &:hover {
        color: ${({ theme }) => theme.color.primary_green};
        text-decoration: underline 0.5px;
        opacity: 1;
      }
    }
  }

  .logout {
    text-decoration: underline 0.5px;
    opacity: 0.6;
    margin: 10 auto 0;
    &:hover {
      opacity: 1;
    }
  }

  .img-box {
    margin: 40px;
    display: flex;
    justify-content: center; /* 수평 중앙 정렬 */
    align-items: center; /* 수직 중앙 정렬 */
    width: 10rem; /* 원하는 크기로 조정 */
    height: 10rem; /* 정사각형 유지 */
    border-radius: 50%; /* 원형 */
    overflow: hidden; /* 이미지가 넘치지 않도록 */
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

export default Sidebar;
