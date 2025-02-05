import { useState, useEffect } from 'react';
import styled from "styled-components";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Styled Calendar with styled-components
const StyledCalendar = styled(Calendar).attrs((props) => ({
  ...props, // Ensure all props are passed correctly
}))`
  width: 100% !important;
  height: 100%;
  max-width: 100% !important;
  background: white !important;
  border: 1px solid #ddd !important;
  border-radius: 8px !important;
  padding: 10px !important;
  font-family: 'Arial', sans-serif !important;

  /* 네비게이션 스타일 */
  // .react-calendar__navigation {
  //   display: flex !important;
  //   justify-content: space-between !important;
  //   margin-bottom: 10px !important;
  // }

  // .react-calendar__navigation button {
  //   background: #007bff !important;
  //   color: white !important;
  //   border: none !important;
  //   padding: 5px 10px !important;
  //   border-radius: 5px !important;
  //   cursor: pointer !important;
  // }

  // .react-calendar__navigation button:hover {
  //   background: #0056b3 !important;
  // }

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

  /* 오늘 날짜 */
  // .react-calendar__tile--now {
    // background: #ffcc00 !important;
    // border-radius: 50% !important;
  // }

  /* 이벤트가 있는 날짜 스타일 */
  .event-day div div {
    // position: relative !important;
    border-radius: 4px;
    background: #63C647;
    padding: 2px 5px;
    color:rgb(0, 0, 0);
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

const Calendars = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<{ [key: string]: string[] }>({});

  // 서버에서 데이터를 불러와서 events 상태 업데이트
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/calendar`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const data = await response.json();
        console.log('Fetched data:', data);

        const calendarData = data.calendar;

        if (!Array.isArray(calendarData)) {
          console.error('Expected an array but got:', calendarData);
          return;
        }

        const newEvents: { [key: string]: string[] } = {};

        calendarData.forEach((event: any) => {
          // 날짜를 한국 시간으로 변환
          const startDate = new Date(event.startDate);
          const endDate = new Date(event.endDate);

          const startKST = new Date(startDate.getTime() + 9 * 60 * 60 * 1000);
          const endKST = new Date(endDate.getTime() + 9 * 60 * 60 * 1000);

          let currentDate = new Date(startKST);

          while (currentDate <= endKST) {
            const dateKey = currentDate.toISOString().split('T')[0];

            if (!newEvents[dateKey]) {
              newEvents[dateKey] = [];
            }

            newEvents[dateKey].push(event.title);
            currentDate.setDate(currentDate.getDate() + 1);
          }
        });

        setEvents(newEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  // 날짜 클릭 시 이벤트 추가
  const handleAddEvent = (date: Date) => {
    const eventTitle = prompt('이벤트 제목을 입력하세요');
    if (eventTitle) {
      const dateKey = date.toISOString().split('T')[0];

      setEvents((prevEvents) => {
        const updatedEvents = { ...prevEvents };
        if (!updatedEvents[dateKey]) {
          updatedEvents[dateKey] = [];
        }
        updatedEvents[dateKey].push(eventTitle);
        return updatedEvents;
      });
    }
  };

  // 특정 날짜에 이벤트가 있는지 확인하고 스타일 적용
  const getTileClassName = ({ date }: { date: Date }) => {
    const dateKey = date.toISOString().split('T')[0];
    return events[dateKey] ? 'event-day' : '';
  };

  // 달력 타일에 이벤트 추가
  const renderTileContent = ({ date, view }: any) => {
    const dateKey = date.toISOString().split('T')[0];
    const dayEvents = events[dateKey];

    if (view === 'month' && dayEvents && dayEvents.length > 0) {
      return (
        <div style={{ fontSize: '10px', color: '#000' }}>
          {dayEvents.map((event, index) => (
            <div key={index}>{event}</div>
          ))}
        </div>
      );
    }

    return null;
  };
  

  return (
    <CalendarContainer>
      <h1>캘린더</h1>
      <StyledCalendar
        value={date}
        onClickDay={handleAddEvent}
        tileClassName={getTileClassName} // 이벤트 날짜 스타일 적용
        tileContent={renderTileContent} // 타일 내부에 이벤트 표시
      />
    </CalendarContainer>
  );
};

const CalendarContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9; /* 배경색 */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
`;

export default Calendars;
