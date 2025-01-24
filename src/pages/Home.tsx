import React, { useState, useEffect } from "react";
import { styled, createGlobalStyle } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/planReducer";
import { addPlan, deletePlan } from "../store/planReducer";
import Button from "../components/common/Button";
import AddPostModal from "../components/common/AddPostModal";
import "../styles/font.css";

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'SBAggroB'; 
  }

    html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden; /* 외부 스크롤 방지 */
    display: flex;
    flex-direction: column;
  }

  #root {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;

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

  const [deleteAlert, setDeleteAlert] = useState<{ show: boolean; planId: string; title: string }>({
    show: false,
    planId: '',
    title: ''
  });

  const handleDeleteClick = (id: string, title: string) => {
    setDeleteAlert({
      show: true,
      planId: id,
      title
    });
  };

  const confirmDelete = () => {
    handleDeletePlan(deleteAlert.planId);
    setDeleteAlert({ show: false, planId: '', title: '' });
  };

  return (
    <>
      <GlobalStyle />
      <HomeStyle>
        {plans.length === 0 && (
          <EmptyMessage>
            아직 일정이 없습니다 :( <br />
            <span>버튼으로 새 일정을 생성해보세요!</span>
          </EmptyMessage>
        )}
        <Container>
            <Grid>
              {displayedPlans.map((plan) => (
                <PlanCard key={plan.id}>
                  <DeleteButton onClick={() => handleDeleteClick(plan.id, plan.title)}>
                    -
                  </DeleteButton>
                  {plan.imageUrl ? (
                    <ImageContainer>
                      <img src={plan.imageUrl} alt="대표 이미지" />
                      <DateInfo>
                        {plan.startDate} ~ {plan.endDate}
                      </DateInfo>
                    </ImageContainer>
                  ) : (
                    <ImageContainer>
                      <div className="placeholder">이미지 없음</div>
                      <DateInfo>
                        {plan.startDate} ~ {plan.endDate}
                      </DateInfo>
                    </ImageContainer>
                  )}
                  <CardContent>
                    <h2>{plan.title}</h2>
                  </CardContent>
                </PlanCard>
              ))}
            </Grid>
            </Container>

        {deleteAlert.show && (
          <AlertOverlay>
            <AlertBox>
              <h4>{deleteAlert.title}</h4>
              <p>삭제 하시겠습니까?</p>
              <ButtonGroup>
                <AlertButton onClick={confirmDelete}>삭제</AlertButton>
                <AlertButton onClick={() => setDeleteAlert({ show: false, planId: '', title: '' })}>
                  취소
                </AlertButton>
              </ButtonGroup>
            </AlertBox>
          </AlertOverlay>
        )}

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
    </>
  );
}

export default Home;

const HomeStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center; /* 컨테이너를 세로 중앙 정렬 */
  align-items: center; /* 컨테이너를 가로 중앙 정렬 */
  height: 100vh;
  width: 100%;
  overflow: hidden; /* 화면 넘침 방지 */
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center; /* 세로 중앙 정렬 */
  align-items: center; /* 가로 중앙 정렬 */
  padding: 0;    
  margin: 0;       
  position: relative;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: min-content;
  gap: 1rem;
  padding: 1rem 0;
  flex-grow: 1;
  width: 60%;
  max-width: 1200px;
  margin: 0 auto;
  justify-items: center; /* 그리드 콘텐츠 중앙 정렬 */
  align-items: start; /* 세로 정렬 */
  overflow: hidden;
`;

const PlanCard = styled.div`
  position: relative;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(12, 1, 1, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  overflow: hidden;
  height: 200px;
   width: 150px; 
  margin-top: 40px;

  img {
    width: 100%;
    height: auto;
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
  justify-content: center;  
  align-items: center;
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem 1rem;
  width: 300px;
  z-index: 10;

  background-color: transparent;
  box-shadow: none;

  span {
    margin: 0 1rem;
    color: #006D24;  
  }
`;

const NavButton = styled.button`
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
  position: fixed;
  bottom: 5vh; 
  right: 5vw;  
  margin-left: auto;  
  width: 10vw;
  height: 5vh;
  background-color: #006D24;
  color: #ffffff;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;

  z-index: 10;

  &:hover {
    background-color: #0056b3;
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: #f0f0f0;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #E70000;
  z-index: 2;

  &:hover {
    background-color: #E70000;
    color: white;
  }
`;

const AlertOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const AlertBox = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 300px;

  h4 {
    margin-bottom: 10px;
    color: #333;
  }

  p {
    margin-bottom: 20px;
    color: #666;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const AlertButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:first-child {
    background-color: #E70000;
    color: white;
  }

  &:last-child {
    background-color: #f1f1f1;
    color: #333;
  }
`;

const CardContent = styled.div`
  padding: 0.5rem;
  text-align: center;
`;

const EmptyMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #616161;
  font-size: 4rem;
`;


const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 140px;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }

  .placeholder {
    width: 100%;
    height: 100%;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #666;
    border-radius: 8px;
  }
`;

const DateInfo = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
`;
