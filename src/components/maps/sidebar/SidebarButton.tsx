import { styled } from "styled-components";

interface Props {
  icon: any;
  text: string;
  id: string;
	currentTab: string | null;
	isOpen: boolean;
  handleClick: () => void;
}

function SidebarButton({ icon, text, id, currentTab, isOpen, handleClick }: Props) {
  return (
    <SidebarButtonStyle 
			id={id} 
			onClick={handleClick}
			active={isOpen && currentTab === id}
		>
      <div>{icon}</div>
      <div>
        <p>{text}</p>
      </div>
    </SidebarButtonStyle>
  );
}

const SidebarButtonStyle = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  width: 50px;
  height: 70px;
  margin: 10px 0;

  div {
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      fill: ${({ active, theme }) =>
        active ? theme.color.primary_green : theme.color.name_gray};
      width: 50px;
      height: 50px;

			path {
				fill: ${({ active, theme }) =>
        active ? theme.color.primary_green : theme.color.name_gray};
			}
    }

    p {
      margin: 0;
      padding: 0;
      color: ${({ active, theme }) =>
        active ? theme.color.primary_green : theme.color.name_gray};
      font-family: ${({ theme }) => theme.font.family.default};
    }

    &:hover {
      cursor: pointer;
    }
  }
`;

export default SidebarButton;
