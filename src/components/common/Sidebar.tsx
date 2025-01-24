import React, { useEffect } from "react";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import "@/styles/font.css"

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'JalnanGothic'; 
  }`


interface SidebarProps {
  $isOpen: boolean;
  onClose: () => void;
  content: "user" | "notifications";
  notifications?: { title: string; description: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({
  $isOpen,
  onClose,
  content,
  notifications = [],
}) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      if (sidebar && !sidebar.contains(event.target as Node)) {
        onClose();
      }
    };

    if ($isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [$isOpen, onClose]);

  return (
    <>
    <GlobalStyle />
      <Overlay $isOpen={$isOpen} onClick={onClose} />
      <SidebarContainer id="sidebar" $isOpen={$isOpen}>
        <ProfileSection>
          <ProfileCircle />
          <Nickname>사용자 닉네임</Nickname>
        </ProfileSection>
        <Divider />
        {content === "user" ? (
          <Menu>
            <MenuItem>내 정보</MenuItem>
            <MenuItem>커뮤니티</MenuItem>
            <MenuItem>지도</MenuItem>
            <MenuItem>내 캘린더</MenuItem>
          </Menu>
        ) : (
          <NotificationList>
            {notifications.map((notification, index) => (
              <NotificationItem key={index}>
                <div className="title">{notification.title}</div>
                <div className="description">{notification.description}</div>
              </NotificationItem>
            ))}
          </NotificationList>
        )}
        <LogoutButton>로그아웃</LogoutButton>
      </SidebarContainer>
    </>
  );
};

const SidebarContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 40px; /* 네비게이션바 높이 */
  right: ${({ $isOpen }) => ($isOpen ? "0" : "-100%")};
  width: 320px;
  height: calc(100% - 40px); /* 네비게이션바 높이 제외 */
  background-color: #ffffff;
  box-shadow: -2px 0 6px rgba(0, 0, 0, 0.2);
  transition: right 0.3s ease-in-out;
  z-index: 20;
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  position: fixed;
  top: 40px; /* 네비게이션바 높이 */
  left: 0;
  width: 100%;
  height: calc(100% - 40px); /* 네비게이션바 높이 제외 */
  background: rgba(0, 0, 0, 0.4);
  z-index: 5;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
`;

const ProfileCircle = styled.div`
  width: 80px;
  height: 80px;
  background-color: #e0e0e0;
  border-radius: 50%;
  margin-bottom: 0.5rem;
`;

const Nickname = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: #545454;
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: #616161;
  margin: 1rem 0;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

const MenuItem = styled.button`
  font-size: 1rem;
  font-weight: 500;
  color: #006d24;
  background: none;
  border: none;
  text-align: center;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const NotificationList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NotificationItem = styled.div`
  .title {
    font-size: 1rem;
    font-weight: bold;
    color: #006d24;
    margin-bottom: 0.5rem;
  }
  .description {
    font-size: 0.875rem;
    color: #545454;
  }
`;

const LogoutButton = styled.button`
  font-size: 1rem;
  font-weight: bold;
  color: #e70000;
  background: none;
  border: none;
  margin-top: auto;
  margin-bottom: 2rem;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
    color: #ff4d4d;
  }
`;

export default Sidebar;
