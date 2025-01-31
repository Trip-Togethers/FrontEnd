import styled from "styled-components";
import SidebarButton from "./sidebar/SidebarButton";
import { SIDEBAR_TAB_TEXT } from "../../constants/sidebarTabItem";

import { Bookmark } from "@assets/svg";
import { Search } from "@assets/svg";

const sidebarTabContents = [
  {
    id: SIDEBAR_TAB_TEXT.search.id,
    icon: <Search />,
    text: SIDEBAR_TAB_TEXT.search.text,
  },
  {
    id: SIDEBAR_TAB_TEXT.bookmark.id,
    icon: <Bookmark />,
    text: SIDEBAR_TAB_TEXT.bookmark.text,
  },
];

interface Props {
  // children: any;
  isSidebarOpen: boolean;
  currentTab: string | null;
  handleSidebarClick: (id: string) => void;
}

function SidebarTab({ 
  isSidebarOpen, 
  currentTab,
  handleSidebarClick,
}: Props) {

  return (
    <>
      <SidebarContainer>
        {sidebarTabContents.map((item) => (
          <SidebarButton
            id={item.id}
            icon={item.icon}
            text={item.text}
            handleClick={() => handleSidebarClick(item.id)}
						currentTab={currentTab}
						isOpen={isSidebarOpen}
          />
        ))}
      </SidebarContainer>
    </>
  );
}

export default SidebarTab;

const SidebarContainer = styled.div`
  z-index: 10;
  width: 75px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  border-right: 1px solid ${({ theme }) => theme.color.input_text};
  height: 100%;
`;