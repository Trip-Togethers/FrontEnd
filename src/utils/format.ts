// formatDate.ts
export const formatDate = (date: Date): string => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      // 날짜가 유효하지 않으면 기본 날짜를 반환
      return 'Invalid Date';
    }
    return parsedDate.toLocaleDateString();
  };
  