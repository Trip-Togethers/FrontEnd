import Header from "../header/Header";
import styled from "styled-components";

interface LayoutProps{
    children: React.ReactNode;
}

function Layout({children}: LayoutProps){
    return(
        <>
        <Header/>
            <LayoutStyle>
                {children}
            </LayoutStyle>
        </>
    )
}

const LayoutStyle = styled.main`
    width : 100vw;
    height: 100vh;
    margin: 0 auto;
    padding-top: 2.7rem;
`;

export default Layout;