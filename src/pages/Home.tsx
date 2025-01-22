import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/planReducer";
import { addPlan, deletePlan } from "../store/planReducer";
import Button from "../components/common/Button";
import AddPostModal from "../components/common/AddPostModal";
import "../styles/font.css"

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const plans = useSelector((state: RootState) => state.plans.plans) || [];
  const dispatch = useDispatch();

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil((plans?.length || 0) / ITEMS_PER_PAGE);

  useEffect(() => {
    console.log('Current plans:', plans);
  }, [plans]);

  const handleSavePlan = (plan: {
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    imageUrl?: string;
  }) => {
    const newPlan = { id: new Date().getTime().toString(), ...plan };
    console.log('Dispatching new plan:', newPlan);
    dispatch(addPlan(newPlan));
  };

  const handleDeletePlan = (id: string) => {
    dispatch(deletePlan(id));
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  // plans를 시작일 기준으로 정렬한 후 페이지네이션 적용
  const displayedPlans = [...plans]
    .sort((a, b) => {
      // startDate를 날짜 객체로 변환하여 비교
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateA.getTime() - dateB.getTime(); // 오름차순 정렬
    })
    .slice(
      currentPage * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );

  return (
    <HomeStyle>
      <Container>
        <Grid>
          {displayedPlans.map((plan) => (
            <PlanCard key={plan.id}>
              {plan.imageUrl ? (
                <img src={plan.imageUrl} alt="대표 이미지" />
              ) : (
                <div className="placeholder">이미지 없음</div>
              )}
              <h3>{plan.title}</h3>
              <p>{plan.destination}</p>
              <p>
                {plan.startDate} ~ {plan.endDate}
              </p>
              <Button size="medium" scheme="alert" onClick={() => handleDeletePlan(plan.id)}>
                삭제
              </Button>
            </PlanCard>
          ))}
        </Grid>
      </Container>

      <Navigation>
        <div>
          <NavButton onClick={handlePrevPage} disabled={currentPage === 0}>
            &lt;
          </NavButton>
          <span>
            {currentPage + 1} / {totalPages}
          </span>
          <NavButton
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
          >
            &gt;
          </NavButton>
        </div>
      </Navigation>

      
      <NewPlanButton size="medium" scheme="primary" onClick={() => setIsModalOpen(true)}>
          새 계획 생성
        </NewPlanButton>
     

      <AddPostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePlan}
      />
    </HomeStyle>
  );
}

const HomeStyle = styled.div`
 
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  min-height: 100vh;
  overflow: auto;    
  position: relative;  
`;

const Container = styled.div`
  
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  height: 100vh;       
  position: relative;
  flex: 1;  
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(200px, 1fr));  // 변경
  grid-auto-rows: min-content;  // 추가
  row-gap: 2rem;  // 상하 간격만 따로 조절
  column-gap: 3rem;  // 좌우 간격은 따로 조절
  margin: 2rem auto;  // 상하 여백 줄임
  width: fit-content;  // 추가
  overflow-y: auto;
`;

const PlanCard = styled.div`
  
  font-family: "BMJUA";
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(12, 1, 1, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0.5rem;
  overflow: hidden;
  height: 200px;
  width: 200px;
  margin: 0;

  img {
    width: 100%;
    height: 140px;
    object-fit: cover;
    border-radius: 8px;
  }

  .placeholder {
    width: 100%;
    height: 140px;
    background-color: #f0f0f0;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #666;
  }

  h3 {
    font-size: 0.85rem;
    color: #333;
    margin: 0.25rem 0;
  }

  p {
    font-size: 0.75rem;
    margin: 0.15rem 0;
  }
`;

const Navigation = styled.div`
  font-family: "BMJUA";
  display: flex;
  justify-content: center;  
  align-items: center;
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem 1rem;
  width: 300px;
  z-index: 10;

  // 배경색과 그림자 제거
  background-color: transparent;
  box-shadow: none;
  
  span {
    margin: 0 1rem;  // < > 버튼과 숫자 사이 간격
    color: #006D24;  
  }
`;

const NavButton = styled.button`
  font-family: "BMJUA";
  position: sticky;
  bottom: 0.5rem;
  color: #616161;
  border: none;
  background: transparent;  
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1.2rem;  

  &:disabled {
    color: #ccc;  
    cursor: not-allowed;
    background: transparent;  
  }
`;

const NewPlanButton = styled(Button)`
  font-family: "BMJUA";
  position: fixed;
  bottom: 1rem;          // 수정
  right: 2rem;           // 수정
  margin-left: auto;  // 추가: 우측 정렬을 위해
  width: 125px;
  height: 40px;
  background-color: #006D24;
  color: #ffffff;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  align-self: flex-end;  // 추가: 우측 정렬을 위해
  z-index: 10;

  &:hover {
    background-color: #0056b3;
  }
`;

export default Home;