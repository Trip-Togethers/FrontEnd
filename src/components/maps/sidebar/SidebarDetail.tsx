import styled from "styled-components";
import { SIDEBAR_TAB_CONTENTS } from "../../../constants/sidebarTabItem";

import DetailBookmark from "../detail/DetailBookmark";
import DetailSearch from "../detail/DetailSearch";

interface Props {
	isOpen: boolean;
  tab: string | null;
}

function SidebarDetail({ isOpen, tab }: Props){

  return (
    <SidebarDetailContainer isOpen={isOpen}>
			{tab === SIDEBAR_TAB_CONTENTS.search.id && <DetailSearch />}
      {tab === SIDEBAR_TAB_CONTENTS.bookmark.id && <DetailBookmark />}
    </SidebarDetailContainer>
  );
};

export default SidebarDetail;

const SidebarDetailContainer = styled.div<{ isOpen: boolean }>`
	z-index: 5;
	position: absolute;
	left: ${({ isOpen }) => (isOpen ? "75px" : "-400px")};
  width: 310px;
  height: 100%;	
  background-color: #fff;
  padding: 10px 0;
	box-shadow: ${({ theme }) => theme.shadow.default};
  transition: left 0.3s ease-in-out;
`;