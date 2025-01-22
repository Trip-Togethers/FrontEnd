import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';

interface SingleDropDownProps {
 value: number;
 options: number[];
 onChange: (value: number) => void;
 type: string;
 isOpen: boolean; 
 onToggle: () => void;
}

const SingleDropDown: React.FC<SingleDropDownProps> = ({
 value,
 options,
 onChange,
 type,
 isOpen,
 onToggle
}) => {
 return (
   <DropDownContainer>
     <SelectBox onClick={onToggle}>
       <SelectText>{String(value).padStart(2, '0')}</SelectText>
       <Triangle $isOpen={isOpen}>▼</Triangle>
     </SelectBox>
     {isOpen && (
       <OptionContainer>
         {options.map((option) => (
           <Option
             key={`${type}-${option}`}
             onClick={() => {
               onChange(option);
               onToggle();
             }}
             isSelected={option === value}
           >
             {String(option).padStart(2, '0')}
           </Option>
         ))}
       </OptionContainer>
     )}
   </DropDownContainer>
 );
};

interface DropDownProps {
 value: Date;
 onChange: (date: Date) => void;
}

const DropDown: React.FC<DropDownProps> = ({ value, onChange }) => {
 const [openDropdown, setOpenDropdown] = useState<string | null>(null);

 useEffect(() => {
   const handleClickOutside = (event: MouseEvent) => {
     const target = event.target as HTMLElement;
     if (!target.closest('.date-dropdown')) {
       setOpenDropdown(null);
     }
   };

   document.addEventListener('mousedown', handleClickOutside);
   return () => {
     document.removeEventListener('mousedown', handleClickOutside);
   };
 }, []);

 const years = useMemo(() => {
   const currentYear = value.getFullYear();
   return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
 }, [value]);

 const months = Array.from({ length: 12 }, (_, i) => i + 1);

 const getDaysInMonth = (year: number, month: number) => {
   return new Date(year, month, 0).getDate();
 };

 const days = Array.from(
   { length: getDaysInMonth(value.getFullYear(), value.getMonth() + 1) },
   (_, i) => i + 1
 );

 const handleSelect = (type: 'year' | 'month' | 'day', num: number) => {
   const newDate = new Date(value);
   switch (type) {
     case 'year':
       newDate.setFullYear(num);
       break;
     case 'month':
       newDate.setMonth(num - 1);
       break;
     case 'day':
       newDate.setDate(num);
       break;
   }
   onChange(newDate);
 };

 return (
   <DateContainer className="date-dropdown">
     <SingleDropDown
       type="year"
       value={value.getFullYear()}
       options={years}
       onChange={(num) => handleSelect('year', num)}
       isOpen={openDropdown === 'year'}
       onToggle={() => setOpenDropdown(openDropdown === 'year' ? null : 'year')}
     />
     <Separator>년</Separator>
     <SingleDropDown
       type="month"
       value={value.getMonth() + 1}
       options={months}
       onChange={(num) => handleSelect('month', num)}
       isOpen={openDropdown === 'month'}
       onToggle={() => setOpenDropdown(openDropdown === 'month' ? null : 'month')}
     />
     <Separator>월</Separator>
     <SingleDropDown
       type="day"
       value={value.getDate()}
       options={days}
       onChange={(num) => handleSelect('day', num)}
       isOpen={openDropdown === 'day'}
       onToggle={() => setOpenDropdown(openDropdown === 'day' ? null : 'day')}
     />
     <Separator>일</Separator>
   </DateContainer>
 );
};

const DateContainer = styled.div`
 display: flex;
 align-items: center;
 gap: 8px;
`;

const Separator = styled.span`
 color: #616161;
 font-size: 14px;
`;

const DropDownContainer = styled.div`
 position: relative;
 width: 70px;
`;

const SelectBox = styled.div`
 display: flex;
 align-items: center;
 justify-content: space-between;
 padding: 8px 0;
 cursor: pointer;

 &::after {
   content: '';
   position: absolute;
   left: 0;
   bottom: 0;
   width: 100%;
   height: 1px;
   background-color: #E0E0E0;
 }
`;

const SelectText = styled.span`
 color: #616161;
 font-size: 16px;
`;

const Triangle = styled.span<{ $isOpen: boolean }>`
 color: #616161;
 transform: ${({ $isOpen }) => $isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
 transition: transform 0.2s ease;
 font-size: 12px;
`;

const OptionContainer = styled.div`
 position: absolute;
 top: calc(100% + 4px);
 left: 0;
 width: 100%;
 background-color: #FFFFFF;
 border: 1px solid #E0E0E0;
 border-radius: 4px;
 z-index: 1000;
 box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
 max-height: 200px;
 overflow-y: auto;

 &::-webkit-scrollbar {
   width: 4px;
 }

 &::-webkit-scrollbar-track {
   background: #f1f1f1;
 }

 &::-webkit-scrollbar-thumb {
   background: #888;
   border-radius: 2px;
 }
`;

const Option = styled.div<{ isSelected: boolean }>`
 padding: 8px;
 text-align: center;
 cursor: pointer;
 color: ${({ isSelected }) => isSelected ? '#006D24' : '#616161'};
 background-color: ${({ isSelected }) => isSelected ? '#FFFFFF' : 'transparent'};

 &:hover {
   background-color: ${({ isSelected }) => isSelected ? '#FFFFFF' : '#f5f5f5'};
 }
`;

export default DropDown;