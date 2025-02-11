import React, { useEffect, useState } from "react";
import Logo from "@assets/svg/Logo";
import Bell from "@assets/svg/Bell";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import Avatar from "@assets/svg/Avatar";
import { Link } from "react-router-dom";
import { getUserIdFromToken } from "@utils/get.token.utils";
import { userPage } from "@api/user.api";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null); // 유저 정보를 저장할 상태

  const toggleDropdown = () => {
    setIsOpen((prevState) => {
    const newState = !prevState;
    return newState;
  });
  };

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
    <>
      <HeaderStyle>
        <Link to="/trips">
          <Logo className="logo" />
        </Link>
        <div className="nav">
          <Bell className="bell" />
          <div className="avatar_icon" onClick={toggleDropdown}>
            {userData?.profile_picture ? (
              <img src={userData.profile_picture} className="profile_img" />
            ) : (
              <Avatar />
            )}
          </div>
        </div>
      </HeaderStyle>
      {/* isOpen 상태를 Sidebar에 전달하여 슬라이딩 애니메이션이 정상적으로 동작하도록 수정 */}
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

const HeaderStyle = styled.header`
  width: 100%;
  height: 2.7rem;
  top: 0;
  background-color: ${({ theme }) => theme.color.primary_green};
  display: flex;
  flex-direction: row;
  align-items: center;
  position: fixed;
  z-index: 2;
  justify-content: space-between;

  .logo {
    height: 1.7rem;
    margin: 0.8rem 1.5rem;
    fill: #ffffff;
  }

  .nav {
    display: flex;
    gap: 1rem;
    margin: 1rem;
  }

  .bell,
  .avatar {
    fill: #ffffff;
    height: 2rem;
  }

  .avatar_icon {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer; /* 클릭 시 커서가 손 모양으로 변경 */
  }

  .profile_img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

export default Header;
