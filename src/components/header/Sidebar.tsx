import styled from "styled-components";
import Avatar from "@assets/svg/Avatar";
import { Link } from "react-router-dom";
import { useAuthstore } from "@store/authStore";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar: React.FC<Props> = ({ isOpen }) => {
  if (!isOpen) return null; // 드롭다운이 닫혀 있으면 렌더링 안 함.
  const { storeLogout } = useAuthstore();

  return (
    <>
      <SidebarStyle>
        <div className="user">
          <Avatar className="avatar" />
          <span>참가자1</span>
        </div>
        <hr />
        <div className="list">
          <ul>
            <StyledLink to="/users/:user_id">
              <li>내 정보</li>
            </StyledLink>
            <StyledLink to="/posts">
              <li>커뮤니티</li>
            </StyledLink>
            <StyledLink to="/maps">
              <li>지도</li>
            </StyledLink>
            <StyledLink to="/calendar/:user_id">
              <li>내 캘린더</li>
            </StyledLink>
          </ul>
          <span className="logout" onClick={storeLogout}>
            로그아웃
          </span>
        </div>
      </SidebarStyle>
    </>
  );
};

const SidebarStyle = styled.div`
background-color: ${({ theme }) => theme.color.primary_white};
  color: ${({ theme }) => theme.color.input_text};
  display: flex;
  flex-direction: column;
  position: fixed;
  right: 0;
  text-align: center;
  border-left: 1px solid #afafaf;
  z-index: 1000; /* z-index를 높여서 다른 요소와 겹치지 않게 설정 */
  height: 100%;
  width: 20rem;
  margin-top: 2.7rem;
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

`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

export default Sidebar;
