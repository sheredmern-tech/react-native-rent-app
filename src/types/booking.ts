export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type VisitType = 'in-person' | 'virtual';

export interface TimeSlot {
  time: string; // Format: "09:00", "11:00", etc.
  available: boolean;
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyImage: string;
  userId: string;
  userName: string;
  date: Date;
  timeSlot: string; // "09:00", "11:00", etc.
  visitType: VisitType;
  status: BookingStatus;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface BookingFormData {
  date: Date | null;
  timeSlot: string;
  visitType: VisitType;
  notes: string;
}

export type BookingFilterStatus = 'all' | BookingStatus;
