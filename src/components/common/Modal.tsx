// Modal.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import Button from '@/components/common/Button';
import { AddPlanInput } from '@/components/common/InputText';

interface ModalProps {
    type: 'plan' | 'schedule';
    onSubmit?: (plan: any) => void;
  }
interface TodoItem {
 content: string;
 time: string;
}

const Modal: React.FC<ModalProps> = ({ type, onSubmit }) => {
 const [isOpen, setIsOpen] = useState(false);
 const [title, setTitle] = useState("");
 const [description, setDescription] = useState("");
 const today = new Date();
const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
 const [todos, setTodos] = useState<TodoItem[]>([]);
 const [todoContent, setTodoContent] = useState("");
 const [selectedTime, setSelectedTime] = useState("09:00 AM");
 const [selectedImage, setSelectedImage] = useState<File | null>(null);
 const [imagePreview, setImagePreview] = useState<string>("");

 


const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (file) {
   setSelectedImage(file);
   // 이미지 미리보기 생성
   const reader = new FileReader();
   reader.onloadend = () => {
     setImagePreview(reader.result as string);
   };
   reader.readAsDataURL(file);
 }
};

const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({
      title,
      description,
      startDate,
      endDate,
      image: imagePreview
    });
    setTitle("");
    setDescription("");
    setStartDate(new Date()); // 새로운 오늘 날짜로 리셋
    setEndDate(new Date()); // 새로운 오늘 날짜로 리셋
    setSelectedImage(null);
    setImagePreview("");
    setIsOpen(false);
  };

 const handleTodoSubmit = (e: React.FormEvent) => {
   e.preventDefault();
   if (todoContent.trim()) {
     setTodos([...todos, { content: todoContent, time: selectedTime }]);
     setTodoContent("");
   }
 };

 const isFormValid = () => {
    if (type === 'plan') {
      return title.trim() !== "" && description.trim() !== "";
    }
    return true; // schedule 타입일 경우
  };

 if (!isOpen) {
   return (
     <CreateButtonStyle>
       <Button 
         scheme="primary"
         style={{
           fontSize: theme.button.large.fontSize,
           padding: theme.button.large.padding,
           width: theme.layout.width.medium,   
         }}
         onClick={() => setIsOpen(true)}
       >
         {type === 'plan' ? '+ 새 일정 생성' : '+ 새 스케줄 생성'}
       </Button>
     </CreateButtonStyle>
   );
 }

 return (
   <ModalWrapper>
     <ModalContent>
       <ModalHeader>
         <CloseButton onClick={() => setIsOpen(false)}>&times;</CloseButton>
       </ModalHeader>
       {type === 'plan' ? (
         <Form onSubmit={handlePlanSubmit}>        
            <ImageUploadField>
            <ImageUploadBox>
                    <ImageInput 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    />
                    {imagePreview ? (
                    <PreviewImage src={imagePreview} alt="preview" />
                    ) : (
                    <UploadText>이미지를 드래그하거나 클릭하여 업로드</UploadText>
                    )}
                    </ImageUploadBox>
                </ImageUploadField>
           <FormField>
             <label>제목</label>
             <AddPlanInput onChange={(e) => setTitle(e.target.value)} />
           </FormField>
           <FormField>
             <label>목적지</label>
             <AddPlanInput onChange={(e) => setDescription(e.target.value)} />
           </FormField>
           <FormField>
             <label>기간</label>
             <CustomDatePicker value={startDate} onChange={setStartDate} />
             <CustomDatePicker value={endDate} onChange={setEndDate} />
           </FormField>
           <SubmitButton>
           <Button scheme="primary" type="submit"
                style={{
                    fontSize: theme.button.large.fontSize,
                    padding: theme.button.large.padding,
                    width: theme.layout.width.medium,   
                  }}
                  disabled={!isFormValid()}
                  onClick={() => setIsOpen(true)}
           >생성하기</Button>
           </SubmitButton>
         </Form>
       ) : (
         <>
           <Form onSubmit={handleTodoSubmit}>
             <FormField>
               <label>시간</label>
               <TimePicker value={selectedTime} onChange={setSelectedTime} />
             </FormField>
             <FormField>
               <label>일정 내용</label>
               <AddPlanInput 
                 value={todoContent}
                 onChange={(e) => setTodoContent(e.target.value)} 
               />
             </FormField>
             <Button scheme="primary" type="submit">추가하기</Button>
           </Form>
           <TodoList>
             {todos.map((todo, index) => (
               <TodoItem key={index}>
                 <TodoTime>{todo.time}</TodoTime>
                 <TodoContent>{todo.content}</TodoContent>
               </TodoItem>
             ))}
           </TodoList>
         </>
       )}
     </ModalContent>
   </ModalWrapper>
 );
};

const CustomDatePicker = ({ value = new Date(), onChange }: { value?: Date; onChange?: (date: Date) => void }) => {
 const [selectedDate, setSelectedDate] = useState(value);
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
   
   setSelectedDate(newDate);
   onChange?.(newDate);
 };

 return (
   <DatePickerContainer>
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
   </DatePickerContainer>
 );
};

const TimePicker = ({ value = "09:00 AM", onChange }: { value?: string; onChange?: (time: string) => void }) => {
 const hours = Array.from({ length: 12 }, (_, i) => i + 1);
 const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
 const periods = ["AM", "PM"];

 const [selectedHour, selectedMinute, selectedPeriod] = value.split(/:|\s/);

 const handleTimeChange = (type: 'hour' | 'minute' | 'period', newValue: string) => {
   const hour = type === 'hour' ? newValue : selectedHour;
   const minute = type === 'minute' ? newValue : selectedMinute;
   const period = type === 'period' ? newValue : selectedPeriod;
   
   const newTime = `${hour}:${minute} ${period}`;
   onChange?.(newTime);
 };

 return (
   <TimePickerContainer>
     <Select
       value={selectedHour}
       onChange={(e) => handleTimeChange('hour', e.target.value)}
     >
       {hours.map(hour => (
         <option key={hour} value={hour.toString().padStart(2, '0')}>
           {hour}
         </option>
       ))}
     </Select>
     <Select
       value={selectedMinute}
       onChange={(e) => handleTimeChange('minute', e.target.value)}
     >
       {minutes.map(minute => (
         <option key={minute} value={minute.toString().padStart(2, '0')}>
           {minute.toString().padStart(2, '0')}
         </option>
       ))}
     </Select>
     <Select
       value={selectedPeriod}
       onChange={(e) => handleTimeChange('period', e.target.value)}
     >
       {periods.map(period => (
         <option key={period} value={period}>
           {period}
         </option>
       ))}
     </Select>
   </TimePickerContainer>
 );
};

export default Modal;

// Styled Components
const ModalWrapper = styled.div`
 position: fixed;
 top: 0;
 left: 0;
 width: 100vw;
 height: 100vh;
 background: rgba(0, 0, 0, 0.4);
 display: flex;
 justify-content: center;
 align-items: center;
 z-index: 1000;
`;

const ModalContent = styled.div`
 background: ${theme.color.primary_white};
 padding: 2rem;
 border-radius: ${theme.borderRadius.default};
 width: 40%;
 height: 70%;
 box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
 display: flex;
 flex-direction: column;
 align-items: center;
 position: relative;
 overflow-y: auto; // 스크롤 추가
`;

const ModalHeader = styled.div`
  position: absolute; // 추가
  top: 1rem; // 추가
  right: 1rem; // 추가
  display: flex;
  justify-content: flex-end;
`;

const CloseButton = styled.button`
 font-size: ${theme.heading.medium.fontSize};
 background: none;
 border: none;
 cursor: pointer;
 color: ${theme.color.primary_black};
 
 &:hover {
   color: ${theme.color.primary_green};
 }
`;

const Form = styled.form`
 width: 90%;
 display: flex;
 flex-direction: column;
 align-items: center; // 중앙 정렬 추가
 font-family: ${theme.font.family.default};
 margin-top: 2rem;
`;

const FormField = styled.div`
 width: 100%; // 너비 100%로 설정
 margin-bottom: 1rem;

 label {
   display: block;
   margin-bottom: 0.5rem;
   color: ${theme.color.primary_black};
 }
`;

const CreateButtonStyle = styled.div`
 position: fixed;
 bottom: 50px;
 right: 40px;
`;

const DatePickerContainer = styled.div`
 width: 100%;
 margin-bottom: 1rem;
 font-family: ${theme.font.family.contents};
`;

const TimePickerContainer = styled(DatePickerContainer)`
 display: flex;
 gap: 0.5rem;
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
`;

const TodoList = styled.div`
 margin-top: 1rem;
 max-height: 200px;
 overflow-y: auto;
`;

const TodoItem = styled.div`
 display: flex;
 align-items: center;
 padding: 0.5rem;
 border-bottom: 1px solid ${theme.color.input_background};
`;

const TodoTime = styled.span`
 min-width: 100px;
 color: ${theme.color.primary_green};
 font-weight: ${theme.font.weight.bold};
`;

const TodoContent = styled.span`
 margin-left: 1rem;
 color: ${theme.color.primary_black};
`;

const ImageUploadField = styled(FormField)`
 width: 100%;
`;

const ImageUploadBox = styled.div`
 position: relative;
 width: 100%;
 height: 300px;
 border: 1px dashed ${theme.color.input_background};
 border-radius: ${theme.borderRadius.default};
 display: flex;
 justify-content: center;
 align-items: center;
 cursor: pointer;
 background-color: ${theme.color.input_background};
 
 &:hover {
   border-color: ${theme.color.primary_green};
 }
`;

const ImageInput = styled.input`
 position: absolute;
 width: 100%;
 height: 100%;
 opacity: 0;
 cursor: pointer;
`;

const UploadText = styled.span`
 color: ${theme.color.input_text};
 font-size: ${theme.heading.large.fontSize};
 text-align: center;
`;

const PreviewImage = styled.img`
 max-width: 100%;
 max-height: 100%;
 object-fit: contain;
`;

const SubmitButton = styled.div`
 margin-top: 1rem;
 display: flex;
 justify-content: center;
 width: 100%;
`;
