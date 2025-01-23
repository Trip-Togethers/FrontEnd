import styled from "styled-components";
import SidebarButton from "./SidebarButton";
import { theme } from "../../styles/theme";

import { Bookmark } from "../../assets/svg";
import { Search } from "../../assets/svg";

function Sidebar(){
  return (
    <SidebarContainer>
			<SidebarButton icon={<Search width={50} height={50} fill={theme.color.name_gray}/>} text="검색"/>			
			<SidebarButton icon={<Bookmark width={50} height={50} fill={theme.color.name_gray}/>} text="저장"/>
    </SidebarContainer>
  );
};

export default Sidebar;

const SidebarContainer = styled.div`
  width: 75px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  border-right: 1px solid ${theme.color.input_text};
  height: 100%;
`;