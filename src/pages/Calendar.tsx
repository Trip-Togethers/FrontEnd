import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<{ [key: string]: string[] }>({});

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
  };

  const handleAddEvent = (date: Date) => {
    const eventTitle = prompt('이벤트 제목을 입력하세요');
    if (eventTitle) {
      const dateKey = date.toISOString().split('T')[0]; // 날짜를 YYYY-MM-DD 형식으로 변환
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
    <div>
      <h1>캘린더</h1>
      <Calendar
        //onChange={handleDateChange}
        value={date}
        onClickDay={handleAddEvent}
        tileContent={renderTileContent}
      />
    </div>
  );
};

export default CalendarComponent;
