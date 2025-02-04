import React, { useState } from "react";
import Logo from "@assets/svg/Logo";
import Bell from "@assets/svg/Bell";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import Avatar from "@assets/svg/Avatar";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <HeaderStyle>
        <Link to="/trips">
          <Logo className="logo" />
        </Link>
        <div className="nav">
          <Bell className="bell" />
          <Avatar className="avatar" onClick={toggleDropdown} />
        </div>
      </HeaderStyle>
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
`;

export default Header;
