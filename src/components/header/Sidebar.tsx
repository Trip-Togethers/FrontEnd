import React, {useRef, useEffect} from 'react'
import styled from 'styled-components'
import Avatar_1 from "@assets/svg/Avatar1.tsx"

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<Props> = ({isOpen, onClose}) => {
    // const sidebarRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     const handleClickOutside = (event: MouseEvent) => {
    //     if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
    //         onClose(); // 바깥 클릭 시 드롭다운 닫기
    //     }
    //     };

    //     if (isOpen) {
    //     document.addEventListener("mousedown", handleClickOutside);
    //     } else {
    //     document.removeEventListener("mousedown", handleClickOutside);
    //     }

    //     return () => {
    //     document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, [isOpen, onClose]);

    if (!isOpen) return null; // 드롭다운이 닫혀 있으면 렌더링 안 함.

    return (
        <>
        <SidebarStyle>
            <div className='user'>
                <Avatar_1 className='avatar'/>
                <span>참가자1</span>
            </div>
            <hr/>
            <div className='list'>
                <ul>
                    <li>내 정보</li>
                    <li>커뮤니티</li>
                    <li>지도</li>
                    <li>내 캘린더</li>
                </ul>
                <span className='logout'>로그아웃</span>
            </div>  
        </SidebarStyle>
        </>
  )
}

const SidebarStyle = styled.div`
    background-color : ${({theme}) => theme.color.primary_white};
    color : ${({theme}) => theme.color.input_text};
    display: flex;
    flex-direction: column;
    position : fixed;
    right : 0;
    text-align : center;
    border-left: 1px solid #afafaf;
    z-index : 1;
    height: 100%;
    width: 20rem;
    margin-top: 2.7rem;
    font-family: ${({theme}) => theme.font.family.contents};

    .avatar{
        height: 10rem;
        margin: 3rem 0 1rem;
    }

    .user{
        color: ${({theme}) => theme.color.name_gray};
        display: flex;
        flex-direction: column;
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    hr{
        width: 80%;
        border: none;
        height: 0.5px;
        background-color: ${({theme}) => theme.color.input_text};
    }

    .list{
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 50vh;
        justify-content: space-between;
    }

    ul{
        list-style-type: none;
        padding: 0;
        font-family: ${({theme}) => theme.font.family.title};
        font-weight: ${({theme}) => theme.font.weight.light};
        li{
            margin-bottom:1rem;
            opacity: 0.5;s
            font-family: ${({theme}) => theme.font.family.title};
            font-weight: ${({theme}) => theme.font.weight.light};
            &:hover{
                color: ${({theme}) => theme.color.primary_green};
                text-decoration: underline 0.5px;
                opacity: 1;
                }
            }
        }

    .logout{
        text-decoration: underline 0.5px;
        opacity: 0.6;
        margin: 10 auto 0; /* 리스트 아래쪽으로 배치 */
        &:hover{
                opacity: 1;
                }
            }
    }
`;

export default Sidebar;