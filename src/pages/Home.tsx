import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/planReducer";
import { addPlan, deletePlan } from "../store/planReducer";
import Button from "../components/common/Button";
import AddPostModal from "../components/common/AddPostModal";
import "../styles/font.css"

interface Participant {
  id: string;
  name: string;
  profileImg: string;
}

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showParticipants, setShowParticipants] = useState<{[key: string]: boolean}>({});

  // 임시 참가자 데이터
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: "1",
      name: "User 1",
      profileImg: "https://via.placeholder.com/32"
    },
    {
      id: "2",
      name: "User 2",
      profileImg: "https://via.placeholder.com/32"
    },
    {
      id: "3",
      name: "User 3",
      profileImg: "https://via.placeholder.com/32"
    }
  ]);

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

  const handleToggleParticipants = (planId: string) => {
    setShowParticipants(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  const handleCopyLink = (planId: string) => {
    navigator.clipboard.writeText(`https://www.triptogether.com/invite/${planId}`);
    // TODO: 복사 완료 알림 추가
  };

  const handleRemoveParticipant = (participantId: string) => {
    setParticipants(prev => prev.filter(p => p.id !== participantId));
  };

  // plans를 시작일 기준으로 정렬한 후 페이지네이션 적용
  const displayedPlans = [...plans]
    .sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateA.getTime() - dateB.getTime();
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
              <DeleteButton onClick={() => handleDeleteClick(plan.id, plan.title)}>
                -
              </DeleteButton>
              {plan.imageUrl ? (
                <img src={plan.imageUrl} alt="대표 이미지" />
              ) : (
                <div className="placeholder">이미지 없음</div>
              )}
              <CardContent>
                <h3>{plan.title}</h3>
                <p>{plan.destination}</p>
                <p>{plan.startDate} ~ {plan.endDate}</p>
              </CardContent>
              <ParticipantsList>
                <ParticipantsImages>
                  {participants.slice(0, 3).map((participant) => (
                    <img key={participant.id} src={participant.profileImg} alt={participant.name} />
                  ))}
                </ParticipantsImages>
                {participants.length > 3 && (
                  <ExtraParticipants onClick={() => handleToggleParticipants(plan.id)}>
                    +{participants.length - 3}
                  </ExtraParticipants>
                )}
                {showParticipants[plan.id] && (
                  <ParticipantsDropdown>
                    {participants.map((participant) => (
                      <ParticipantItem key={participant.id}>
                        <img src={participant.profileImg} alt={participant.name} />
                        <span className="name">{participant.name}</span>
                        <button onClick={() => handleRemoveParticipant(participant.id)}>-</button>
                      </ParticipantItem>
                    ))}
                    <InviteLink>
                      <div>초대 링크</div>
                      <div className="link-box">
                        <input 
                          type="text" 
                          value={`https://www.triptogether.com/invite/${plan.id}`}
                          readOnly 
                        />
                        <button onClick={() => handleCopyLink(plan.id)}>
                          복사
                        </button>
                      </div>
                    </InviteLink>
                  </ParticipantsDropdown>
                )}
              </ParticipantsList>
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
  );
}

const HomeStyle = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 40px;
  min-height: calc(100vh - 40px);
  overflow: hidden; 
`;

const Container = styled.div`
   display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0;    
  margin: 0;       
  position: relative;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(200px, 1fr));
  grid-auto-rows: min-content;
  gap: 2rem;
  padding: 2rem;
  width: fit-content;
  margin: 0 auto;
  height: calc(100vh - 120px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #006D24;
    border-radius: 3px;
  }
`;

const PlanCard = styled.div`
  position: relative;
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
  right: 10px;  // left를 right로 변경
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
  font-family: 'BMJUA';
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
  font-family: "BMJUA";

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
  font-family: 'BMJUA';
  padding: 0.5rem;
  text-align: center;
`;

const ParticipantsList = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: flex;
  align-items: center;
`;

const ParticipantsImages = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid white;
    margin-right: -8px;
    object-fit: cover;
  }
`;

const ExtraParticipants = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #E0E0E0;
  color: #616161;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  margin-left: 4px;
`;

const ParticipantsDropdown = styled.div`
  position: absolute;
  bottom: 40px;
  left: 0;
  width: 280px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 16px;
`;

const ParticipantItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  margin-bottom: 8px;

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 12px;
  }

  .name {
    flex: 1;
  }

  button {
    padding: 4px 8px;
    background: none;
    border: none;
    color: #E70000;
    cursor: pointer;
  }
`;

const InviteLink = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #E0E0E0;

  .link-box {
    display: flex;
    align-items: center;
    background: #F5F5F5;
    padding: 8px;
    border-radius: 4px;
    margin-top: 8px;

    input {
      flex: 1;
      border: none;
      background: none;
      font-size: 14px;
    }

    button {
      padding: 4px 8px;
      background: none;
      border: none;
      color: #006D24;
      cursor: pointer;
    }
  }
`;

export default Home;