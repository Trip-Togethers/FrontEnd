import React from 'react';
import styled from 'styled-components';
import '@/styles/font.css'

interface ModalInputProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

interface StyledInputProps {
  $hasValue: boolean;
  $error?: string;
}


const ModalInput: React.FC<ModalInputProps> = ({
    label,
    name,
    value = '',
    onChange,
    error
  }) => {
    const hasValue = value?.length > 0;
  
    return (
      <InputWrapper>
        {label && <Label>{label}</Label>}
        <StyledInput
          name={name}
          value={value}
          onChange={onChange}
          $hasValue={hasValue}
          $error={error}
          placeholder={error || '내용을 입력해주세요'}
        />
      </InputWrapper>
    );
  };

const InputWrapper = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  font-family: 'BMJUA';
  color: #333;
`;

const StyledInput = styled.input<StyledInputProps>`
  width: 100%;
  padding: 0.75rem 0;
  border: none;
  border-bottom: 1px solid ${({ $hasValue, $error }) => {
    if ($error) return '#E70000';
    return $hasValue ? '#006D24' : '#E0E0E0';
  }};
  outline: none;
  font-family: 'BMJUA';
  font-size: 1rem;
  color: ${({ $hasValue }) => ($hasValue ? '#006D24' : '#616161')};
  background: transparent;
  transition: all 0.3s ease;

  &::placeholder {
    color: #E70000;
    opacity: 1; /* Firefox에서 placeholder 투명도 조정 */
  }

  &:focus::placeholder {
    opacity: 0;
    transition: opacity 0.3s ease;
  }
`;

const Placeholder = styled.span<{ $visible: boolean }>`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  color: #E70000;
  pointer-events: none;
  transition: all 0.3s ease;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
`;

export default ModalInput;