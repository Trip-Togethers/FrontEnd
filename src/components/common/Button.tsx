import styled from "styled-components"
import { ButtonScheme, ButtonSize } from "../../styles/theme";
import '../../styles/font.css'

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
    font-family: 'JalnanGothic';
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