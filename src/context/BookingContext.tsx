import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Booking, BookingStatus, VisitType, BookingFilterStatus, TimeSlot } from '../types';
import { mockProperties } from '../data';

interface BookingContextType {
  bookings: Booking[];
  getBookingsByUser: (userId: string) => Booking[];
  getUpcomingBookings: (userId: string) => Booking[];
  getPastBookings: (userId: string) => Booking[];
  getBookingById: (bookingId: string) => Booking | undefined;
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
  updateBooking: (bookingId: string, data: Partial<Booking>) => void;
  cancelBooking: (bookingId: string) => void;
  canCancelBooking: (booking: Booking) => boolean;
  hasBookingOnDate: (propertyId: string, date: Date) => boolean;
  getAvailableTimeSlots: (date: Date) => TimeSlot[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

interface BookingProviderProps {
  children: ReactNode;
}

// Time slots: 09:00-18:00 (every 2 hours)
const TIME_SLOTS = ['09:00', '11:00', '13:00', '14:00', '16:00', '18:00'];

// Indonesian property titles for mock data
const indonesianPropertyNames = [
  'Apartemen Menteng Park',
  'Rumah Kebayoran Baru',
  'Villa Bali Seminyak',
  'Apartemen Sudirman Suites',
  'Rumah Pondok Indah',
  'Villa Ubud Valley',
  'Apartemen Senopati Residence',
  'Rumah BSD City',
  'Villa Canggu Beach',
  'Apartemen Kemang Village',
];

// Generate mock bookings
const generateMockBookings = (): Booking[] => {
  const bookings: Booking[] = [];
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  // Status distribution: 60% confirmed, 30% pending, 10% cancelled
  const statusDistribution: BookingStatus[] = [
    ...Array(6).fill('confirmed' as BookingStatus),
    ...Array(3).fill('pending' as BookingStatus),
    ...Array(1).fill('cancelled' as BookingStatus),
  ];

  // Visit type: 70% in-person, 30% virtual
  const visitTypeDistribution: VisitType[] = [
    ...Array(7).fill('in-person' as VisitType),
    ...Array(3).fill('virtual' as VisitType),
  ];

  // Create 12 bookings (good middle ground)
  for (let i = 0; i < 12; i++) {
    const property = mockProperties[i % mockProperties.length];
    const status = statusDistribution[i % statusDistribution.length];
    const visitType = visitTypeDistribution[i % visitTypeDistribution.length];
    const timeSlot = TIME_SLOTS[Math.floor(Math.random() * TIME_SLOTS.length)];

    // Mix of upcoming (next 2 weeks) and past (last month) bookings
    let bookingDate: Date;
    if (i < 7) {
      // Upcoming bookings (next 2 weeks)
      const daysAhead = Math.floor(Math.random() * 14) + 1;
      bookingDate = new Date(now + (daysAhead * oneDayMs));
    } else {
      // Past bookings (last month)
      const daysAgo = Math.floor(Math.random() * 30) + 1;
      bookingDate = new Date(now - (daysAgo * oneDayMs));
    }

    const createdDate = new Date(bookingDate.getTime() - (7 * oneDayMs));

    const notes = [
      'Tolong bisa jelaskan tentang parkir mobil?',
      'Saya ingin lihat kamar mandi dan dapur',
      'Apakah bisa kunjungan sore hari?',
      'Tertarik untuk sewa jangka panjang',
      'Mau tanya tentang fasilitas sekitar',
      '',
      '',
      'Bawa keluarga untuk lihat properti',
    ][i % 8];

    bookings.push({
      id: `booking-${i + 1}`,
      propertyId: property.id,
      propertyTitle: indonesianPropertyNames[i % indonesianPropertyNames.length],
      propertyLocation: property.location,
      propertyImage: property.imageUrls[0],
      userId: '1', // Current user
      userName: 'Budi Santoso',
      date: bookingDate,
      timeSlot,
      visitType,
      status: i < 7 ? status : 'completed', // Past bookings are completed
      notes: notes || undefined,
      createdAt: createdDate,
    });
  }

  return bookings.sort((a, b) => b.date.getTime() - a.date.getTime());
};

const initialBookings = generateMockBookings();

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const getBookingsByUser = (userId: string): Booking[] => {
    return bookings.filter((booking) => booking.userId === userId);
  };

  const getUpcomingBookings = (userId: string): Booking[] => {
    const now = new Date();
    return getBookingsByUser(userId).filter(
      (booking) =>
        booking.date >= now &&
        booking.status !== 'cancelled' &&
        booking.status !== 'completed'
    );
  };

  const getPastBookings = (userId: string): Booking[] => {
    const now = new Date();
    return getBookingsByUser(userId).filter(
      (booking) =>
        booking.date < now ||
        booking.status === 'cancelled' ||
        booking.status === 'completed'
    );
  };

  const getBookingById = (bookingId: string): Booking | undefined => {
    return bookings.find((booking) => booking.id === bookingId);
  };

  const createBooking = (
    bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>
  ) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}`,
      status: 'pending',
      createdAt: new Date(),
    };

    setBookings((prev) => {
      console.log('Created booking:', newBooking);
      return [newBooking, ...prev];
    });
  };

  const updateBooking = (bookingId: string, data: Partial<Booking>) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? { ...booking, ...data, updatedAt: new Date() }
          : booking
      )
    );
    console.log('Updated booking:', bookingId);
  };

  const cancelBooking = (bookingId: string) => {
    updateBooking(bookingId, { status: 'cancelled' });
    console.log('Cancelled booking:', bookingId);
  };

  const canCancelBooking = (booking: Booking): boolean => {
    // Can cancel if:
    // 1. Booking is not already cancelled or completed
    // 2. Booking is at least 24 hours away
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return false;
    }

    const now = new Date();
    const bookingDate = new Date(booking.date);
    const hoursUntilBooking =
      (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    return hoursUntilBooking >= 24;
  };

  const hasBookingOnDate = (propertyId: string, date: Date): boolean => {
    const dateStr = date.toDateString();
    return bookings.some(
      (booking) =>
        booking.propertyId === propertyId &&
        booking.date.toDateString() === dateStr &&
        booking.status !== 'cancelled'
    );
  };

  const getAvailableTimeSlots = (date: Date): TimeSlot[] => {
    const dateStr = date.toDateString();
    const bookedSlots = bookings
      .filter(
        (booking) =>
          booking.date.toDateString() === dateStr &&
          booking.status !== 'cancelled'
      )
      .map((booking) => booking.timeSlot);

    return TIME_SLOTS.map((time) => ({
      time,
      available: !bookedSlots.includes(time),
    }));
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        getBookingsByUser,
        getUpcomingBookings,
        getPastBookings,
        getBookingById,
        createBooking,
        updateBooking,
        cancelBooking,
        canCancelBooking,
        hasBookingOnDate,
        getAvailableTimeSlots,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};
