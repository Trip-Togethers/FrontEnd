import React, { useState } from 'react';
import styled from 'styled-components';
import Input from './Input';
import Button from './Button';
import '../../styles/font.css'

interface PlanCardModalProps {
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

const PlanCardModal: React.FC<PlanCardModalProps> = ({ isOpen, onClose, onSave }) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const [form, setForm] = useState({
    title: '',
    destination: '',
    startYear: currentYear,
    startMonth: today.getMonth() + 1,
    startDay: today.getDate(),
    endYear: currentYear,
    endMonth: today.getMonth() + 1,
    endDay: today.getDate(),
    imageUrl: '',
  });
  const [error, setError] = useState({
    title: '',
    destination: '',
  });

  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const dayOptions = (year: number, month: number) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

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

  const handleSave = () => {
    if (validateForm()) {
      const startDate = `${form.startYear}-${String(form.startMonth).padStart(2, '0')}-${String(
        form.startDay
      ).padStart(2, '0')}`;
      const endDate = `${form.endYear}-${String(form.endMonth).padStart(2, '0')}-${String(
        form.endDay
      ).padStart(2, '0')}`;
      onSave({ ...form, startDate, endDate });
      onClose();
      setForm({
        title: '',
        destination: '',
        startYear: currentYear,
        startMonth: today.getMonth() + 1,
        startDay: today.getDate(),
        endYear: currentYear,
        endMonth: today.getMonth() + 1,
        endDay: today.getDate(),
        imageUrl: '',
      });
    }
  };
  

  if (!isOpen) return null;

  return (
    <>
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
        <Input
          label="제목"
          name="title"
          value={form.title}
          onChange={handleChange}
          error={error.title}
        />
        <Input
          label="목적지"
          name="destination"
          value={form.destination}
          onChange={handleChange}
          error={error.destination}
        />

        <DatePickerRow>
          <label>시작 날짜</label>
          <div>
            <Dropdown name="startYear" value={form.startYear} onChange={handleChange}>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Dropdown>
            <Dropdown name="startMonth" value={form.startMonth} onChange={handleChange}>
              {monthOptions.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </Dropdown>
            <Dropdown name="startDay" value={form.startDay} onChange={handleChange}>
              {dayOptions(form.startYear, form.startMonth).map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </Dropdown>
          </div>
        </DatePickerRow>

        <DatePickerRow>
          <label>종료 날짜</label>
          <div>
            <Dropdown name="endYear" value={form.endYear} onChange={handleChange}>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Dropdown>
            <Dropdown name="endMonth" value={form.endMonth} onChange={handleChange}>
              {monthOptions.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </Dropdown>
            <Dropdown name="endDay" value={form.endDay} onChange={handleChange}>
              {dayOptions(form.endYear, form.endMonth).map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </Dropdown>
          </div>
        </DatePickerRow>

        <Button size='medium' scheme='primary' onClick={handleSave} disabled={!form.title || !form.destination}>
          일정 생성하기
        </Button>
      </Modal>
    </>
  );
};

export default PlanCardModal;

const Modal = styled.div`
  font-family: 'BMJUA';
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  z-index: 1000;
  
  // 반응형 크기 조절을 위한 수정
  width: min(90%, 500px);       // 90%와 500px 중 작은 값 사용
  height: min(70vh, 800px);     // 뷰포트 높이의 70%와 800px 중 작은 값 사용
  min-height: 400px;            // 최소 높이 설정
  
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  overflow-y: auto;

  h2 {
    margin-bottom: 1rem;
    color: #333;
  }
`;

const Overlay = styled.div`
  font-family: 'BMJUA';  
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const ImageUploadBox = styled.div`
  font-family: 'JalnanGothic';
  display: flex;
  align-items: center;
  justify-content: center;
  
  // 반응형 크기 조절
  width: min(90%, 300px);         // 부모 요소의 90%와 300px 중 작은 값
  height: min(30vh, 200px);       // 뷰포트 높이의 30%와 200px 중 작은 값
  min-width: 200px;               // 최소 너비
  min-height: 150px;              // 최소 높이
  
  margin: 0 auto 1rem auto;
  border: 2px dashed #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  cursor: pointer;
  text-align: center;
  font-size: clamp(0.875rem, 1vw, 1rem);  // 반응형 폰트 크기
  color: #666;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const Dropdown = styled.select`
  font-family: 'JalnanGothic';
  padding: clamp(0.3rem, 1vw, 0.5rem);  // 반응형 패딩
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: clamp(0.875rem, 1vw, 1rem);  // 반응형 폰트 크기
  margin-right: clamp(0.3rem, 1vw, 0.5rem);  // 반응형 마진
  min-width: 80px;  // 최소 너비 설정
  width: min(30%, 120px);  // 반응형 너비
  
  // 모바일에서도 터치하기 쉽도록
  @media (max-width: 768px) {
    min-height: 35px;
  }
`;

const DatePickerRow = styled.div`
  font-family: 'SBAggroB';
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: clamp(0.8rem, 2vh, 1rem);  // 반응형 마진
  width: 100%;  // 부모 컨테이너의 전체 너비 사용
  
  label {
    flex: 1;
    font-size: clamp(0.875rem, 1vw, 1rem);  // 반응형 폰트 크기
    margin-right: clamp(0.5rem, 2vw, 1rem);  // 반응형 마진
    white-space: nowrap;  // 라벨 텍스트 줄바꿈 방지
  }

  div {
    flex: 3;
    display: flex;
    justify-content: space-between;
    gap: clamp(0.3rem, 1vw, 0.5rem);  // 드롭다운 사이 간격

    // 모바일 화면에서 레이아웃 조정
    @media (max-width: 768px) {
      flex: 2;  // 모바일에서는 라벨과 드롭다운 영역 비율 조정
    }
  }

  // 모바일 화면에서 세로 레이아웃으로 변경 (선택적)
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;

    label {
      margin-bottom: 0.3rem;
    }

    div {
      width: 100%;
    }
  }
`;