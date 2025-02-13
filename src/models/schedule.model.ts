export interface CreateData {
    title: string,
    destination: string,
    startDate: Date,
    endDate: Date,
    image: File | null
}

export interface Schedules {
    id: number;
    title: string;
    startDate: Date;
    endDate: Date;
    destination: string;
    guests: string[];
    photoUrl: string;
  }

  export interface EditData {
    title?: string,
    destination?: string,
    startDate?: Date,
    endDate?: Date,
    photoUrl?: string;
}

export interface PostData {
  title: string;
  content: string;
  photoUrl: string;  // 이미지 객체 배열로 변경 (파일과 URL 포함)
}