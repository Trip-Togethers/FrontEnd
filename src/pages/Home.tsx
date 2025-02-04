import React, { useState } from "react";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { theme } from "@/styles/theme";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { Plan, RootState } from "@/store/store";
import { addPlan, deletePlan } from "@/store/planReducer";
import { addParticipant, removeParticipant } from "@/store/participantReducer";


  //  인터페이스 정의

interface HomeProps {
  plans: Plan[];
  addPlan: (plan: Plan) => void;
  deletePlan: (id: string) => void;
}

  // Home 컴포넌트
function Home({ plans, addPlan, deletePlan }: HomeProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 모달, 페이지네이션, 삭제 대상, 참가자 모달, 참가자 삭제 대상 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const participantsById = useSelector((state: RootState) => state.participants);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [showParticipantsModalFor, setShowParticipantsModalFor] = useState<string | null>(null);
  const [removeParticipantInfo, setRemoveParticipantInfo] = useState<{ planId: string; index: number } | null>(null);

  const itemsPerPage = 6;

  // 페이지네이션을 적용한 현재 보여질 일정 목록
  const currentPlans = [...plans]
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  
  //   일정 카드 클릭 핸들러
  // - 일정 카드 내의 삭제 버튼이 아닌 영역 클릭 시 활동 페이지로 이동
 
  const handlePlanClick = (e: React.MouseEvent, id: string) => {
    if (!(e.target as HTMLElement).closest(".delete-btn")) {
      navigate(`/trips/${id}/activities`);
    }
  };

    //  참가자 모달 오픈 핸들러
    //  - 해당 일정의 참가자 모달을 열고, 참가자가 없으면 기본 참가자들을 추가
  const handleShowParticipants = (e: React.MouseEvent, planId: string) => {
    e.stopPropagation();
    setShowParticipantsModalFor(planId);
    const alreadyHas = participantsById[planId]?.length > 0;
    if (!alreadyHas) {
      dispatch(addParticipant({ planId, nickname: "참가자 1" }));
      dispatch(addParticipant({ planId, nickname: "참가자 2" }));
      dispatch(addParticipant({ planId, nickname: "참가자 3" }));
      dispatch(addParticipant({ planId, nickname: "참가자 4" }));
    }
  };

    // 참가자 삭제 핸들러
  const handleRemoveParticipant = () => {
    if (!removeParticipantInfo) return;
    const { planId, index } = removeParticipantInfo;
    dispatch(removeParticipant({ planId, index }));
    setRemoveParticipantInfo(null);
  };

     
    //  - 일정 카드 목록, 삭제 모달, 페이지네이션, 새 일정 생성 버튼, 참가자 모달,
    //    참가자 삭제 확인 모달 등을 렌더링
  return (
    <HomeStyle>
      {/* 일정이 없을 때 안내 메시지 */}
      {!plans.length && (
        <NoPlanMessage>
          아직 일정이 없습니다 :(
          <br />
          버튼으로 새 일정을 생성해보세요!
        </NoPlanMessage>
      )}

      {/* 일정 카드 목록 */}
      <PlansContainer>
        {currentPlans.map((plan, idx) => {
          const participantList = participantsById[plan.id] || [];
          return (
            <PlanCard key={plan.id} onClick={(e) => handlePlanClick(e, plan.id)}>
              {/* 삭제 버튼 */}
              <DeleteButton className="delete-btn" onClick={() => setDeleteTarget(idx)}>
                ➖
              </DeleteButton>
              {/* 참가자 추가 버튼 */}
              <ParticipantsButton onClick={(e) => handleShowParticipants(e, plan.id)}>+</ParticipantsButton>
              {/* 참가자 아바타 목록 */}
              <ParticipantsRow>
                {participantList.slice(0, 2).map((participant: string, i: number) => (
                  <SmallAvatar key={i}>👤</SmallAvatar>
                ))}
                {participantList.length > 2 && <MoreCount>+{participantList.length - 2}</MoreCount>}
              </ParticipantsRow>

              {/* 일정 이미지 및 날짜 오버레이 */}
              <ImagePlaceholder>
                {plan.image && <PlanImage src={plan.image} alt="Preview" />}
                <DateOverlay>
                  <div style={{ fontSize: "1.5rem", fontWeight: theme.font.weight.light }}>
                    {new Date(plan.startDate).getFullYear()}
                  </div>
                  <div style={{ fontSize: "1.2rem" }}>
                    {new Date(plan.startDate).toLocaleDateString("en-US", { day: "2-digit", month: "short" })} -{" "}
                    {new Date(plan.endDate).toLocaleDateString("en-US", { day: "2-digit", month: "short" })}
                  </div>
                </DateOverlay>
              </ImagePlaceholder>

              {/* 일정 제목 */}
              <div style={{ padding: "1rem 0" }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
                    fontWeight: theme.font.weight.bold,
                  }}
                >
                  {plan.title}
                </h3>
              </div>
            </PlanCard>
          );
        })}
      </PlansContainer>

      {/* 삭제 확인 모달 */}
      {deleteTarget !== null && (
        <DeleteModal>
          <ModalInner>
            <h3>일정을 삭제하시겠습니까?</h3>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <Button
                scheme="alert"
                onClick={() => {
                  deletePlan(plans[deleteTarget].id);
                  setDeleteTarget(null);
                }}
              >
                삭제
              </Button>
              <Button scheme="primary" onClick={() => setDeleteTarget(null)}>
                취소
              </Button>
            </div>
          </ModalInner>
        </DeleteModal>
      )}

      {/* 페이지네이션 */}
      {plans.length > itemsPerPage && (
        <Pagination>
          {[
            { label: "<", disabled: currentPage === 1 },
            { label: currentPage, disabled: true },
            { label: ">", disabled: currentPage === Math.ceil(plans.length / itemsPerPage) },
          ].map((item, i) => (
            <PageButton
              key={i}
              onClick={() =>
                setCurrentPage((p) => (i === 0 ? p - 1 : i === 2 ? p + 1 : p))
              }
              disabled={item.disabled}
              $isActive={false}
            >
              {item.label}
            </PageButton>
          ))}
        </Pagination>
      )}

      {/* 새 일정 생성 버튼 */}
      <NewPlanButton>
        <Button scheme="primary" onClick={() => setIsModalOpen(true)}>
          + 새 일정 생성
        </Button>
      </NewPlanButton>

      {/* 새 일정 생성 모달 */}
      <Modal
        type="plan"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(plan) => {
          addPlan({
            ...plan,
            id: Date.now().toString(),
          });
          setIsModalOpen(false);
        }}
      />

      {/* 참가자 목록 모달 */}
      {showParticipantsModalFor && (
        <ParticipantsModal onClick={() => setShowParticipantsModalFor(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>참가자 목록</ModalTitle>
            <ParticipantsList>
              {(participantsById[showParticipantsModalFor] || []).map((nickname: string, idx: number) => (
                <ParticipantItem key={idx}>
                  <ParticipantAvatar />
                  <ParticipantName>{nickname}</ParticipantName>
                  <RemoveButton
                    onClick={() =>
                      setRemoveParticipantInfo({ planId: showParticipantsModalFor!, index: idx })
                    }
                  >
                    ➖
                  </RemoveButton>
                </ParticipantItem>
              ))}
            </ParticipantsList>
            <InviteSection>
              <div>초대링크</div>
              <InviteLink readOnly value="https://www.trip-together.co.kr" />
            </InviteSection>
            <CloseButtonWrapper>
              <Button scheme="primary" onClick={() => setShowParticipantsModalFor(null)}>
                닫기
              </Button>
            </CloseButtonWrapper>
          </ModalContent>
        </ParticipantsModal>
      )}

      {/* 참가자 삭제 확인 모달 */}
      {removeParticipantInfo && (
        <DeleteModal>
          <ModalInner>
            <h3>
              "{(participantsById[removeParticipantInfo.planId] || [])[removeParticipantInfo.index]}"
              <br />
              삭제하시겠습니까?
            </h3>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <Button scheme="alert" onClick={handleRemoveParticipant}>
                삭제
              </Button>
              <Button scheme="primary" onClick={() => setRemoveParticipantInfo(null)}>
                취소
              </Button>
            </div>
          </ModalInner>
        </DeleteModal>
      )}
    </HomeStyle>
  );
}

 //  Redux 연결
export default connect(
  (state: RootState) => ({ plans: state.plan.plans }),
  { addPlan, deletePlan }
)(Home);


const HomeStyle = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  gap: 4rem;
  overflow-x: hidden;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.color.primary_green};
    border-radius: 4px;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: auto;
  bottom: 120px;
  position: relative;
`;

const PageButton = styled.button<{ $isActive: boolean; disabled: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  background-color: ${({ theme }) => theme.color.primary_white};
  color: ${({ theme }) => theme.color.primary_black};
  cursor: pointer;
  font-family: ${({ theme }) => theme.font.family.contents};
  font-size: 1.2rem;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  &:hover:not(:disabled) {
    opacity: 0.8;
  }
`;

const PlansContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 300px));
  grid-auto-rows: auto;
  gap: clamp(8rem, 2vw, 2rem);
  width: 90%;
  max-width: 1200px;
  padding: 2rem;
  place-content: center;
  margin-bottom: 80px;
  font-family: ${({ theme }) => theme.font.family.default};

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(180px, 300px));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, minmax(180px, 300px));
  }
`;

const NoPlanMessage = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: ${({ theme }) => theme.color.input_text};
  font-size: 3rem;
  font-family: ${({ theme }) => theme.font.family.contents};
  z-index: -1;
`;

const PlanCard = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  min-height: 300px;
  background: ${({ theme }) => theme.color.card_black};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(0.5rem, 2vw, 1.5rem);
  border: none;
  box-shadow: 0 2px 8px #000000;
  transition: transform 0.2s ease;
  font-family: ${({ theme }) => theme.font.family.contents};
  cursor: pointer;

  &:hover {
    transform: scale(1.02);
  }
`;

const ImagePlaceholder = styled.div`
  position: relative;
  width: 100%;
  height: 70%;
  background: ${({ theme }) => theme.color.input_background};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  overflow: hidden;
  z-index: 1;
`;

const PlanImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  position: absolute;
  top: 0;
  left: 0;
`;

const DateOverlay = styled.div`
  text-align: left;
  position: absolute;
  width: 90%;
  bottom: 1px;
  left: 50%;
  transform: translateX(-50%);
  color: ${({ theme }) => theme.color.input_text};
  font-family: ${({ theme }) => theme.font.family.contents};
  background: transparent;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: transparent;
  color: ${({ theme }) => theme.color.primary_white};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  z-index: 10;
  &:hover {
    opacity: 0.8;
  }
`;

const ParticipantsButton = styled.button`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.color.primary_white};
  color: ${({ theme }) => theme.color.primary_black};
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: bold;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    opacity: 0.8;
  }
`;

const ParticipantsRow = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 3.5rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  z-index: 10;
`;

const SmallAvatar = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.color.primary_white};
  color: ${({ theme }) => theme.color.primary_black};
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MoreCount = styled.span`
  color: ${({ theme }) => theme.color.primary_black};
  font-weight: bold;
  font-size: 0.85rem;
`;

const ParticipantsModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  width: 400px;
  max-width: 90%;
  background: ${({ theme }) => theme.color.primary_white};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  padding: 2rem;
`;

const ModalTitle = styled.h2`
  margin: 0 0 1rem 0;
  font-family: ${({ theme }) => theme.font.family.contents};
`;

const NewPlanButton = styled.div`
  position: fixed;
  bottom: 60px;
  right: 50px;
`;

const ParticipantsList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.color.primary_green};
    border-radius: 4px;
  }
`;

const ParticipantItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0.5rem;
`;

const ParticipantAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.color.card_background};
`;

const ParticipantName = styled.span`
  flex: 1;
  font-size: 1rem;
  color: ${({ theme }) => theme.color.primary_green};
  font-family: ${({ theme }) => theme.font.family.contents};
`;

const RemoveButton = styled.button`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.color.primary_white};
  color: white;
  border: none;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    opacity: 0.8;
  }
`;

const InviteSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 1rem;
  div {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.color.primary_black};
    font-family: ${({ theme }) => theme.font.family.contents};
  }
`;

const InviteLink = styled.input`
  background: ${({ theme }) => theme.color.input_background};
  color: ${({ theme }) => theme.color.primary_black};
  border: 1px solid ${({ theme }) => theme.color.input_text};
  border-radius: 5px;
  padding: 0.5rem;
  font-family: ${({ theme }) => theme.font.family.contents};
`;

const CloseButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const DeleteModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  font-family: ${({ theme }) => theme.font.family.contents};
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalInner = styled.div`
  background: ${({ theme }) => theme.color.primary_white};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  text-align: center;
  h3 {
    margin-bottom: 1.5rem;
    color: ${({ theme }) => theme.color.primary_black};
    font-family: ${({ theme }) => theme.font.family.contents};
    line-height: 1.4;
  }
`;
