'use client';

import { createContext, useContext, useState } from 'react';
import { Seat } from '@/features/events/types';

interface BookingContextType {
  selectedSeats: Seat[];
  setSelectedSeats: (seats: Seat[]) => void;
  clearBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  function clearBooking() {
    setSelectedSeats([]);
  }

  return (
    <BookingContext.Provider value={{ selectedSeats, setSelectedSeats, clearBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within a BookingProvider');
  return context;
}
