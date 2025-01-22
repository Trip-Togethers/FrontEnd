import React, {useState} from 'react'
import Logo from "@assets/svg/Logo.tsx";
import Bell from '@assets/svg/Bell.tsx';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Avatar_1 from "@assets/svg/Avatar1.tsx"
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () =>{
    setIsOpen(!isOpen);
  };

  return (
    <>
      <HeaderStyle>
          <Logo className='logo'/>
          <div className='nav'>
            <Bell className='bell'/>
            <Avatar_1 className='avatar' onClick = {toggleDropdown}/>
          </div>
      </HeaderStyle>
      <Sidebar isOpen = {isOpen} onClose = {() => setIsOpen(false)}/>
    </>
  )
}

const HeaderStyle = styled.header`
  width : 100%;
  height: 2.7rem;
  top : 0;
  background-color: ${({theme}) => theme.color.primary_green};
  display: flex;
  flex-direction: row;
  align-items: center;
  position: fixed;
  z-index : 2;
  justify-content: space-between;

  .logo{
    height: 1.7rem;
    margin: 0.8rem 1.5rem;
  }
  
  .nav{
    display: flex;
    gap: 1rem;
    margin :1rem;
  }

  .bell,.avatar{
    fill : #ffffff;
    height: 2rem;
  }
`;

export default Header;