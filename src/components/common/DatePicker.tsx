import React, { useState } from 'react';
import styled from 'styled-components';
import '../../styles/font.css';
import { theme } from '../../styles/theme';

interface DatePickerProps {
  label?: string;
  value?: Date;
  onChange?: (date: Date) => void;
  error?: string;
  minDate?: Date; 
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  error,
  minDate, 
}) => {
  const [selectedDate, setSelectedDate] = useState(value || new Date());
  const currentYear = new Date().getFullYear();

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: new Date(2000, i).toLocaleString('default', { month: 'long' })
  }));

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleChange = (type: 'year' | 'month' | 'day', value: number) => {
    const newDate = new Date(selectedDate);
    if (type === 'year') newDate.setFullYear(value);
    if (type === 'month') newDate.setMonth(value);
    if (type === 'day') newDate.setDate(value);

    if (!minDate || newDate >= minDate) {
      setSelectedDate(newDate);
      onChange?.(newDate);
    }
  };

  return (
    <DatePickerContainer>
      {label && <Label>{label}</Label>}
      <SelectGroup>
        <Select
          value={selectedDate.getFullYear()}
          onChange={(e) => handleChange('year', Number(e.target.value))}
        >
          {years.map(year => (
            <option key={year} value={year}>{year}년</option>
          ))}
        </Select>
        <Select
          value={selectedDate.getMonth()}
          onChange={(e) => handleChange('month', Number(e.target.value))}
        >
          {months.map(month => (
            <option key={month.value} value={month.value}>{month.label}</option>
          ))}
        </Select>
        <Select
          value={selectedDate.getDate()}
          onChange={(e) => handleChange('day', Number(e.target.value))}
        >
          {Array.from(
            { length: getDaysInMonth(selectedDate.getFullYear(), selectedDate.getMonth()) },
            (_, i) => i + 1
          ).map(day => (
            <option key={day} value={day}>{day}일</option>
          ))}
        </Select>
      </SelectGroup>
      {error && <ErrorText>{error}</ErrorText>}
    </DatePickerContainer>
  );
};


export default DatePicker;

const DatePickerContainer = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  font-family: ${theme.font.family.contents};
`;

const Label = styled.label`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  display: block;
  color: ${theme.color.primary_black};
  font-weight: ${theme.font.weight.bold};
`;

const SelectGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  border: none;
`;

const Select = styled.select`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid ${theme.color.input_background};
  border-radius: ${theme.borderRadius.default};
  font-size: 1rem;
  cursor: pointer;
  background-color: ${theme.color.card_background};
  color: ${theme.color.input_text};
  font-family: ${theme.font.family.contents};

  &:focus {
    outline: none;
    border-color: ${theme.color.primary_green};
  }

  option {
    background-color: ${theme.color.primary_white};
    color: ${theme.color.primary_black};
  }

    &::-webkit-scrollbar {
    width: 8px; /* 스크롤바 너비 */
  }

  &::-webkit-scrollbar-track {
    background: ${theme.color.input_background}; /* 스크롤바 트랙 색상 */
    border-radius: 10px; /* 트랙 둥글게 */
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.color.primary_green}; /* 스크롤바 색상 */
    border-radius: 10px; /* 스크롤바 둥글게 */
    border: 2px solid ${theme.color.input_background}; /* 스크롤바 테두리 */
  }
`;

const ErrorText = styled.p`
  color: ${theme.color.primary_red};
  font-size: 1.5rem;
  margin-top: 0.25rem;
  width: 100%;
  text-align: left;
  font-family: ${theme.font.family.contents};
`;