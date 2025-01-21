import React, { useState } from 'react';
import styled from 'styled-components';
import Input from './Input';
import Button from './Button';

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
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  z-index: 1000;
  width: 90%;
  max-width: 600px;

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
  width: 100%;
  height: 150px;
  margin-bottom: 1rem;
  border: 2px dashed #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  cursor: pointer;
  text-align: center;
  font-size: 1rem;
  color: #666;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const Dropdown = styled.select`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  margin-right: 0.5rem;
`;

const DatePickerRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  label {
    flex: 1;
    font-size: 1rem;
    margin-right: 1rem;
  }

  div {
    flex: 3;
    display: flex;
    justify-content: space-between;
  }
`;