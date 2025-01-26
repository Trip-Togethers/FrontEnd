import styled from "styled-components"
import { ButtonScheme, ButtonSize } from "../../styles/theme";
import '@/styles/font.css'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    size: ButtonSize
    scheme: ButtonScheme
    disabled?: boolean;
    isLoading?: boolean;
}

// styled-components용 별도 타입 정의
interface StyledButtonProps {
    $size: ButtonSize;
    $scheme: ButtonScheme;
    disabled?: boolean;
    isLoading?: boolean;
}

function Button({children, size, scheme, disabled, 
    isLoading, ...props}: Props) {
    return <ButtonStyle 
        $size={size} 
        $scheme={scheme}
        disabled={disabled} 
        isLoading={isLoading} 
        {...props}
    >
        {children}
    </ButtonStyle>
}

const ButtonStyle = styled.button<StyledButtonProps>`
    font-size: ${({ theme, $size }) => theme.button[$size].fontSize};
    padding: ${({ theme, $size }) => theme.button[$size].padding};
    color: ${({ theme, $scheme }) => theme.buttonScheme[$scheme].color};
    background-color: ${({ theme, $scheme }) => theme.buttonScheme[$scheme].backgroundColor};
    border: 0;
    border-radius: ${({ theme }) => theme.borderRadius.default};
    opacity: ${({disabled}) => (disabled? 0.5 : 1)};
    pointer-events: ${({disabled}) => (disabled? "none" : "auto")};
    cursor: ${({disabled}) => (disabled? "none" : "pointer")};
`;

export default Button;

// 새 계획 생성 버튼
    export const CreatePlanButton = styled(Button).attrs({
    size: "medium",
    scheme: "primary",
    children: "+ 새 계획 생성",
   })`
    font-family: ${({theme}) => theme.font.family.contents};
    font-weight: ${({theme}) => theme.font.weight.light}; 
    font-size: 1.25rem;
    background-color: ${({theme}) => theme.color.primary_green};
    color: ${({theme}) => theme.color.primary_white};
    border-radius: ${({theme}) => theme.borderRadius.default};
    padding: ${({theme}) => theme.button.small.padding};
    width: 200px;
    height: 40px;
    &:hover {
        opacity: 0.8;
    }
      &:active {
        transform: scale(0.98);
    }
   `;
   
   // 삭제 버튼 
   export const DeleteButton = styled(Button).attrs({
    size: "medium",
    scheme: "alert",
    children: "삭제",
   })`
    font-family: ${({theme}) => theme.font.family.contents};
    font-weight: ${({theme}) => theme.font.weight.normal}; 
    font-size: 1.25rem;
    color: ${({theme}) => theme.color.primary_white};
    border-radius: ${({theme}) => theme.borderRadius.default};
    padding: ${({theme}) => theme.button.small.padding};
    width: 76px;
    height: 41px;
    
     &:hover {
        opacity: 0.8;
    }
      &:active {
        transform: scale(0.98);
    }
   `;
   
   // 취소 버튼
   export const CancelButton = styled(Button).attrs({
    size: "large",
    scheme: "alert",
    children: "취소"
   })`
    font-family: ${({theme}) => theme.font.family.contents};
    font-weight: ${({theme}) => theme.font.weight.normal}; 
    font-size: 1.25rem;
    background-color: ${({theme}) => theme.color.input_background};
    color: ${({theme}) => theme.color.input_text};
    border-radius: ${({theme}) => theme.borderRadius.default};
    padding: ${({theme}) => theme.button.small.padding};
    width: 76px;
    height: 41px;
     &:hover {
        opacity: 0.8;
    }
      &:active {
        transform: scale(0.98);
    }
   `;
   
   // 회원가입/로그인 버튼
   export const LoginButton = styled(Button).attrs({
    size: "large",
    scheme: "primary",
    children: "로그인"
   })`
        font-family: ${({theme}) => theme.font.family.content}; 
        font-size: 1.25rem;
        color: ${({theme}) => theme.color.primary_white};
        border-radius: ${({theme}) => theme.borderRadius.default};
        padding: ${({theme}) => theme.button.small.padding};
        width: 94px;
        height: 41px;
      
        &:hover {
        opacity: 0.8;
    }
      &:active {
        transform: scale(0.98);
    }      
   `;
   
   // 모달 일정 생성하기 버튼
   export const ModalPlanButton = styled(Button).attrs({
    size: "medium",
    scheme: "primary",
    children: "생성 하기"
   })`
    font-family: ${({theme}) => theme.font.family.contents};
    font-weight: ${({theme}) => theme.font.weight.normal}; 
    font-size: 1.2rem;
    background-color: ${({theme}) => theme.color.primary_green};
    color: ${({theme}) => theme.color.primary_white};
    border-radius: ${({theme}) => theme.borderRadius.default};
    padding: ${({theme}) => theme.button.small.padding};
    width: 112px;
    height: 41px;
         &:hover {
        opacity: 0.8;
    }
      &:active {
        transform: scale(0.98);
    }
   `;
   
 // 수정하기 버튼
    export const EditButton = styled(Button).attrs({
    size: "medium",
    scheme: "primary",
    children: "수정 하기"
   })`
    font-family: ${({theme}) => theme.font.family.contents};
    font-weight: ${({theme}) => theme.font.weight.normal}; 
    font-size: 1.2rem;
    background-color: ${({theme}) => theme.color.primary_green};
    color: ${({theme}) => theme.color.primary_white};
    border-radius: ${({theme}) => theme.borderRadius.default};
    padding: ${({theme}) => theme.button.small.padding};
    width: 112px;
    height: 41px;

         &:hover {
        opacity: 0.8;
    }
      &:active {
        transform: scale(0.98);
    }
   `;

   // 확인버튼
   export const CheckButton = styled(Button).attrs({
    size: "large",
    scheme: "primary",
    children: "확인"
   })`
    font-family: ${({theme}) => theme.font.family.contents};
    font-weight: ${({theme}) => theme.font.weight.normal}; 
    font-size: 1.25rem;
    color: ${({theme}) => theme.color.primary_white};
    border-radius: ${({theme}) => theme.borderRadius.default};
    padding: ${({theme}) => theme.button.small.padding};
    width: 76px;
    height: 41px;

         &:hover {
        opacity: 0.8;
    }
      &:active {
        transform: scale(0.98);
    }
   `;

   // 회원가입 버튼
   export const JoinButton = styled(Button).attrs({
    size: "large",
    scheme: "primary",
    children: "회원가입"
 })`
    font-family: ${({theme}) => theme.font.family.contents};
    font-weight: ${({theme}) => theme.font.weight.normal};
    font-size: 1.25rem;
    background-color: ${({theme}) => theme.color.primary_white};
    color: ${({theme}) => theme.color.primary_green};
    border-radius: ${({theme}) => theme.borderRadius.default};
    padding: ${({theme}) => theme.button.small.padding};
    width: 112px;
    height: 41px;
    text-decoration: underline;

         &:hover {
        opacity: 0.8;
    }
      &:active {
        transform: scale(0.98);
    }
 `;


 // 회원탈퇴 버튼
    export const WithdrawButton = styled(Button).attrs({
    size: "large",
    scheme: "primary",
    children: "탈퇴하기"
 })`
    font-family: ${({theme}) => theme.font.family.contents};
    font-weight: ${({theme}) => theme.font.weight.normal};
    font-size: 1rem;
    background-color: ${({theme}) => theme.color.primary_white};
    color: ${({theme}) => theme.color.input_text};
    border-radius: ${({theme}) => theme.borderRadius.default};
    padding: ${({theme}) => theme.button.small.padding};
    width: 112px;
    height: 41px;
    text-decoration: underline;

         &:hover {
        opacity: 0.8;
    }
      &:active {
        transform: scale(0.98);
    }
 `;

 export const AddPostButton = styled(Button).attrs({
    size: "medium",
    scheme: "primary",
    children: "글쓰기"
   })`
    font-family: ${({theme}) => theme.font.family.default};
    font-weight: ${({theme}) => theme.font.weight.normal}; 
    font-size: 1.2rem;
    background-color: ${({theme}) => theme.color.primary_green};
    color: ${({theme}) => theme.color.primary_white};
    border-radius: ${({theme}) => theme.borderRadius.default};
    padding: ${({theme}) => theme.button.small.padding};
    width: 102px;
    height: 33px;

         &:hover {
        opacity: 0.8;
    }
      &:active {
        transform: scale(0.98);
    }
   `;
