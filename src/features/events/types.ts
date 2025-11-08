export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
}

export interface Seat {
  id: string;
  row: number;
  number: number;
  isAvailable: boolean;
}
