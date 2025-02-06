import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getUserPlan } from "@api/calendar.api";
import { getUserIdFromToken } from "@utils/get.token.utils";
import { userPage } from "@api/user.api";
import { showPlans } from "@api/post.api";
import { Plan } from "@store/planReducer";

const StyledCalendar = styled(Calendar).attrs((props) => ({
  ...props, // 모든 props 전달
}))`
  width: 100% !important;
  height: 100%;
  max-width: 100% !important;
  background: white !important;
  border: 1px solid #ddd !important;
  border-radius: 8px !important;
  padding: 10px !important;
  font-family: "Arial", sans-serif !important;

  /* 요일 스타일 */
  .react-calendar__month-view__weekdays {
    text-transform: uppercase !important;
    font-size: 12px !important;
    color: #333 !important;
    height: 30px !important;
  }

  /* 기본 날짜 스타일 */
  .react-calendar__tile {
    padding: 10px !important;
    text-align: center !important;
    cursor: pointer !important;
    transition: background 0.3s !important;
    position: relative !important;
  }

  .react-calendar__tile:hover {
    background: #f0f0f0 !important;
    border-radius: 15px;
  }

  /* 이벤트가 있는 날짜 스타일 */
  .event-day div div {
    border-radius: 4px;
    background: #63c647;
    padding: 2px 5px;
    color: rgb(0, 0, 0);
    font-weight: bold !important;
    margin: 5px 0;
  }

  /* 이벤트가 있는 날짜의 span만 푸른 하늘색으로 변경 */
  .event-day abbr span {
    color: deepskyblue !important;
    font-weight: bold !important;
  }

  .react-calendar__tile--active {
    background: #ddd;
    border-radius: 15px;
  }

  .react-calendar__viewContainer {
    height: calc(100% - 75px);
  }

  .react-calendar__month-view {
    height: 100%;
  }

  .react-calendar__month-view div:nth-child(1) {
    align-items: unset !important;
    height: 100%;
  }
  .react-calendar__month-view div:nth-child(1) div:nth-child(1) {
    height: 100%;
  }

  .react-calendar__month-view__days {
    height: 100% !important;
  }
`;

const Popup = styled.div`
  position: absolute;
  width: 150px;
  background-color: white;
  border: 1px solid #ececec;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const CalendarContainer = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

interface EventItem {
  title: string;
  destination: string;
}

const Calendars = () => {
  // 날짜별 이벤트를 { [날짜(YYYY-MM-DD)]: EventItem[] } 형식으로 저장
  const [events, setEvents] = useState<{ [key: string]: EventItem[] }>({});

  // 팝업 상태: 노출여부, 좌표, 해당 날짜 이벤트들, 날짜 정보
  const [popupData, setPopupData] = useState({
    visible: false,
    top: 0,
    left: 0,
    events: [],
    date: new Date(),
  });

  // CalendarContainer에 대한 ref (팝업 위치 계산용)
  const calendarContainerRef = useRef<HTMLDivElement>(null);

  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    // 사용자의 일정을 불러오는 함수
    const fetchEvents = async () => {
      try {
        const data = await showPlans();
        if (Array.isArray(data.calendar)) {
          setPlans(data.calendar);
  
          const newEvents: { [key: string]: EventItem[] } = {};
  
          data.calendar.forEach((event: any) => {
            // 날짜를 한국 시간으로 변환
            const startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);
            const startKST = new Date(startDate.getTime() + 9 * 60 * 60 * 1000);
            const endKST = new Date(endDate.getTime() + 9 * 60 * 60 * 1000);
  
            let currentDate = new Date(startKST);
  
            while (currentDate <= endKST) {
              const dateKey = currentDate.toISOString().split("T")[0];
              if (!newEvents[dateKey]) {
                newEvents[dateKey] = [];
              }
              // 이벤트 제목과 destination 정보를 저장
              newEvents[dateKey].push({
                title: event.title,
                destination: event.destination,
              });
              currentDate.setDate(currentDate.getDate() + 1);
            }
          });
  
          setEvents(newEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
  
    fetchEvents(); // 컴포넌트 마운트 시 실행
  }, []); // 컴포넌트 마운트 시 한번만 실행

  // 타일 내에서 클릭 이벤트 처리
  const handleTileClick = (e: React.MouseEvent<HTMLDivElement>, date: Date) => {
    e.stopPropagation();
    const dateKey = date.toISOString().split("T")[0];
    const dayEvents = events[dateKey];
    if (!dayEvents || dayEvents.length === 0) {
      return;
    }

    // 클릭한 타일의 DOM 위치 계산
    const tileRect = e.currentTarget.getBoundingClientRect();
    if (calendarContainerRef.current) {
      const containerRect =
        calendarContainerRef.current.getBoundingClientRect();
      const popupHeight = 120;
      const top = tileRect.top - containerRect.top - popupHeight - 5;
      const popupWidth = 150;
      const left =
        tileRect.left -
        containerRect.left +
        tileRect.width / 2 -
        popupWidth / 2;
    }
  };

  // 달력 타일에 이벤트 추가 (타일 내부에 이벤트 제목들을 표시)
  const renderTileContent = ({ date, view }: { date: Date; view: string }) => {
    const dateKey = date.toISOString().split("T")[0];
    const dayEvents = events[dateKey];

    // 월별 보기이고, 해당 날짜에 이벤트가 있을 경우
    if (view === "month" && dayEvents && dayEvents.length > 0) {
      return (
        // 클릭 시 타일의 위치를 받아 팝업을 띄우기 위한 onClick 핸들러 추가
        <div
          onClick={(e) => handleTileClick(e, date)}
          style={{ fontSize: "10px", color: "#000" }}
        >
          {dayEvents.map((event, index) => (
            <div key={index}>{event.title}</div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <CalendarContainer ref={calendarContainerRef}>
      <h1>캘린더</h1>
      <StyledCalendar
        //value={date}
        tileClassName={({ date }: { date: Date }) => {
          const dateKey = date.toISOString().split("T")[0];
          return events[dateKey] ? "event-day" : "";
        }}
        tileContent={renderTileContent}
      />

      {popupData.visible && (
        <Popup style={{ top: popupData.top, left: popupData.left }}>
          <button
            style={{
              marginTop: "15px",
              background: "#fff",
              border: "1px solid #ececec",
              borderRadius: "4px",
              padding: "5px 8px",
              width: "100%",
            }}
            className="popup-btn"
            onClick={() => setPopupData({ ...popupData, visible: false })}
          >
            닫기
          </button>
        </Popup>
      )}
    </CalendarContainer>
  );
};

export default Calendars;
