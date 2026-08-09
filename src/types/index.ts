export type UserRole = 'customer' | 'staff' | 'admin';

export type StationType = 'ps5' | 'simracing' | 'vr';

export type SimMode = 'standard' | 'immersive' | 'ps5-mode';

export interface Station {
  id: string;
  name: string;
  type: StationType;
  description: string;
  image: string;
  specs: string[];
  status: 'available' | 'in-use' | 'maintenance';
  currentSession?: ActiveSession;
}

export interface ActiveSession {
  sessionId: string;
  customerName: string;
  customerId: string;
  stationId: string;
  stationType: StationType;
  simMode?: SimMode;
  controllersCount: number; // 1 to 4 for PS5
  extraPersonsCount: number; // ₹30 per extra person
  durationMinutes: number; // 30, 60, 120, etc.
  startTime: number; // Epoch timestamp
  endTime: number; // Epoch timestamp
  totalAmount: number;
  pointsEarned: number;
  redeemedPoints: number;
  isPaused: boolean;
  pausedTimeRemaining?: number;
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerId: string;
  stationId: string;
  stationType: StationType;
  simMode?: SimMode;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "14:00 - 15:00"
  durationMinutes: number;
  controllersCount: number;
  extraPersonsCount: number;
  totalCost: number;
  redeemedPoints: number;
  isRewardBooking: boolean;
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface RewardPoint {
  id: string;
  customerId: string;
  points: number;
  earnedDate: string; // ISO string
  expiryDate: string; // 30 days from earnedDate
  isExpired: boolean;
  isRedeemed: boolean;
  sourceSessionId?: string;
  description: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalPointsBalance: number;
  qrCodeValue: string;
  isLoggedIn?: boolean;
}

export interface NotificationDispatch {
  id: string;
  bookingId: string;
  recipientPhone: string;
  recipientEmail: string;
  smsContent: string;
  emailSubject: string;
  emailBody: string;
  sentAt: string;
}

export interface GameTitle {
  id: string;
  name: string;
  genre: string;
  stationType: StationType;
  rating: string;
  image: string;
  isPopular?: boolean;
}

export interface SnackItem {
  id: string;
  name: string;
  category: 'beverages' | 'snacks' | 'combos';
  price: number;
  image: string;
  isHot?: boolean;
}

export interface BillBreakdown {
  basePrice: number;
  extraPersonFee: number;
  totalPrice: number;
  pointsEarned: number;
  discountApplied: number;
  finalPayable: number;
  pointsRequiredForRedeem?: number;
}
