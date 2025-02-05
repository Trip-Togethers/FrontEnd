import React from 'react';
import styled from 'styled-components';

// 모달 배경 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

// 모달 창 스타일
const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

// 링크 스타일
const LinkButton = styled.a`
  text-decoration: none;
  color: #007bff;
  font-size: 16px;
  margin-top: 20px;
  &:hover {
    text-decoration: underline;
  }
`;
interface LinkModalProps {
    isOpen: boolean;
    link: string;
    onClose: () => void;
  }
  
  const LinkModal: React.FC<LinkModalProps> = ({ isOpen, link, onClose }) => {
    if (!isOpen) return null;
  
    return (
      <ModalOverlay onClick={onClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <h2>링크 확인</h2>
          <p>아래 링크를 클릭하세요:</p>
          <LinkButton href={link} target="_blank">
            {link}
          </LinkButton>
          <button onClick={onClose}>닫기</button>
        </ModalContent>
      </ModalOverlay>
    );
  };
  
  export default LinkModal;