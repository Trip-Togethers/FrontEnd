import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import Modal from "@components/common/Modal";
import Button from "@components/common/Button";
import { FaCopy } from "react-icons/fa";
import {
  createLink,
  createPlan,
  removePlan,
  showPlan,
} from "@api/schedule.api";
import { getUserInfo } from "@api/user.api";

// Schedule 인터페이스 및 Home 컴포넌트
interface Schedule {
  id: number;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  photoUrl: string;
  owner: number;
  guests: string[];
}

const Home = () => {
  const [data, setData] = useState<Schedule[]>([]); // 데이터 상태
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]); // 유저 정보를 담을 상태 추가
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const itemsPerPage = 5; // 한 페이지에 보여줄 일정 개수
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [link, setLink] = useState<string>("");

  // 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await showPlan();
        if (Array.isArray(response.schedules)) {
          setData(response.schedules); // schedules 배열을 상태에 저장
        } else {
          setError("데이터 형식이 잘못되었습니다.");
        }
        // 유저 데이터 가져오기
        const usersData = await Promise.all(
          response.schedules.map(async (schedule: Schedule) => {
            // 해당 여행의 유저 정보 가져오기 (tripId 사용)
            const userInfo = await getUserInfo(schedule.id); // 각 여행마다 tripId를 넘겨서 유저 정보 가져옴
            return { scheduleId: schedule.id, users: userInfo.users }; // 유저 정보 반환
          })
        );

        const usersMap = usersData.reduce(
          (acc: any, { scheduleId, users }: any) => {
            acc[scheduleId] = users; // scheduleId를 키로 사용하여 유저 정보 저장
            return acc;
          },
          {}
        );
        setUsers(usersMap);
        console.log(usersMap);
      } catch (err: any) {
        if (err.response?.status === 404) {
          // 404 에러일 경우 일정이 없는 상태로 처리
          setData([]); 
        } else {
          setError("데이터를 가져오는 데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 페이지네이션 적용
  const currentPlans = [...data]
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    ) // 일정 날짜순으로 정렬
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage); // 현재 페이지의 일정만 슬라이싱

  // 일정 클릭 핸들러
  const handlePlanClick = (e: React.MouseEvent, id: number) => {
    if (!(e.target as HTMLElement).closest(".delete-btn")) {
      // 삭제 버튼이 아니라면
      navigate(`/trips/${id}/activities`); // 해당 일정의 활동 페이지로 이동
    }
  };

  const handleDeletePlan = async (e: React.MouseEvent, id: number) => {
    if (window.confirm("정말로 이 일정을 삭제하시겠습니까?")) {
      try {
        await removePlan(id);
        alert("일정이 삭제되었습니다.");
        window.location.reload(); // 삭제 후 화면 리로드
      } catch (error) {
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleOpenModal = async (
    e: React.MouseEvent,
    planId: number,
    userId: number
  ) => {
    e.stopPropagation(); //
    setIsLinkModalOpen(true); // 모달 열기
    try {
      const createlink = await createLink(planId, userId);
      setLink(createlink);
    } catch (err) {
      setError("데이터를 가져오는 데 실패했습니다.");
      alert(err);
    }
  };

  const handleCloseModal = () => {
    setIsLinkModalOpen(false); // 모달 닫기
  };

  // 복사 함수 추가
  const handleCopyLink = () => {
    if (!link) {
      alert("링크가 없습니다.");
      return;
    }
    navigator.clipboard
      .writeText(link) // 클립보드에 텍스트 복사
      .then(() => {
        alert("초대 링크가 복사되었습니다!"); // 복사 완료 메시지
      })
      .catch(() => {
        alert("복사 실패. 다시 시도해주세요.");
      });
  };

  // 참가자 추가
  const handleAddParticipant = () => {
  };

  // 참가자 삭제 핸들러
  const handleRemoveParticipant = () => {
   
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <HomeStyle>
      {!data.length && (
        <NoPlanMessage>
          아직 일정이 없습니다 :(
          <br />
          버튼으로 새 일정을 생성해보세요!
        </NoPlanMessage>
      )}

      <PlansContainer>
        {currentPlans.map((schedule) => (
          <PlanCard
            key={schedule.id}
            onClick={(e) => handlePlanClick(e, schedule.id)}
          >
            <DeleteButton
              className="delete-btn"
              onClick={(e) => handleDeletePlan(e, schedule.id)}
            >
              ➖
            </DeleteButton>
            <ImagePlaceholder>
              {schedule.photoUrl ? (
                <PlanImage src={schedule.photoUrl} alt={schedule.title} />
              ) : (
                ""
              )}
              <DateOverlay>
                <div>{new Date(schedule.startDate).getFullYear()}</div>
                <DateText>
                  {new Date(schedule.startDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  })}{" "}
                  -{" "}
                  {new Date(schedule.endDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  })}
                </DateText>
              </DateOverlay>
            </ImagePlaceholder>
            <h2>{schedule.title}</h2>
            <ParticipantsButton
              onClick={(e) => handleOpenModal(e, schedule.id, schedule.owner)}
            >
              +
            </ParticipantsButton>

            <ParticipantsRow>
              {users[schedule.id]?.map((user: any, idx: number) => (
                <SmallAvatar key={idx}>
                  <span>{user.role === "creator" ? "👑" : "👤"}</span>
                </SmallAvatar>
              ))}
            </ParticipantsRow>
          </PlanCard>
        ))}
      </PlansContainer>

      {isLinkModalOpen && (
        <ParticipantsModal>
          <ModalContent>
            <InviteLinkTitle>초대링크</InviteLinkTitle>
            <InviteSection>
              <InviteLink readOnly value={link} />
              <FaCopy
                onClick={handleCopyLink}
                style={{
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#007BFF",
                  marginTop: "7px",
                  marginLeft: "9px",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#006D24")} // 마우스 오버 효과
                onMouseLeave={(e) => (e.currentTarget.style.color = "#338A50")} // 마우스 아웃 효과
              />
            </InviteSection>
            <CloseButtonWrapper>
              <Button scheme="primary" onClick={handleCloseModal}>
                닫기
              </Button>
            </CloseButtonWrapper>
          </ModalContent>
        </ParticipantsModal>
      )}
      {/* 새 일정 생성 버튼 */}
      <NewPlanButton>
        <Button scheme="primary" onClick={() => setIsModalOpen(true)}>
          + 새 일정 생성
        </Button>
      </NewPlanButton>
      {/* 새 일정 생성 모달 */}
      <Modal
        type="schedule"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (plan: any) => {
          await createPlan({
            ...plan,
          });
          setIsModalOpen(false);
          window.location.reload();
        }}
      />

      <Pagination>
        <PageButton
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          $isActive={false}
        >
          이전
        </PageButton>
        <span>{currentPage}</span>
        <PageButton
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, Math.ceil(data.length / itemsPerPage))
            )
          }
          disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
          $isActive={false}
        >
          다음
        </PageButton>
      </Pagination>
    </HomeStyle>
  );
};

export default Home;

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
  padding: clamp(0.5rem, 2vw, 1.5rem);
  box-shadow: 0 2px 8px #000000;
  transition: transform 0.2s ease;
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
  right: 1rem;
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
  align-items: left;
  gap: 0.3rem;
  z-index: 10;
  left: 1rem;
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

const DateText = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
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
  flex-direction: row;
  gap: 4px;
  margin-bottom: 1rem;
`;

const InviteLinkTitle = styled.div`
  margin-bottom: 12px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.color.primary_black};
  font-family: ${({ theme }) => theme.font.family.contents};
`;

const InviteLink = styled.input`
  background: ${({ theme }) => theme.color.input_background};
  color: ${({ theme }) => theme.color.primary_black};
  border: 1px solid ${({ theme }) => theme.color.input_text};
  border-radius: 5px;
  padding: 0.5rem;
  font-family: ${({ theme }) => theme.font.family.contents};
  width: 90%;
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
