import { styled } from "styled-components";
import React, { useEffect, useState } from "react";
import { showDetailPlan } from "@api/detail.api";
import { useParams } from "react-router-dom";
import { showPlan } from "@api/schedule.api";
import { formatDate } from "@utils/date.format";
import { getUserIdFromToken } from "@utils/get.token.utils";
import { userPage } from "@api/user.api";

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
      <TripInfoCard>
        <Ticket>
          <TicketContent>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <SideSection>
                <SideLabel>TRIP</SideLabel>
              </SideSection>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "0px",
                }}
              >
                <LeftSection>
                  <InfoBox>
                    <Label>Title</Label>
                    <Title>{mainSchedule.title}</Title>
                  </InfoBox>
                  <InfoRow>
                    <InfoBox>
                      <Label>From</Label>
                      <Date>{formatDate(mainSchedule.startDate)}</Date>
                    </InfoBox>
                    <InfoBox>
                      <Label>To</Label>
                      <Date>{formatDate(mainSchedule.endDate)}</Date>
                    </InfoBox>
                    <InfoBox>
                      <Label>Destination</Label>
                      <Destination>{mainSchedule.destination}</Destination>
                    </InfoBox>
                  </InfoRow>
                </LeftSection>
                <PassengersContainer>
                <Passengers>{mainSchedule.guests.join(", ")}</Passengers>
              </PassengersContainer>
              </div>

              <PhotoSection>
                <TripPhoto
                  src={mainSchedule.photoUrl || "/path/to/photo.jpg"}
                  alt="Trip"
                />
              </PhotoSection>
            </div>

            <BarcodeSection>
              <Barcode />
            </BarcodeSection>
          </TicketContent>
        </Ticket>
      </TripInfoCard>

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

const SideSection = styled.div`
  background: #00703c;
  color: white;
  padding: 10px;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-weight: bold;
  font-size: 18px;
`;

const TripInfoCard = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const Ticket = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 90%;
  border: 2px solid #00703c;
  display: flex;
  align-items: center;
`;

const TicketContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const Title = styled.div`
  margin-top: 10px;
  font-family: ${({ theme }) => theme.font.family.contents};
  font-size: 1.2rem;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 20px;
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px; /* border와 콘텐츠 간 간격 */
  margin: 10px; /* 요소 바깥쪽 간격 */
`;

const Label = styled.span`
  font-weight: bold;
`;

const Date = styled.span`
  font-size: 14px;
  margin-top: 10px;
  font-family: ${({ theme }) => theme.font.family.contents};
  font-size: 1.2rem;
`;

const Destination = styled.span`
  font-size: 14px;
  margin-top: 10px;
  font-family: ${({ theme }) => theme.font.family.contents};
  font-size: 1.2rem;
`;

const PassengersContainer = styled.div`
  margin-top: 5px;
`;

const Passengers = styled.div`
  margin-top: 18px;
  margin-left: 20px;
`;

const PhotoSection = styled.div`
  margin: 0 20px;
`;

const TripPhoto = styled.img`
  width: 150px;
  height: auto;
  border-radius: 10px;
`;

const BarcodeSection = styled.div`
  display: flex;
  align-items: center;
`;

const Barcode = styled.div`
  width: 30px;
  height: 150px;
  background: repeating-linear-gradient(
    to bottom,
    black,
    black 4px,
    white 4px,
    white 8px
  );
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
