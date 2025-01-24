import React, { useState } from 'react';
import ModalInput from './ModalInput';
import Button from './Button';
import '../../styles/font.css'
import DropDown from './DropDown';
import styled, { createGlobalStyle } from "styled-components";
const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'JalnanGothic'; 
  }`

interface AddPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: {
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    imageUrl?: string;
  }) => void;
}

const AddPostModal: React.FC<AddPostModalProps> = ({ isOpen, onClose, onSave }) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const [form, setForm] = useState({
    title: '',
    destination: '',
    startDate: new Date(),  
    endDate: new Date(),    
    imageUrl: '',
  });
  const [error, setError] = useState({
    title: '',
    destination: '',
     date: '',
  });

  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'title' && value.trim() === '') {
      setError((prev) => ({ ...prev, title: '제목을 입력해주세요.' }));
    } else if (name === 'destination' && value.trim() === '') {
      setError((prev) => ({ ...prev, destination: '목적지를 입력해주세요.' }));
    } else {
      setError((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setForm((prev) => ({ ...prev, imageUrl: fileReader.result as string }));
      };
      fileReader.readAsDataURL(e.target.files[0]);
    }
  };

  const validateForm = () => {
    let isValid = true;
    if (form.title.trim() === '') {
      setError((prev) => ({ ...prev, title: '제목을 입력해주세요.' }));
      isValid = false;
    }
    if (form.destination.trim() === '') {
      setError((prev) => ({ ...prev, destination: '목적지를 입력해주세요.' }));
      isValid = false;
    }
    return isValid;
  };

  const validateDates = (start: Date, end: Date) => {
    if (start > end) {
      setError(prev => ({ ...prev, date: '종료일이 시작일보다 빠를 수 없습니다.' }));
      return false;
    }
    setError(prev => ({ ...prev, date: '' }));
    return true;
  };

  const handleSave = () => {
    if (validateForm() && validateDates(form.startDate, form.endDate)) {
      const startDate = form.startDate.toISOString().split('T')[0];
      const endDate = form.endDate.toISOString().split('T')[0];
      onSave({
        title: form.title,
        destination: form.destination,
        startDate,
        endDate,
        imageUrl: form.imageUrl
      });
      onClose();
      setForm({
        title: '',
        destination: '',
        startDate: new Date(),
        endDate: new Date(),
        imageUrl: '',
      });
    }
  };
  

  if (!isOpen) return null;

  return (
    <>
    <GlobalStyle />
      <Overlay onClick={onClose} />
      <Modal>
        <ImageUploadBox onClick={() => document.getElementById('image-upload')?.click()}>
          {form.imageUrl ? (
            <img src={form.imageUrl} alt="대표 이미지" />
          ) : (
            '대표 이미지 선택'
          )}
        </ImageUploadBox>
        <input
          type="file"
          id="image-upload"
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleImageUpload}
        />

        <h2>새 계획 생성</h2>
        <ModalInput
          label="제목"
          name="title"
          value={form.title || ''}
          onChange={handleChange}
          error={error.title}
        />
        <ModalInput
          label="목적지"
          name="destination"
          value={form.destination || ''}
          onChange={handleChange}
          error={error.destination}
        />

        <DatePickerRow>
        <label>시작 날짜</label>
            <DropDown
              value={form.startDate}
              onChange={(date) => {
                setForm(prev => ({ ...prev, startDate: date }));
                validateDates(date, form.endDate);
              }}
            />
        </DatePickerRow>

        <DatePickerRow>
        <label>종료 날짜</label>
            <DropDown
              value={form.endDate}
              onChange={(date) => {
                setForm(prev => ({ ...prev, endDate: date }));
                validateDates(form.startDate, date);
              }}
            />
        </DatePickerRow>
        {error.date && <ErrorText>{error.date}</ErrorText>}

        <Button size='medium' scheme='primary' onClick={handleSave} disabled={!form.title || !form.destination}>
          일정 생성하기
        </Button>
      </Modal>
    </>
  );
};

export default AddPostModal;

const Modal = styled.div`
  
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  z-index: 1000;
  
  // 반응형 크기 조절을 위한 수정
  width: 500px; 
  height: 450px; 
  max-height: 70vh; /* 화면의 70%까지만 높이 설정 */
  
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  overflow: visible; /* 스크롤 제거 */


  h2 {
    margin-bottom: 1rem;
    color: #333;
  }
`;

const Overlay = styled.div`
   
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const ImageUploadBox = styled.div`
  
  display: flex;
  align-items: center;
  justify-content: center;
  width: 400px;         
  height: 400px;       
  position: relative;
  margin: 0 auto 1rem auto;
  border: 2px dashed #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  cursor: pointer;
  text-align: center;
  font-size: clamp(0.875rem, 1vw, 1rem);  // 반응형 폰트 크기
  color: #666;
  position: relative;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
    border-radius: 8px;
    position: absolute;
  }
`;

const DatePickerRow = styled.div`
  
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: clamp(0.8rem, 2rem, 1rem);
  width: 100%;
  
  label {
    flex: 1;
    font-size: clamp(0.875rem, 1vw, 1rem);
    margin-right: clamp(0.5rem, 2vw, 1rem);
    white-space: nowrap;
  }

  // DropDown 컴포넌트를 위한 컨테이너
  & > :last-child {
    flex: 3;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;

    label {
      margin-bottom: 0.3rem;
    }

    & > :last-child {
      width: 100%;
    }
  }
`;

  const ErrorText = styled.p`
    color: #FF0000;
    font-size: 14px;
    margin-top: -0.5rem;
    margin-bottom: 1rem;
    width: 100%;
    text-align: left;
  `;