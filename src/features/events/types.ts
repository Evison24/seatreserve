export type Event = {
  id: string;
  title: string;
  date: string;
  location: string; // venue
};

export type Seat = {
  id: string;
  row: string;
  number: number;
  isAvailable: boolean;
};
