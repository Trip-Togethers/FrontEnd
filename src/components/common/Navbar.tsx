import React from 'react';
import styled from 'styled-components';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { ReactComponent as LogoIcon } from '../../../public/svg/trip_together_logo.svg';
import LogoSrc from '../../../public/svg/trip_together_logo.svg';


const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #006D24;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height:40px;
  width:100%;
`;


const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 40px; /* 로고 크기 조정 */
    height: 40px;
  }
`;

const NavIcons = styled.div`
  display: flex;
  gap: 1rem;

  .icon {
    font-size: 1.25rem;
    cursor: pointer;
  }
`;

interface NavbarProps {
  onToggleSidebar: (content: 'user' | 'notifications') => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  return (
    <NavbarContainer>
      <Logo>
      <img src={LogoSrc} alt="Logo" style={{ width: '200px', height: '200px' }} />
      </Logo>
      <NavIcons>
        <FaBell className="icon" onClick={() => onToggleSidebar('notifications')} />
        <FaUserCircle className="icon" onClick={() => onToggleSidebar('user')} />
      </NavIcons>
    </NavbarContainer>
  );
};

export default Navbar;
