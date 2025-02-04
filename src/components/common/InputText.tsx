import React, { ForwardedRef } from "react";
import styled from "styled-components";
import { InputScheme } from "@/styles/theme";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  scheme: InputScheme;
  label?: string;
}

// 기본 InputText 컴포넌트
const InputText = React.forwardRef(
  (
    { scheme, label, ...props }: InputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <InputTextStyle>
        {label && <LabelStyle>{label}</LabelStyle>}
        <StyledInput scheme={scheme} ref={ref} {...props} />
      </InputTextStyle>
    );
  }
);

const InputTextStyle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledInput = styled.input<InputProps>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.color.input_background};
  color: ${({ theme }) => theme.color.input_text};
  border: 1px solid ${({ theme }) => theme.color.input_background};
  border-radius: 10px;
  padding: 0.75rem;
  font-family: ${({ theme }) => theme.font.family.contents};
  font-size: ${({ theme, scheme }) => theme.inputScheme[scheme].fontSize};
  font-weight: ${({ theme }) => theme.font.weight.light};
  outline: none;
  width: ${({ theme, scheme }) => theme.inputScheme[scheme].width};
  height: ${({ theme, scheme }) => theme.inputScheme[scheme].height};

  &:focus {
    border-color: ${({ theme }) => theme.color.primary_green};
  }

  &::placeholder {
    color: ${({ theme }) => theme.color.name_gray};
    font-weight: ${({ theme }) => theme.font.weight.light};
  }
`;

const LabelStyle = styled.label`
  display: flex;
  align-items: center;
  text-align: left;
  justify-content: center;
  font-family: ${({ theme }) => theme.font.family.title};
  font-size: 1.25rem;
  font-weight: ${({ theme }) => theme.font.weight.light};
  color: ${({ theme }) => theme.color.primary_black};
  opacity: 0.75;
  padding-right: 20px;
  width: 128px; /* 일정한 너비를 유지 */
`;

export default InputText;
