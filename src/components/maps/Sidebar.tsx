import { useState, useCallback } from "react";
import styled from "styled-components";
import SidebarButton from "./sidebar/SidebarButton";
import SidebarDetail from "./sidebar/SidebarDetail";
import { SIDEBAR_TAB_CONTENTS } from "../../constants/sidebarTabItem";

import { Bookmark } from "../../assets/svg";
import { Search } from "../../assets/svg";

const sidebarTabContents = [
  {
    id: SIDEBAR_TAB_CONTENTS.search.id,
    icon: <Search />,
    text: SIDEBAR_TAB_CONTENTS.search.text,
  },
  {
    id: SIDEBAR_TAB_CONTENTS.bookmark.id,
    icon: <Bookmark />,
    text: SIDEBAR_TAB_CONTENTS.bookmark.text,
  },
];

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<string | null>(null);

  const handleSidebarClick = useCallback(
    (id: string) => {
      if (currentTab === id) {
        setIsSidebarOpen(!isSidebarOpen);
      } else {
        setCurrentTab(id);
        setIsSidebarOpen(true);
      }
    },
    [currentTab, isSidebarOpen]
  );

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
      <SidebarDetail isOpen={isSidebarOpen} tab={currentTab} />
    </>
  );
}

export default Sidebar;

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