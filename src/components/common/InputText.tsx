import React, { ForwardedRef, useState } from "react";
import styled from "styled-components";

// 공통 Input 스타일 정의
const BaseInputStyle = styled.input`
  background-color: ${({ theme }) => theme.color.input_background};
  color: ${({ theme }) => theme.color.input_text};
  border: 1px solid ${({ theme }) => theme.color.input_background};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  padding: 0.75rem;
  font-family: ${({ theme }) => theme.font.family.contents};
  font-size: ${({ theme }) => theme.heading.small.fontSize};
  outline: none;
  width: 334px;
  height: 42px;

  &:focus {
    border-color: ${({ theme }) => theme.color.primary_green};
    box-shadow: 0 0 5px ${({ theme }) => theme.color.primary_green};
  }

  &::placeholder {
    color: ${({ theme }) => theme.color.name_gray};
    font-weight: ${({ theme }) => theme.font.weight.light};
  }
`;

// 기본 InputText 컴포넌트
const InputText = React.forwardRef(
  (
    { placeholder, inputType, onChange, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { inputType?: string },
    ref: ForwardedRef<HTMLInputElement>
  ) => <BaseInputStyle type={inputType} placeholder={placeholder} onChange={onChange} ref={ref} {...props} />
);

export default InputText;

// 이메일 Input
export const EmailInput = styled(InputText).attrs({
  inputType: "email",
  placeholder: "이메일",
})``;

// 비밀번호 Input
export const PasswordInput = styled(InputText).attrs(props => ({
  inputType: "password",
  placeholder: props.placeholder || "비밀번호",
}))``;

// 닉네임 Input
export const NicknameInput: React.FC = () => {
  const [nickname, setNickname] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value; // 명시적 타입 단언
    if (!isComposing) setNickname(value.replace(/[^a-zA-Z가-힣]/g, ""));
    else setNickname(value);
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false);
    const value = (e.target as HTMLInputElement).value; // 명시적 타입 단언
    setNickname(value.replace(/[^a-zA-Z가-힣]/g, ""));
  };

  return (
    <InputText
      inputType="text"
      placeholder="닉네임"
      value={nickname}
      onChange={handleChange}
      onCompositionStart={() => setIsComposing(true)}
      onCompositionEnd={handleCompositionEnd}
    />
  );
};


// 연락처 Input
export const ContactInput = styled(InputText).attrs({
  inputType: "text", // inputType을 "text"로 설정해도 숫자만 입력되도록 제어 가능
  placeholder: "연락처",
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 허용할 키 목록
    const allowedKeys = [
      "Backspace",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
      "Tab",
    ];
    // 숫자 키와 허용된 키만 입력 가능
    if (
      !/^[0-9]$/.test(e.key) && // 숫자 키가 아닌 경우
      !allowedKeys.includes(e.key) // 허용된 키가 아닌 경우
    ) {
      e.preventDefault(); // 비허용 키 입력 방지
    }
  },
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 입력된 값 중 숫자가 아닌 값 제거
    e.target.value = value.replace(/[^0-9]/g, "");
  },
})`
  -moz-appearance: textfield;
  -webkit-appearance: none;
  appearance: none;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

// 검색 Input
export const SearchInput = styled(InputText).attrs({
  inputType: "text",
  placeholder: "검색",
})`
  padding: 1.5rem;
  width: 260px;
  height: 40px;
  color: ${({ theme }) => theme.color.name_gray};
`;

//일정 추가 인풋
export const AddPlanInput = styled(InputText).attrs({
  inputType: "text",
  placeholder: "내용을 입력해 주세요.",
})`
  background-color: transparent;
  color: ${({ theme }) => theme.color.input_text};
  border: none; /* 상하좌우 경계를 제거 */
  border-bottom: 1px solid ${({ theme }) => theme.color.input_background}; /* 밑줄만 추가 */
  border-radius: 0; /* 둥근 모서리 제거 */
  padding: 0.75rem;
  font-family: ${({ theme }) => theme.font.family.contents};
  font-size: ${({ theme }) => theme.heading.small.fontSize};
  outline: none;
  width: 400px;
  height: 30px;

  /* 포커스 상태 */
  &:focus {
    border-bottom: 1px solid transparent /* 밑줄 색상 */
    box-shadow: none; /* 상하좌우 그림자 제거 */
  }

  /* 플레이스홀더가 표시될 때 색상 변경 */
  &:focus:placeholder-shown::placeholder {
    color: #E70000; /* 플레이스홀더 색상 빨간색 */
  }

  /* 텍스트가 입력된 상태에서 색상 변경 */
  &:focus:not(:placeholder-shown) {
    color: ${({ theme }) => theme.color.primary_green}; /* 텍스트 색상 초록색 */
  }

  /* 기본 플레이스홀더 스타일 */
  &::placeholder {
    color: ${({ theme }) => theme.color.name_gray};
    font-weight: ${({ theme }) => theme.font.weight.light};
  }
`;


export const PostTitleInput = styled(InputText).attrs({
  inputType: "text",
  placeholder: "제목을 작성해 주세요.",
})`
  width: 548px;
  height: 36px;
`;

export const PostContentInput = styled.textarea.attrs({
  placeholder: "내용을 입력해 주세요.",
})`
  width: 548px;
  height: 543px;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.color.primary_black};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  background-color: ${({ theme }) => theme.color.primary_white};
  color: ${({ theme }) => theme.color.input_text};
  font-family: ${({ theme }) => theme.font.family.contents};
  font-size: ${({ theme }) => theme.heading.small.fontSize};
  line-height: 1.5; /* 줄 간격 설정 */
  resize: none; /* 크기 조절 비활성화 */
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.color.primary_green};
    box-shadow: 0 0 5px ${({ theme }) => theme.color.primary_green};
  }

  &::placeholder {
    color: ${({ theme }) => theme.color.name_gray};
    font-weight: ${({ theme }) => theme.font.weight.light};
  }
`;