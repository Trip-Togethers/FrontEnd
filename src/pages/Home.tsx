import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/planReducer";
import { addPlan, deletePlan } from "../store/planReducer";
import Button from "../components/common/Button";
import PlanCardModal from "../components/common/PlanCardModal";

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
        <NewPlanButton size="large" scheme="primary" onClick={() => setIsModalOpen(true)}>
          새 계획 생성
        </NewPlanButton>
      </Navigation>

      <PlanCardModal
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
`;

const Container = styled.div`
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 0.5rem;
  margin: 1.5rem 0;
  height: calc(100vh - 160px);
`;

const PlanCard = styled.div`
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  overflow: hidden;
  height: 300px;
  width: 45%;
  margin: 0 auto;

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
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 300px;
`;

const NavButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const NewPlanButton = styled(Button)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 156px; // 피그마 기준 버튼 너비
  height: 41px; // 피그마 기준 버튼 높이
  background-color: #006D24; // 피그마의 primary-green 색상
  color: #ffffff;
  font-size: 0.875rem;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #005d1f;
  }
`;

export default Home;