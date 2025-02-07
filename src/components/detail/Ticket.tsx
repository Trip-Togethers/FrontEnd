import styled from "styled-components";
import { Barcode } from "@assets/svg";
import { useParams } from "react-router-dom";
import { showDetailPlan } from "@api/detail.api";
import { showPlan } from "@api/schedule.api";
import { LogoRotate } from "@assets/svg";
import { useEffect, useState } from "react";
import { formatDate } from "@utils/date.format";

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

const Ticket = () => {
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
    <TicketStyle>
      <div className="logo-background">
        <LogoRotate className="logo" />
      </div>

      <div className="info">
        <div className="first_line">
          <InfoBox>
            <Label>Title</Label>
            <div className="contents_title">{mainSchedule.title}</div>
          </InfoBox>
          <InfoBox>
            <Label>From</Label>
            <div className="contents_date">
              {formatDate(mainSchedule.startDate)}
            </div>
          </InfoBox>
          <InfoBox>
            <Label>To</Label>
            <div className="contents_date">
              {formatDate(mainSchedule.endDate)}
            </div>
          </InfoBox>
          <Destination>
            <Label>Destination</Label>
            <div className="contents_destinaton">
              {mainSchedule.destination}
            </div>
          </Destination>
        </div>
        <PassengersContainer>
          <Label>Passangers</Label>
          <div className="contents_group">{mainSchedule.guests.join(", ")}</div>
        </PassengersContainer>
      </div>

      <PhotoSection>
        <img src={mainSchedule.photoUrl} alt={mainSchedule.title} />
      </PhotoSection>
      <Barcode className="barcode" />
    </TicketStyle>
  );
};

const Destination = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  padding-left: 0.5rem;
  padding-bottom: 2rem;
  padding-right: 4rem;
`;

const PassengersContainer = styled.div`
  border-top: 1px solid #999997;
  padding-left: 0.5rem;
  padding-top: 0.5rem;
  color: ${({ theme }) => theme.color.name_gray};
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  padding-left: 0.5rem;
  padding-bottom: 2rem;
  padding-right: 4rem;
  border-right: 1px solid #999997;
`;

const Label = styled.span`
  font-family: ${({ theme }) => theme.font.family.title};
  font-weight: ${({ theme }) => theme.font.weight.light};
  color: #6f6f6f;
`;

const PhotoSection = styled.div`
  height: 11rem;
  border-radius: 10px;
`;

const TicketStyle = styled.div`
  position: fixed;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border-radius: 10px;
  border: 1px solid #cfcfcc;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 4px 5px 0px;
  height: 12rem;
  background-color: ${({ theme }) => theme.color.card_background};
  min-width: 800px;

  .logo-background {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.color.primary_green};
    color: white;
    width: 3.4rem;
    height: 100%;
    border-radius: 10px 0 0 10px;
    padding: 0.7rem;
  }

  .logo {
    height: 100%;
  }

  .info {
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
  }

  .first_line {
    display: flex;
    height: 6rem;
    font-family: ${({ theme }) => theme.font.family.contents};
  }

  .contents_title {
    width: 12rem;
  }

  .contents_date {
    width: 7rem;
  }

  .contents_destination {
    width: 7rem;
  }

  .contents_group {
    padding-top: 0.5rem;
    font-family: ${({ theme }) => theme.font.family.contents};
  }

  .barcode {
    height: 12rem;
    padding: 0.5rem;
    align-items: center;
  }

  img {
    height: 11rem;
    margin-left: 1rem;
    margin-right: 1rem;
    border-radius: 10px;
  }
`;

export default Ticket;
