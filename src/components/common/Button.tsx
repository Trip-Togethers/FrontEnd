import styled from "styled-components"
import { ButtonScheme } from "@/styles/theme"
import '@/styles/font.css'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    scheme: ButtonScheme
    disabled?: boolean;
    isLoading?: boolean;
}

const Button = ({children, scheme, disabled, 
    isLoading, ...props}: Props) =>{
    return <ButtonStyle 
        scheme={scheme}
        disabled={disabled} 
        isLoading={isLoading} 
        {...props}
    >
        {children}
    </ButtonStyle>
}

const ButtonStyle = styled.button<Omit<Props, "children">>`
    font-family: ${({ theme }) => theme.font.family.contents};
    font-weight: ${({ theme }) => theme.font.weight.light};
    font-size: ${({ theme }) => theme.button.default.fontSize};
    padding: ${({ theme }) => theme.button.default.padding};
    color: ${({ theme, scheme }) => theme.buttonScheme[scheme].color};
    background-color: ${({ theme, scheme }) => theme.buttonScheme[scheme].backgroundColor};
    border: 0;
    border-radius: ${({ theme }) => theme.borderRadius.default};
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
    pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
    cursor: ${({ disabled }) => (disabled ? "none" : "pointer")};
    min-width: 4.75rem;
    max-width: fit-content; /* 부모 크기보다 커지지 않도록 */
    display: inline-block; 
    align-items: center;
    white-space: nowrap; 

    &:hover {
        opacity: 0.8;
    }
    &:active {
        transform: scale(0.98);
    }
`;

export default Button;