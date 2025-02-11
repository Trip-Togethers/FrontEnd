import { styled } from "styled-components";
import React, { useEffect, useState } from "react";
import { showDetailPlan } from "@api/detail.api";
import { useParams } from "react-router-dom";
import { createPlan, editPlan, showPlan } from "@api/schedule.api";
import { formatDate } from "@utils/date.format";
import { getUserIdFromToken } from "@utils/get.token.utils";
import { userPage } from "@api/user.api";
import Ticket from "@components/detail/Ticket";
import Modal from "@components/common/Modal";

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

function Detail() {
  const { tripId } = useParams<{ tripId: string }>();
  const [mainSchedule, setMainSchedule] = useState<Schedules | null>(null);
  const [scheduleData, setScheduleData] = useState<DaySchedule[]>([]);
  const [userData, setUserData] = useState<any>(null); // 유저 정보를 저장할 상태
  const [guests, setGuests] = useState<Array<{ userId: number; nickname: string }>>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 일정 데이터를 3개씩 분할
  const paginatedSchedule = (scheduleData: any[]) => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return scheduleData.slice(startIndex, endIndex);
  };

  // 페이지 이동 함수
  const handlePageChange = (direction: "next" | "prev") => {
    if (direction === "next" && (currentPage + 1) * itemsPerPage < scheduleData.length) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

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
        <Modal
          type="plan"
          isOpen={isModalOpen} // 모달 열고 닫는 상태를 isModalOpen으로 관리
          onClose={() => setIsModalOpen(false)} // 모달 닫기
          onSubmit={async (plan: any) => {
            await editPlan({
              ...plan,
            }, Number(tripId));
            setIsModalOpen(false);
            window.location.reload();
          }}
          planData={mainSchedule}
        />
      </TicketContainer>
      <ScheduleContainer>
        <Schedule>
          {Array.isArray(scheduleData) && scheduleData.length > 0 ? (
            paginatedSchedule(scheduleData).map((day, index) => (
              <Day key={index}>
                <DateTitle>{day.scheduleDate}</DateTitle>
                <ScheduleList>
                  {day.currentDate !== "No detail available" ? (
                    <ScheduleItem>{day.currentDate}</ScheduleItem>
                  ) : (
                    <ScheduleItem>상세 일정이 없습니다.</ScheduleItem>
                  )}
                </ScheduleList>
              </Day>
            ))
          ) : (
            <p>일정이 없습니다.</p>
          )}
        </Schedule>
        {scheduleData.length > itemsPerPage && (
          <Pagination>
            <ArrowButton onClick={() => handlePageChange("prev")} disabled={currentPage === 0}>
              {"<"}
            </ArrowButton>
            <ArrowButton onClick={() => handlePageChange("next")} disabled={(currentPage + 1) * itemsPerPage >= scheduleData.length}>
              {">"}
            </ArrowButton>
          </Pagination>
        )}
      </ScheduleContainer>
    </DetailContainer>
  );
};

const DetailContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
`;

const TicketContainer = styled.div`
  margin-bottom: 30px; /* 티켓과 일정 사이의 간격 */
  display: flex;
  justify-content: center;
`;

const ScheduleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 13%;
`;

const Schedule = styled.div`
  display: flex;
  flex-direction: row;  /* 가로로 나열 */
  gap: 20px;  /* 각 일정 항목 간의 간격 */
  margin: 20px 0;
  justify-content: flex-start;  /* 왼쪽 정렬 */
  flex-wrap: wrap;  /* 화면 크기에 맞게 자동으로 줄바꿈 */
`;

const Day = styled.div`
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const DateTitle = styled.h3`
  color: #00703c;
  margin-bottom: 10px;
`;

const ScheduleList = styled.ul`
  display: flex;  /* 가로로 나열 */
  list-style: none;
  padding: 0;
  margin: 0;
  flex-wrap: wrap;  /* 가로로 넘칠 경우 자동으로 줄바꿈 */
`;

const ScheduleItem = styled.li`
  padding: 5px 10px;
  margin-right: 15px;  /* 각 아이템 간의 간격 */
  background-color: #f4f4f4;
  border-radius: 5px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const ArrowButton = styled.button`
  padding: 10px;
  background-color: #00703c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 10px;
  font-size: 16px;

  &:disabled {
    background-color: #d1d1d1;
    cursor: not-allowed;
  }
`;

export default Detail;