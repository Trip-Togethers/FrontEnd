import { styled } from "styled-components";
import React, { useEffect, useState } from "react";
import { showDetailPlan } from "@api/detail.api";
import { useParams } from "react-router-dom";
import { showPlan } from "@api/schedule.api";
import { formatDate } from "@utils/date.format";
import Ticket from "@components/detail/Ticket";

interface Schedules {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  destination: string;
  guests: string[];
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

  useEffect(() => {
    if (!tripId) {
      console.warn("유효하지 않은 tripId:", tripId);
      return;
    }

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

const DetailContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
`;

const Schedule = styled.div`
  display: flex;
  gap: 20px;
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
