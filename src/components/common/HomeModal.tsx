import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import Button from '@/components/common/Button';
import InputText from '@/components/common/InputText';
import DatePicker from './DatePicker';

interface HomeModalProps {
  type: 'plan' | 'schedule';
  onSubmit?: (plan: any) => void;
}

const HomeModal: React.FC<HomeModalProps> = ({ type, onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    imagePreview: '',
  });

  const handleUpdate = (key: string, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => handleUpdate('imagePreview', reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'plan') {
      onSubmit?.({
        ...data,
        image: data.imagePreview
      });
      setData({
        imagePreview: '',
        title: '',
        description: '',
        startDate: new Date(),
        endDate: new Date(),
      });
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <CreatePlanButton 
        scheme="primary"
        onClick={() => setIsOpen(true)}
      >
        {type === 'plan' ? '+ 새 일정 생성' : '+ 새 스케줄 생성'}
      </CreatePlanButton>
    );
  }
  return (
    <ModalWrapper>
      <ModalContent>
        <CloseButton onClick={() => setIsOpen(false)}>❌</CloseButton>
        <Form onSubmit={handleSubmit}>
          {type === "plan" && (
            <>
              <ImageUploadBox>
                <ImageInput type="file" accept="image/*" onChange={handleImageUpload} />
                {data.imagePreview ? (
                  <PreviewImage src={data.imagePreview} alt="preview" />
                ) : (
                  <UploadText>이미지를 드래그하거나 클릭하여 업로드</UploadText>
                )}
              </ImageUploadBox>
              <FormField>
                <label>제목</label>
                <InputText
                    scheme="mypage"
                    placeholder="일정 제목을 입력하세요."
                    value={data.title}
                    onChange={(e) => handleUpdate("title", e.target.value)}
                  />
              </FormField>
              <FormField>
                <label>목적지</label>
                <InputText
                    scheme="mypage"
                    placeholder="목적지를 입력하세요."
                    value={data.description}
                    onChange={(e) => handleUpdate("description", e.target.value)}
                  />
              </FormField>
              <FormField>
                <label>기간</label>
                <DatePicker value={data.startDate} onChange={(date) => handleUpdate("startDate", date)} />
                <DatePicker
                  value={data.endDate}
                  onChange={(date) => handleUpdate("endDate", date)}
                  minDate={data.startDate}
                />
              </FormField>
              <Button
                scheme="primary"
                type="submit"
                disabled={!data.title.trim() || !data.description.trim() || data.endDate < data.startDate}
              >
                생성하기
              </Button>
            </>
          )}
        </Form>
      </ModalContent>
    </ModalWrapper>
  ); 
};


export default HomeModal;

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
 background: ${({ theme }) => theme.color.primary_white};
 padding: 2rem;
 border-radius: ${({ theme }) => theme.borderRadius.default};
 width: 40%;
 height: 70%;
 box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
 display: flex;
 flex-direction: column;
 align-items: center;
 position: relative;
 overflow-y: auto; // 스크롤 추가
 overflow-y: auto; // 스크롤 추가

  &::-webkit-scrollbar {
    width: 8px; /* 스크롤바 너비 */
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.color.input_background};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.color.primary_green}; 
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.color.primary_black}; 
  }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    font-size: 1.5rem;
    background: none;
    right: 30px;  /* 더 오른쪽으로 이동 */
    border: none;
    cursor: pointer;
    color: ${({ theme }) => theme.color.primary_black}; 
    
    &:hover {
      color: ${({ theme }) => theme.color.primary_green};
    }
    `;

const Form = styled.form`
 width: 90%;
 display: flex;
 flex-direction: column;
 align-items: center; // 중앙 정렬 추가
 font-family: ${({ theme }) => theme.font.family.default};
 margin-top: 2rem;

  button {
    font-size: 1.5rem;
  }
`;

const FormField = styled.div`
 width: 100%; // 너비 100%로 설정
 margin-bottom: 1rem;

 label {
    display: block;
    margin-bottom: 0.125rem;
    color: ${({ theme }) => theme.color.primary_black};
    font-size: 1.5rem; 
    font-weight: bold; 
 }
    input {
     width: 100%;
     height: 3rem;
     padding: 0.125rem;
     border: none;
     border-radius: ${({ theme }) => theme.borderRadius.default};
     font-size: 1.5rem;
     margin-bottom: 0.5rem;
    }
`;

const CreatePlanButton = styled(Button)`
 position: fixed;
 bottom: 50px;
 right: 60px;
 font-family: ${({ theme }) => theme.font.family.title};
 font-size: 2rem;
`;

const ImageUploadBox = styled.div`
 position: relative;
 width: 100%;
 height: 300px;
 border: 1px dashed ${({ theme }) => theme.color.input_background};
 border-radius: ${({ theme }) => theme.borderRadius.default};
 display: flex;
 justify-content: center;
 align-items: center;
 cursor: pointer;
 background-color: ${({ theme }) => theme.color.input_background};
 margin-bottom: 1rem;
 
 &:hover {
   border-color: ${({ theme }) => theme.color.primary_green};
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
 color: ${({ theme }) => theme.color.input_text};
 font-size: 1.5rem;
 text-align: center;
`;

const PreviewImage = styled.img`
 max-width: 100%;
 max-height: 100%;
 object-fit: contain;
`;
