export interface CreateData {
    title: string,
    destination: string,
    startDate: Date,
    endDate: Date,
    image: string
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