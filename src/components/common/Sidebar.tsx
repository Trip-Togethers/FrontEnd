import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';


interface SidebarProps {
  $isOpen: boolean;
  onClose: () => void;
  content: 'user' | 'notifications';
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, content }) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      if (sidebar && !sidebar.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <Overlay $isOpen={isOpen} onClick={onClose} />
      <SidebarContainer id="sidebar" $isOpen={isOpen}>
        <Header>{content === 'user' ? 'user' : 'Notifications'}</Header>
        <Content>
          {content === 'user' ? (
            <>
              <MenuItem to="/" className="active">
                Home
              </MenuItem>
              <MenuItem to="/user">내 정보</MenuItem>
              <MenuItem to="/settings">Settings</MenuItem>
            </>
          ) : (
            <>
              <NotificationItem>
                <div className="icon">🔔</div>
                <div className="content">
                  <div className="title">New Message</div>
                  <div className="description">You have a new message from John.</div>
                </div>
              </NotificationItem>
              <NotificationItem>
                <div className="icon">🔔</div>
                <div className="content">
                  <div className="title">System Update</div>
                  <div className="description">System update is scheduled at midnight.</div>
                </div>
              </NotificationItem>
            </>
          )}
        </Content>
      </SidebarContainer>
    </>
  );
};

const SidebarContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: ${({ $isOpen }) => ($isOpen ? '0' : '-320px')};
  width: 320px;
  height: 100%;
  background-color: #ffffff;
  box-shadow: -2px 0 6px rgba(0, 0, 0, 0.2);
  transition: right 0.3s ease-in-out;
  z-index: 10;
  display: flex;
  flex-direction: column;
`;

const Overlay = styled.div<{ isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 5;
`;

const Header = styled.div`
  padding: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
  background-color: #007bff;
  text-align: center;
`;

const Content = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
`;

const MenuItem = styled(Link)`
  display: block;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: #333;
  background-color: #f9f9f9;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #007bff;
    color: #ffffff;
  }

  &.active {
    background-color: #0056b3;
    color: #ffffff;
  }
`;

const NotificationItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #e9ecef;
  }

  .icon {
    font-size: 1.5rem;
    color: #007bff;
    margin-right: 1rem;
  }

  .content {
    flex: 1;

    .title {
      font-size: 1rem;
      font-weight: bold;
    }

    .description {
      font-size: 0.875rem;
      color: #555;
    }
  }
`;


export default Sidebar;
