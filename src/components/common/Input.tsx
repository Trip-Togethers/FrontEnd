import React from 'react';
import styled from 'styled-components';

interface InputProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
}

// styled-components용 별도 타입
interface StyledInputProps {
  $error?: string;
}

const InputWrapper = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const StyledInput = styled.input<StyledInputProps>`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid ${({ $error }) => ($error ? '#ff4d4d' : '#ccc')};
  border-radius: 8px;
  outline: none;

  &:focus {
    border-color: ${({ $error }) => ($error ? '#ff4d4d' : '#007bff')};
  }
`;

const ErrorText = styled.div`
  color: #ff4d4d;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const Input: React.FC<InputProps> = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  error 
}) => (
  <InputWrapper>
    {label && <Label>{label}</Label>}
    <StyledInput
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      $error={error}  // error를 $error로 변경
    />
    {error && <ErrorText>{error}</ErrorText>}
  </InputWrapper>
);

export default Input;