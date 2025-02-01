import React, { useState } from "react";
import { styled } from "styled-components";
import Modal from "@/components/common/Modal";
import { theme } from "@/styles/theme";
import Button from "@/components/common/Button"
import { connect } from 'react-redux';
import { RootState } from '@/store/store';
import { addPlan, deletePlan } from '@/store/planReducer';

interface HomeProps {
  plans: any[];
  addPlan: (plan: any) => void;
  deletePlan: (id: string) => void;
}

// 2. props 받아서 사용하는 방식으로 변경
function Home({ plans, addPlan, deletePlan }: HomeProps) {
  // useSelector와 dispatch 제거
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const sortedPlans = [...plans].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

   const indexOfLastPlan = currentPage * itemsPerPage;
   const indexOfFirstPlan = indexOfLastPlan - itemsPerPage;
   const currentPlans = sortedPlans.slice(indexOfFirstPlan, indexOfLastPlan);
   const totalPages = Math.ceil(plans.length / itemsPerPage);
 
  const handleAddPlan = (plan) => {
    addPlan({
      ...plan,
      id: Date.now().toString(),
    });
  };

  const handleDelete = (index: number) => {
    const planToDelete = plans[index];
    deletePlan(planToDelete.id);
    setDeleteTarget(null);
  };

 
  const handlePageChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  console.log("Redux plans:", plans);
  return (
    <HomeStyle>
      {!plans.length && (
        <NoPlanMessage>
          아직 일정이 없습니다 :(
          <br />
          버튼으로 새 일정을 생성해보세요!
        </NoPlanMessage>
      )}

      <PlansContainer>
        {currentPlans.map((plan, index) => (
          <PlanCard key={index}>
            <DeleteButton onClick={() => setDeleteTarget(index)}>
              ➖
            </DeleteButton>
            <ImagePlaceholder>
                {plan.image && <PlanImage src={plan.image} alt="Uploaded Preview" />}
                <DateOverlay>
                  <Year>{new Date(plan.startDate).getFullYear()}</Year>
                  <DateRange>
                    {`${new Date(plan.startDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })} - 
                      ${new Date(plan.endDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}`}
                  </DateRange>
                </DateOverlay>
          </ImagePlaceholder>
            <PlanDetails>
              <PlanTitle>{plan.title}</PlanTitle>
            </PlanDetails>
          </PlanCard>
        ))}
      </PlansContainer>

      {deleteTarget !== null && (
        <DeleteModal>
          <DeleteModalContent>
            <h3>일정을 삭제하시겠습니까?</h3>
            <DeleteModalButtons>
              <Button 
                scheme="alert" 
                onClick={() => handleDelete(deleteTarget)}
              >
                삭제
              </Button>
              <Button 
                scheme="primary" 
                onClick={() => setDeleteTarget(null)}
              >
                취소
              </Button>
            </DeleteModalButtons>
          </DeleteModalContent>
        </DeleteModal>
      )}
      {plans.length > itemsPerPage && (
  <Pagination>
    <PageButton
      onClick={() => handlePageChange('prev')}
      disabled={currentPage === 1}
      isActive={false}
    >
      &lt;
    </PageButton>
    <PageNumber>{currentPage}</PageNumber>
    <PageButton
      onClick={() => handlePageChange('next')}
      disabled={currentPage === totalPages}
      isActive={false}
    >
      &gt;
    </PageButton>
  </Pagination>
)}
  <Modal type='plan' onSubmit={handleAddPlan} />
    </HomeStyle>
  );
}

export default connect(
  (state: RootState) => ({
    plans: state.plan.plans
  }),
  {addPlan, deletePlan}
)(Home);

const HomeStyle = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  flex-direction: column;
  gap: 4rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
   margin-top: auto;
  bottom: 120px;
  position: relative;
`;

const PageButton = styled.button<{ isActive: boolean; disabled: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: ${theme.borderRadius.default};
  background-color: ${props => 
    props.disabled 
      ? theme.color.input_background 
      : theme.color.primary_green
  };
  color: ${props => 
    props.disabled 
      ? theme.color.input_text 
      : theme.color.primary_white
  };
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-family: ${theme.font.family.contents};
  font-size: 1.2rem;
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  &:hover:not(:disabled) {
    opacity: 0.8;
  }
`;


const PageNumber = styled.span`
  font-family: ${theme.font.family.contents};
  font-size: 1.2rem;
  color: ${theme.color.primary_black};
  min-width: 2rem;
  text-align: center;
`;

  const PlansContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 300px)); // 최대 크기 제한
  grid-auto-rows: auto;
  gap: clamp(8rem, 2vw, 2rem);
  width: 90%; // 컨테이너 전체 너비
  max-width: 1200px; // 최대 너비 제한
  padding: 2rem;
  overflow: hidden;
  border: none;
  outline: none;
  place-content: center;
  margin-bottom: 80px;
  font-family: ${theme.font.family.default};
 
 // 6개씩 그룹화하여 페이지처럼 보이도록
 & > * {
   scroll-snap-align: start;
 }
 
 scroll-snap-type: x mandatory;
 scroll-padding: 1rem;

 &::-webkit-scrollbar {
   height: 8px;
 }

 &::-webkit-scrollbar-track {
   background: transparent; // 스크롤바 트랙 배경 투명하게
   border-radius: 4px;
 }

 &::-webkit-scrollbar-thumb {
   background: ${theme.color.primary_green};
   border-radius: 4px;
 }
`;


const NoPlanMessage = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: ${theme.color.input_text};
  font-size: ${theme.heading.large.fontSize};
  font-family: ${theme.font.family.contents};
  z-index: -1;
`;


const PlanCard = styled.div`
  position: relative;
   width: 80%; 
  aspect-ratio: 3/4; 
  background: ${theme.color.card_background};
  border-radius: ${theme.borderRadius.default};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(0.5rem, 2vw, 1.5rem); 
  border: none;
   box-shadow: 0 2px 8px #000000;
   transition: transform 0.2s ease;
   font-family: 
  
   &:hover {
    transform: scale(1.02);
  }
`;

const ImagePlaceholder = styled.div`
  position: relative;
  width: 100%;
  height: 70%; 
  background: ${theme.color.input_background};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: ${theme.borderRadius.default};
  overflow: hidden;
  z-index: 1;
`;

const PlanImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${theme.borderRadius.default};
  position: absolute;
  top: 0;
  left: 0;
`;


const DateOverlay = styled.div`
  text-align: left;
  position: absolute;
  width:90%;
  bottom: 1px;
  left: 50%;
   transform: translateX(-50%);
  
  color: ${theme.color.input_text};
  font-family: ${theme.font.family.contents};
  background: transparent;
`;

const Year = styled.div`
  font-size: 1.5rem;
  font-weight: ${theme.font.weight.light};
  margin-bottom: 0.5rem;
  text-align: left;
`;

const DateRange = styled.div`
  font-size: 1.2rem;
  white-space: nowrap;
`;


const PlanDetails = styled.div`
   width: 100%;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem 0;
`;

const PlanTitle = styled.h3`
   margin: 0;
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  font-weight: ${theme.font.weight.bold};
  line-height: 1.4;
`;


const DeleteButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: transparent;
  color: ${theme.color.primary_white};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  z-index: 10;
  
  img {
    width: 100%;
    height: 100%;
  }

  &:hover {
    opacity: 0.8;
  }
`;

const DeleteModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DeleteModalContent = styled.div`
  background: ${theme.color.primary_white};
  padding: 2rem;
  border-radius: ${theme.borderRadius.default};
  text-align: center;

  h3 {
    margin-bottom: 1.5rem;
    color: ${theme.color.primary_black};
    font-family: ${theme.font.family.contents};
  }
`;

const DeleteModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;

  button {
    min-width: 100px;
  }
`;
