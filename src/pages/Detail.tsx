import { styled } from "styled-components";
import React, { useEffect, useState } from "react";
import { createSubPlan, editSubPlan, removeSubPlan, showDetailPlan } from "@api/detail.api";
import { useParams } from "react-router-dom";
import { editPlan, showPlan } from "@api/schedule.api";
import { getUserIdFromToken } from "@utils/get.token.utils";
import { userPage } from "@api/user.api";
import Ticket from "@components/detail/Ticket";
import Modal from "@components/common/Modal";
import DetailModal from "@components/detail/DetailModal";
import { RadioButtonUnchecked, ArrowUploadReady, PlaneIcon } from "@assets/svg";
import { TodoItem } from "models/todo.model";
import { CreateSubData } from "models/schedule.model";
import Button from "@components/common/Button";

interface Schedules {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  destination: string;
  guests: { userId: number; nickname: string }[];
  photoUrl: string;
}

interface DaySchedule {
  scheduleDate: string;
  currentDate: string;
}

interface DetailProps {
  scheduleList: TodoItem[];
  selectedDate: Date; // 선택한 날짜
}

const Detail: React.FC<DetailProps> = ({ scheduleList, selectedDate }) => {
  const { tripId } = useParams<{ tripId: string }>();
  const [mainSchedule, setMainSchedule] = useState<Schedules | null>(null);
  const [scheduleData, setScheduleData] = useState<DaySchedule[]>([]);
  const [userData, setUserData] = useState<any>(null); // 유저 정보를 저장할 상태
  const [guests, setGuests] = useState<
    Array<{ userId: number; nickname: string }>
  >([]);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<DaySchedule | null>(
    null
  );

  const [selectedItem, setSelectedItem] = useState<CreateSubData | null>(null); // 선택된 항목 상태
  const [showMenu, setShowMenu] = useState(false); // 메뉴의 표시 여부

  const [isEditMode, setIsEditMode] = useState(false);
  const [subPlanId, setSubPlanId] = useState<number>(); 

  // 일정 데이터를 3개씩 분할
  const paginatedSchedule = (scheduleData: any[]) => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return scheduleData.slice(startIndex, endIndex);
  };

  // 페이지 이동 함수
  const handlePageChange = (direction: "next" | "prev") => {
    if (
      direction === "next" &&
      (currentPage + 1) * itemsPerPage < scheduleData.length
    ) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleMoreClick = (item: CreateSubData) => {
    setIsDetailModalOpen(false); // '...' 클릭 시 DetailModal을 닫기
    setSelectedItem(item); // 클릭한 항목을 선택
    setShowMenu((prev) => !prev); // 메뉴 토글
  };

  const handleScheduleClick = (schedule: DaySchedule) => {
    setSelectedSchedule(schedule);
    setIsDetailModalOpen(true); // 일정 클릭 시 DetailModal 열기
    setIsEditMode(false); // "추가 모드"로 설정
  };

  const handleEdit = async (item: CreateSubData, day: DaySchedule) => {
    setSubPlanId(item.id)
    setSelectedSchedule(day);
    setIsDetailModalOpen(true); // 모달 열기
    setIsEditMode(true); // "수정 모드"로 설정
  };

  const handleDelete = async(item: CreateSubData) => {
    const subId = item.id;
    try {
      if (subId) { 
        const data = await removeSubPlan(Number(tripId), subId);
        console.log("일정 삭제 성공:", data);        
        window.location.reload();
      } else {
        console.warn("유효한 일정 아이디가 없습니다.");
      }
    } catch (error) {
      console.error("일정 데이터를 삭제하는 중 오류 발생:", error);
    }
  }

  useEffect(() => {
    if (!tripId) {
      console.warn("유효하지 않은 tripId:", tripId);
      return;
    }
    const fetchUserData = async () => {
      const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 가져오기
      if (!token) {
        return;
      }

      const userId = getUserIdFromToken(token); // 토큰에서 userId 가져오기
      if (!userId) {
        return;
      }

      try {
        const response = await userPage(userId); // userPage API 호출
        setUserData({ ...response.user, userId }); // 유저 정보 저장
      } catch (error) {
        console.error("유저 정보를 가져오는 데 실패했습니다.");
      }
    };

    const fetchData = async () => {
      try {
        const data = await showDetailPlan(Number(tripId));
        console.log("API 데이터 수신:", data);

        if (data && Array.isArray(data.scheduleDate)) {
          setScheduleData(data.scheduleDate); // API의 scheduleDate로 설정
        } else {
          console.warn("유효하지 않은 일정 데이터 형식:", data.scheduleDate);
        }

        const mainData = await showPlan();
        console.log("메인 일정 데이터:", mainData);

        const foundSchedule = mainData.schedules.find(
          (item: Schedules) => item.id === Number(tripId)
        );

        if (foundSchedule) {
          setMainSchedule(foundSchedule);
        } else {
          console.warn("해당 ID의 일정을 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("일정 데이터를 불러오는 중 오류 발생:", error);
      }
    };

    fetchData();
    fetchUserData();
  }, [tripId]);

  if (!mainSchedule) return <p>일정 정보를 불러오는 중입니다...</p>;

  return (
    <DetailContainer>
      <TicketContainer>
        <Ticket onClick={() => setIsModalOpen(true)} />
        {isDetailModalOpen && selectedSchedule && (
          <DetailModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)} // 모달 닫기
            scheduleData={selectedSchedule}
            isEditMode={isEditMode} // 추가 or 수정 모드 구분
            selectedScheduleIndex={subPlanId}
            onSubmit={async (newSchedule: CreateSubData) => {
              if (isEditMode) {
                if (subPlanId) {
                  // 기존 일정 수정
                  await editSubPlan(Number(tripId), subPlanId, newSchedule);
                } else {
                  console.log("세부일정 아이디가 존재하지 않습니다.");
                }
              }
              else {
                // 새로운 일정 추가
                await createSubPlan(Number(tripId), newSchedule);
              }
              window.location.reload();
              setIsModalOpen(false);
            }}
          />
        )}
        <Modal
          type="plan"
          isOpen={isModalOpen} // 모달 열고 닫는 상태를 isModalOpen으로 관리
          onClose={() => setIsModalOpen(false)} // 모달 닫기
          onSubmit={async (plan: any) => {
            await editPlan(
              {
                ...plan,
              },
              Number(tripId)
            );
            setIsModalOpen(false);
            window.location.reload();
          }}
          planData={mainSchedule}
        />
      </TicketContainer>

      <ScheduleContainer>
        <ArrowButton
          onClick={() => handlePageChange("prev")}
          disabled={currentPage === 0}
        >
          {"<"}
        </ArrowButton>
        <Schedule>
          {Array.isArray(scheduleData) && scheduleData.length > 0 ? (
            paginatedSchedule(scheduleData).map((day, index) => (
              <Day key={index}>
                <DateTitle>
                  {new Date(day.scheduleDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  })}{" "}
                </DateTitle>
                <IconStyle>
                  {(() => {
                    const today = new Date().setHours(0, 0, 0, 0); // 현재 날짜 (시간 제거)
                    const scheduleDate = new Date(day.scheduleDate).setHours(
                      0,
                      0,
                      0,
                      0
                    ); // 일정 날짜 (시간 제거)
                    const startDate = new Date(mainSchedule.startDate).setHours(
                      0,
                      0,
                      0,
                      0
                    ); // 일정 시작 날짜
                    const endDate = new Date(mainSchedule.endDate).setHours(
                      0,
                      0,
                      0,
                      0
                    ); // 일정 종료 날짜
                    if (startDate === scheduleDate) {
                      if (startDate > today) {
                        return [
                          <div />,
                          <ArrowUploadReady className="status_icon" />,
                          <hr className="dotted_line" />,
                        ];
                      } else {
                        return [
                          <div />,
                          <RadioButtonUnchecked className="status_icon" />,
                          <hr className="solid_line" />,
                        ];
                      }
                    } else if (endDate === scheduleDate) {
                      if (endDate > today) {
                        return [
                          <hr className="dotted_line" />,
                          <ArrowUploadReady className="status_icon" />,
                          <div />,
                        ];
                      } else {
                        return [
                          <hr className="solid_line" />,
                          <RadioButtonUnchecked className="status_icon" />,
                          <div />,
                        ];
                      }
                    } else {
                      if (scheduleDate === today) {
                        return [
                          <hr className="solid_line" />,
                          <PlaneIcon className="status_icon" />,
                          <hr className="dotted_line" />,
                        ];
                      } else if (scheduleDate < today) {
                        return [
                          <hr className="solid_line" />,
                          <RadioButtonUnchecked className="status_icon" />,
                          <hr className="solid_line" />,
                        ];
                      } else {
                        return [
                          <hr className="dotted_line" />,
                          <ArrowUploadReady className="status_icon" />,
                          <hr className="dotted_line" />,
                        ];
                      }
                    }
                  })()}
                </IconStyle>
                <ScheduleList>
                  {Array.isArray(day.currentDate) &&
                  day.currentDate.length > 0 ? (
                    [...day.currentDate] // 원본 배열을 복사하여 정렬
                      .sort((a, b) =>
                        a.scheduleTime.localeCompare(b.scheduleTime)
                      ) // 시간순 정렬
                      .map((item: CreateSubData, idx: number) => (
                        <li key={idx} className="schedule-item">
                          {item.scheduleTime.slice(0, 5)} -{" "}
                          {item.scheduleContent}
                          <span
                            className="more-icon"
                            onClick={() => handleMoreClick(item)} // 클릭 시 메뉴 토글
                          >
                            ...
                          </span>
                          {showMenu && selectedItem === item && (
                            <div className="menu">
                              <button
                                onClick={() => handleEdit(selectedItem, day)}
                                className="menu-button edit"
                              >
                                수정
                              </button>
                              <button
                                onClick={() => handleDelete(selectedItem)}
                                className="menu-button delete"
                              >
                                삭제
                              </button>
                            </div>
                          )}
                        </li>
                      ))
                  ) : (
                    <li>세부 일정이 없습니다.</li>
                  )}
                  <Button
                    scheme="primary"
                    onClick={() => handleScheduleClick(day)}
                  >
                    추가하기
                  </Button>
                </ScheduleList>
              </Day>
            ))
          ) : (
            <p>일정이 없습니다.</p>
          )}
        </Schedule>
        <ArrowButton
          onClick={() => handlePageChange("next")}
          disabled={(currentPage + 1) * itemsPerPage >= scheduleData.length}
        >
          {">"}
        </ArrowButton>
      </ScheduleContainer>
    </DetailContainer>
  );
};

const DetailContainer = styled.div`
  padding: 20px;
  center;
`;

const TicketContainer = styled.div`
  margin-bottom: 30px; /* 티켓과 일정 사이의 간격 */
  display: flex;
  justify-content: center;
`;

const ScheduleContainer = styled.div`
  position: fixed;
  display: flex;
  flex-direction: row;
  text-align: center;
  margin-top: 14rem;
  left: 50%;
  transform: translate(-50%, 0);
  width: 80rem;
  height: 35rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  justify-content: space-between;
`;

const Schedule = styled.div`
  display: flex;
  flex-direction: row;
`;

const Day = styled.div`
  background: white;
  border-radius: 8px;
  text-align: center;
  font-family: ${({ theme }) => theme.font.family.contents};
  color: ${({ theme }) => theme.color.primary_black};
`;

const IconStyle = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  div {
    width: 130px;
  }
  .status_icon {
    width: 40px;
    margin: 10px;
    fill: ${({ theme }) => theme.color.primary_green};
  }
  .solid_line {
    margin-top: 25px;
    width: 150px;
    border: 0px;
    border-top: 5px solid ${({ theme }) => theme.color.primary_green};
  }
  .dotted_line {
    margin-top: 25px;
    margin-right: 5px;
    width: 150px;
    border: 0px;
    border-top: 5px dotted ${({ theme }) => theme.color.primary_green};
  }
`;

const DateTitle = styled.h3`
  margin-bottom: 10px;
  font-size: 2.3rem;
`;

const ScheduleList = styled.ul`
  display: flex;
  flex-direction: column; /* 세로 정렬 */
  list-style: none;
  text-align: center;
  padding: 0;
  width: 100%; /* 부모 요소 기준 전체 너비 */
  gap: 8px; /* 항목 간 간격 */
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */

  .schedule-item {
  margin-left: 30px;
    display: flex;
    justify-content: center; /* 가로 중앙 정렬 */
    align-items: center; /* 세로 중앙 정렬 */
    position: relative; /* 아이콘 위치를 절대 좌표로 지정할 수 있게 해줌 */
    padding-right: 30px; /* 아이콘을 위해 여백을 추가 */
  }

  .schedule-item:hover .more-icon {
    display: block; /* 마우스를 올리면 아이콘 보이기 */
  }

  .more-icon {
    display: none; /* 기본적으로 아이콘 숨김 */
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%) rotate(90deg); /* 세로로 회전 */
    cursor: pointer;
  }

  .menu {
  position: absolute;
  left: 100%; /* 오른쪽에 띄우기 위해 left를 100%로 설정 */
  top: 50%;
  transform: translateY(-50%);
  background-color: #ffffff; /* 화이트 배경으로 깔끔한 느낌 */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 부드러운 그림자 효과 */
  padding: 10px 15px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.schedule-item:hover .menu {
  opacity: 1;
  visibility: visible;
}

.menu-button {
  padding: 8px 15px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  color: #333333; /* 글자 색을 다크 그레이로 설정 */
  background-color: #f4f4f4; /* 부드러운 회색 배경 */
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.menu-button.edit {
  background-color: ${({ theme }) => theme.color.primary_green};
  font-family: ${({ theme }) => theme.font.family.contents};
  color: white;
}

.menu-button.delete {
  background-color: #ef5350; /* 삭제 버튼 색상: 붉은색 */
  font-family: ${({ theme }) => theme.font.family.contents};
  color: white;
}

.menu-button:hover {
  background-color: #d1d1d1; /* 버튼 호버 시 배경을 살짝 어두운 회색으로 변경 */
  transform: translateX(5px); /* 버튼에 호버 시 살짝 이동 */
}

.menu-button:focus {
  outline: none; /* 버튼 포커스 시 외곽선 제거 */
}

.schedule-item:hover .more-icon {
  display: block; /* 마우스를 올리면 아이콘 보이기 */
}
`;

const ArrowButton = styled.button`
  padding: 10px;
  color: #a0a09f;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 10px;
  font-size: 4rem;
  background-color: transparent;

  &:disabled {
    cursor: not-allowed;
    color: transparent;
    &:hover {
      color: transparent;
    }
  }

  &:hover {
    color: ${({ theme }) => theme.color.input_text};
    transform: scale(1.1);
  }
`;

export default Detail;
