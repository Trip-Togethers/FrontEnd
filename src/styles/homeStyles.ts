import styled from 'styled-components';
import Button from '@/components/common/Button.tsx';


export const HomeStyle = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 40px;
  min-height: calc(100vh - 40px);
  overflow: hidden; 
`;

const Container = styled.div`
   display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0;    
  margin: 0;       
  position: relative;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(200px, 1fr));
  grid-auto-rows: min-content;
  gap: 2rem;
  padding: 2rem;
  width: fit-content;
  margin: 0 auto;
  height: calc(100vh - 120px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #006D24;
    border-radius: 3px;
  }
`;

const PlanCard = styled.div`
  position: relative;
  font-family: "BMJUA";
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(12, 1, 1, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0.5rem;
  overflow: hidden;
  height: 200px;
  width: 200px;
  margin: 0;

  img {
    width: 100%;
    height: 140px;
    object-fit: cover;
    border-radius: 8px;
  }

  .placeholder {
    width: 100%;
    height: 140px;
    background-color: #f0f0f0;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #666;
  }

  h3 {
    font-size: 0.85rem;
    color: #333;
    margin: 0.25rem 0;
  }

  p {
    font-size: 0.75rem;
    margin: 0.15rem 0;
  }
`;

export const Navigation = styled.div`
  font-family: "BMJUA";
  display: flex;
  justify-content: center;  
  align-items: center;
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem 1rem;
  width: 300px;
  z-index: 10;

  // 배경색과 그림자 제거
  background-color: transparent;
  box-shadow: none;
  
  span {
    margin: 0 1rem;  // < > 버튼과 숫자 사이 간격
    color: #006D24;  
  }
`;

const NavButton = styled.button`
  font-family: "BMJUA";
  position: sticky;
  bottom: 0.5rem;
  color: #616161;
  border: none;
  background: transparent;  
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1.2rem;  

  &:disabled {
    color: #ccc;  
    cursor: not-allowed;
    background: transparent;  
  }
`;

export const NewPlanButton = styled(Button)`
  font-family: "BMJUA";
  position: fixed;
  bottom: 5vh; 
  right: 5vw;  
  margin-left: auto;  
  width: 10vw;
  height: 5vh;
  background-color: #006D24;
  color: #ffffff;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  
  z-index: 10;

  &:hover {
    background-color: #0056b3;
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;  // left를 right로 변경
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: #f0f0f0;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #E70000;
  z-index: 2;
  
  &:hover {
    background-color: #E70000;
    color: white;
  }
`;

const AlertOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const AlertBox = styled.div`
  font-family: 'BMJUA';
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 300px;

  h4 {
    margin-bottom: 10px;
    color: #333;
  }

  p {
    margin-bottom: 20px;
    color: #666;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const AlertButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: "BMJUA";

  &:first-child {
    background-color: #E70000;
    color: white;
  }

  &:last-child {
    background-color: #f1f1f1;
    color: #333;
  }
`;

const CardContent = styled.div`
  font-family: 'BMJUA';
  padding: 0.5rem;
  text-align: center;
`;

const ParticipantsList = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: flex;
  align-items: center;
`;

const ParticipantsImages = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid white;
    margin-right: -8px;
    object-fit: cover;
  }
`;

const ExtraParticipants = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #E0E0E0;
  color: #616161;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  margin-left: 4px;
`;

const ParticipantsDropdown = styled.div`
  position: absolute;
  bottom: 40px;
  left: 0;
  width: 280px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 16px;
`;

const ParticipantItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  margin-bottom: 8px;

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 12px;
  }

  .name {
    flex: 1;
  }

  button {
    padding: 4px 8px;
    background: none;
    border: none;
    color: #E70000;
    cursor: pointer;
  }
`;

const InviteLink = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #E0E0E0;

  .link-box {
    display: flex;
    align-items: center;
    background: #F5F5F5;
    padding: 8px;
    border-radius: 4px;
    margin-top: 8px;

    input {
      flex: 1;
      border: none;
      background: none;
      font-size: 14px;
    }

    button {
      padding: 4px 8px;
      background: none;
      border: none;
      color: #006D24;
      cursor: pointer;
    }
  }
`;

