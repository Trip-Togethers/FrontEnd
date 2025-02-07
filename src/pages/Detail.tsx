import { styled } from "styled-components";
import React, { useEffect, useState } from "react";
import { showDetailPlan } from "@api/detail.api";
import { useParams } from "react-router-dom";
import { showPlan } from "@api/schedule.api";
import { formatDate } from "@utils/date.format";
import { getUserIdFromToken } from "@utils/get.token.utils";
import { userPage } from "@api/user.api";
import Ticket from "@components/detail/Ticket";

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
      <Ticket />
      {/* 일정 데이터 렌더링 */}
      <Schedule>
        {Array.isArray(scheduleData) && scheduleData.length > 0 ? (
          scheduleData.map((day, index) => (
            <Day key={index}>
              <DateTitle>{day.scheduleDate}</DateTitle> {/* 날짜 표시 */}
              <ScheduleList>
                {day.currentDate !== "No detail available" ? (
                  <ScheduleItem>{day.currentDate}</ScheduleItem> // 일정이 있을 경우
                ) : (
                  <ScheduleItem>상세 일정이 없습니다.</ScheduleItem> // 일정이 없을 경우
                )}
              </ScheduleList>
            </Day>
          ))
        ) : (
          <p>일정이 없습니다.</p>
        )}
      </Schedule>
    </DetailContainer>
  );
}


const SideLabel = styled.div`
  width: 30px;
  height: 150px;
  text-align: center;
`;

const DetailContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
`;

const Schedule = styled.div`
  display: grid; /* 변경된 부분: grid로 수정 */
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* 일정이 가로로 일정 수 만큼 배치 */
  justify-content: center;
  margin: 20px 0;
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
  list-style: none;
  padding: 0;
`;

const ScheduleItem = styled.li`
  padding: 5px 0;
`;

export default Detail;