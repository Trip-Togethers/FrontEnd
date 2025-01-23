import React from 'react';
import styled from 'styled-components';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { ReactComponent as LogoIcon } from '../../../public/svg/trip_together_logo.svg';
import LogoSrc from '../../../public/svg/trip_together_logo.svg';




interface NavbarProps {
  onToggleSidebar: (content: 'user' | 'notifications') => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  return (
    <NavbarContainer>
      <Logo>
        <img src={LogoSrc} alt="Logo" />
      </Logo>
      <NavIcons>
        <FaBell 
          className="icon" 
          onClick={() => onToggleSidebar('notifications')} 
        />
        <FaUserCircle 
          className="icon" 
          onClick={() => onToggleSidebar('user')} 
        />
      </NavIcons>
    </NavbarContainer>
  );
};

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  margin: 0;
  background-color: #006D24;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 40px;
  width: 100%;
  top: 0;
  z-index: 1000;
  left: 0;
  padding: 0 20px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  margin-right: 10px;  
  padding-left: 0;

  img {
    height: 35px;
    width: auto;
    object-fit: contain;
    margin-left: 10px;
  }
`;

const NavIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-right: 20px;
  .icon {
    font-size: 1.5rem;
    color: white;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }
  }
`;

export default Navbar;
