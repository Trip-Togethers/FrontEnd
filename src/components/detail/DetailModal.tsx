import { useState, useEffect } from "react";
import styled from "styled-components";
import { theme } from "@styles/theme";
import Button from "@components/common/Button";
import { EditData, Schedules } from "models/schedule.model";

// 1-1) 날짜 선택기(DatePicker) Props
interface DatePickerProps {
  label?: string;
  value?: Date;
  onChange?: (date: Date) => void;
  error?: string;
  minDate?: Date;
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (plan: any) => void;
  scheduleData: any;
  selectedDate?: Date; // 선택한 날짜를 받을 수 있도록 추가
  initialData?: Schedules | null; // initialData 속성 추가
  planData?: EditData;
  isEditMode: boolean;
  selectedScheduleIndex?: number;
}

// 1-3 할 일(Todo) 아이템 인터페이스
interface TodoItem {
  content: string;
  time: string;
}

// 2) 날짜 선택기(DatePicker) 컴포넌트
const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  error,
  minDate,
}) => {
  const [selectedDate, setSelectedDate] = useState(value || new Date());
  const currentYear = new Date().getFullYear();

  // 연도 선택 (현재 연도 -2 ~ 현재 연도 +2)
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  // 월 선택 (영어로 월 표시)
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: new Date(2000, i).toLocaleString("default", { month: "long" }),
  }));

  // 해당 연도와 월의 일수 가져오기
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // 연도, 월, 일 변경 핸들러
  const handleChange = (type: "year" | "month" | "day", val: number) => {
    const newDate = new Date(selectedDate);
    if (type === "year") newDate.setFullYear(val);
    if (type === "month") newDate.setMonth(val);
    if (type === "day") newDate.setDate(val);

    // 최소 날짜(minDate) 검사
    if (!minDate || newDate >= minDate) {
      setSelectedDate(newDate);
      onChange?.(newDate);
    }
  };

  return (
    <DatePickerContainer>
      {label && <Label>{label}</Label>}
      <SelectGroup>
        {/* 연도 선택 */}
        <Select
          value={selectedDate.getFullYear()}
          onChange={(e: { target: { value: any } }) =>
            handleChange("year", Number(e.target.value))
          }
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}년
            </option>
          ))}
        </Select>
        {/* 월 선택 */}
        <Select
          value={selectedDate.getMonth()}
          onChange={(e: { target: { value: any } }) =>
            handleChange("month", Number(e.target.value))
          }
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </Select>
        {/* 일 선택 */}
        <Select
          value={selectedDate.getDate()}
          onChange={(e: { target: { value: any } }) =>
            handleChange("day", Number(e.target.value))
          }
        >
          {Array.from(
            {
              length: getDaysInMonth(
                selectedDate.getFullYear(),
                selectedDate.getMonth()
              ),
            },
            (_, i) => i + 1
          ).map((day) => (
            <option key={day} value={day}>
              {day}일
            </option>
          ))}
        </Select>
      </SelectGroup>
      {error && <ErrorText>{error}</ErrorText>}
    </DatePickerContainer>
  );
};

// 3) 시간 선택기(TimePicker) 컴포넌트
const TimePicker: React.FC<{
  value?: string;
  onChange?: (time: string) => void;
}> = ({ value = "09:00 AM", onChange }) => {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
  const periods = ["AM", "PM"];

  // 시간, 분, 기간 분리
  const [selectedHour, selectedMinute, selectedPeriod] = value.split(/:|\s/);

  const handleTimeChange = (
    type: "hour" | "minute" | "period",
    newValue: string
  ) => {
    const hour = type === "hour" ? newValue : selectedHour;
    const minute = type === "minute" ? newValue : selectedMinute;
    const period = type === "period" ? newValue : selectedPeriod;
    const newTime = `${hour}:${minute} ${period}`;
    onChange?.(newTime);
  };

  return (
    <DateTimeSelect>
      <div className="select-group">
        <select
          value={selectedPeriod}
          onChange={(e) => handleTimeChange("period", e.target.value)}
        >
          {periods.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={selectedHour}
          onChange={(e) => handleTimeChange("hour", e.target.value)}
        >
          {hours.map((hour) => (
            <option key={hour} value={hour.toString().padStart(2, "0")}>
              {hour}
            </option>
          ))}
        </select>

        <select
          value={selectedMinute}
          onChange={(e) => handleTimeChange("minute", e.target.value)}
        >
          {minutes.map((minute) => (
            <option key={minute} value={minute.toString().padStart(2, "0")}>
              {minute.toString().padStart(2, "0")}
            </option>
          ))}
        </select>
      </div>
    </DateTimeSelect>
  );
};

const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  scheduleData,
  isEditMode,
  selectedScheduleIndex
}) => {
  let selectedSchedule;
  
  // 수정 모드에서만 selectedSchedule을 설정
  if (isEditMode && selectedScheduleIndex) {
    selectedSchedule = scheduleData?.currentDate.find(
      (schedule: { id: number }) => schedule.id === selectedScheduleIndex
    );
  }

  // selectedSchedule이 없으면 기본값 설정
  const [date, setDate] = useState(
    selectedSchedule ? new Date(selectedSchedule.scheduleDate) : new Date()
  );
  const [task, setTask] = useState(selectedSchedule?.scheduleContent || "");
  const [time, setTime] = useState(selectedSchedule?.scheduleTime || "09:00 AM");

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 날짜 형식 확인
    const formattedDate = date instanceof Date ? date : new Date(date);
    const formattedDateString = formattedDate.toISOString().split("T")[0]; // 'YYYY-MM-DD' 형식으로 변환

    // 시간 포맷 변환 (AM/PM을 제외하고 24시간 형식으로 변환)
    const formattedTime = time ? time.slice(0, 5) : ""; // "HH:mm" 형식으로 변환

    // 전송할 데이터 객체 생성
    const newSchedule = {
      scheduleDate: formattedDateString, // '2025-01-01' 형식
      scheduleTime: formattedTime, // '09:00' 형식
      scheduleContent: task, // '잠자기' 내용
    };

    console.log("날짜 확인:", newSchedule); // 로그 추가: 날짜 확인

    try {
      await onSubmit?.(newSchedule); // 부모 컴포넌트의 onSubmit 호출
      console.log("새로운 세부 일정이 생성되었습니다:", newSchedule);
      onClose?.();
    } catch (error) {
      console.error("플랜 생성 중 오류 발생:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper>
      <div className="modal">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <form
          onSubmit={handleSubmit}
        >
          <div className="field">
            <label>날짜</label>
            <DatePicker value={date} onChange={setDate} />
          </div>
          <div className="field">
            <label>시간 선택</label>
            <TimePicker value={time} onChange={setTime} />
          </div>
          <div className="field">
            <input
              placeholder="일정을 입력해주세요"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
          </div>
          <Button scheme="primary" type="submit">
            {isEditMode ? "수정하기" : "생성하기"}
          </Button>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default DetailModal;

// 5) 스타일드 컴포넌트

const ScheduleList = styled.ul`
  display: flex;
  flex-direction: column; /* 항목들을 세로로 나열 */
  align-items: center; /* 수평 가운데 정렬 */
  padding: 0;
  margin: 0;
  list-style: none;
`;

const ScheduleItem = styled.li`
  margin: 5px 0; /* 항목 간 간격 */
  background-color: #f4f4f4;
  padding: 10px;
  border-radius: 5px;
  width: 200px; /* 고정 크기 설정 */
  text-align: center; /* 항목 내용 가운데 정렬 */
`;

// 5-1) 모달 래퍼
const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  ul {
    list-style-type: none;
  }

  .modal {
    background: ${({ theme }) => theme.color.primary_white};
    padding: 2rem;
    border-radius: ${({ theme }) => theme.borderRadius.default};
    width: 40%;
    height: 70%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow-y: auto;

    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-size: 1.5rem;
      background: none;
      border: none;
      cursor: pointer;
      color: ${({ theme }) => theme.color.primary_black};

      &:hover {
        color: ${({ theme }) => theme.color.primary_green};
      }
    }

    form {
      width: 90%;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: ${({ theme }) => theme.font.family.default};
      margin-top: 2rem;

      .field {
        width: 100%;
        margin-bottom: 1rem;

        label {
          display: block;
          margin-bottom: 0.125rem;
          color: ${({ theme }) => theme.color.primary_black};
          font-size: 1.5rem;
        }

        input {
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 0;
          border-bottom: 3px solid
            ${({ theme }) => theme.color.input_background};
          background-color: ${({ theme }) => theme.color.primary_white};
          color: ${({ theme }) => theme.color.primary_black};
          font-family: ${({ theme }) => theme.font.family.contents};
          font-size: 1.25rem;
          transition: all 0.2s ease;

          &:focus {
            outline: none;
            background-color: ${({ theme }) => theme.color.primary_white};
          }

          &:hover {
            background-color: ${({ theme }) => theme.color.primary_white};
          }
        }
      }

      .submit-btn {
        margin-top: 1rem;
        display: flex;
        justify-content: center;
        width: 100%;
      }
    }
  }
`;

//* 5-3) 날짜/시간 선택 컨테이너
const DateTimeSelect = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  font-family: ${({ theme }) => theme.font.family.contents};

  .select-group {
    display: flex;
    gap: 0.5rem;

    select {
      flex: 1;
      padding: 0.5rem;
      border: none;
      border-radius: none;
      border-bottom: 3px solid ${({ theme }) => theme.color.input_background};
      font-size: 1.25rem;
      cursor: pointer;
      background-color: ${({ theme }) => theme.color.card_background};
      color: ${theme.color.input_text};
      font-family: ${({ theme }) => theme.font.family.contents};

      &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.color.primary_white};
      }

      option {
        background-color: ${({ theme }) => theme.color.primary_white};
        color: ${({ theme }) => theme.color.primary_black};
        padding: 0.5rem;
      }
    }
  }
`;

//* 5-4) 투두 리스트 컨테이너
const TodoSection = styled.div`
  .list {
    margin-top: 1rem;
    max-height: 200px;
    overflow-y: auto;
    font-family: ${({ theme }) => theme.font.family.contents};
  }

  .item {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    border-bottom: 1px solid ${({ theme }) => theme.color.name_gray};

    .time {
      min-width: 100px;
      color: ${({ theme }) => theme.color.name_gray};
      font-weight: ${({ theme }) => theme.font.weight.bold};
    }

    .content {
      margin-left: 1rem;
      color: ${theme.color.name_gray};
    }
  }
`;

//* 5-5) DatePicker 스타일
const DatePickerContainer = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  font-family: ${({ theme }) => theme.font.family.contents};
`;

const Label = styled.label`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  display: block;
  color: ${({ theme }) => theme.color.primary_black};
  font-weight: ${({ theme }) => theme.font.weight.bold};
`;

const SelectGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  border: none;
`;

const Select = styled.select`
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 0;
  border-bottom: 3px solid ${({ theme }) => theme.color.input_background};
  font-size: 1.25rem;
  cursor: pointer;
  background-color: ${theme.color.primary_white};
  color: ${theme.color.input_text};
  font-family: ${theme.font.family.contents};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.color.input_background};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.color.primary_green};
    border-radius: 10px;
    border: 2px solid ${theme.color.input_background};
  }
`;

const ErrorText = styled.p`
  color: ${theme.color.primary_red};
  font-size: 1.5rem;
  margin-top: 0.25rem;
  width: 100%;
  text-align: left;
  font-family: ${theme.font.family.contents};
`;
