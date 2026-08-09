import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  UserRole,
  Station,
  ActiveSession,
  Booking,
  RewardPoint,
  CustomerProfile,
  GameTitle,
  SnackItem,
  SimMode,
  NotificationDispatch,
} from '../types';
import {
  INITIAL_STATIONS,
  MOCK_CUSTOMER,
  INITIAL_REWARD_POINTS,
  INITIAL_GAMES,
  INITIAL_SNACKS,
  INITIAL_BOOKINGS,
} from '../data/initialData';
import { calculateActiveBalance, calculateBill } from '../utils/pricing';
import { supabaseService } from '../services/supabaseService';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  customer: CustomerProfile;
  stations: Station[];
  rewardPoints: RewardPoint[];
  bookings: Booking[];
  games: GameTitle[];
  snacks: SnackItem[];
  notifications: NotificationDispatch[];
  latestNotification: NotificationDispatch | null;
  activePointsBalance: number;
  
  // Actions
  loginUser: (data: { name: string; phone: string; email: string }) => void;
  logoutUser: () => void;
  clearLatestNotification: () => void;

  startStationSession: (params: {
    stationId: string;
    customerName: string;
    customerId: string;
    durationMinutes: number;
    simMode?: SimMode;
    controllersCount: number;
    extraPersonsCount: number;
    redeemedPoints: number;
  }) => void;
  
  endStationSession: (stationId: string) => void;
  pauseResumeSession: (stationId: string) => void;
  addSessionTime: (stationId: string, additionalMinutes: number) => void;
  
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
  issueRewardPoints: (customerId: string, points: number, description: string) => void;
  updateStationStatus: (stationId: string, status: Station['status']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('customer');
  const [customer, setCustomer] = useState<CustomerProfile>(() => {
    const saved = localStorage.getItem('egl_customer');
    return saved ? JSON.parse(saved) : { ...MOCK_CUSTOMER, isLoggedIn: true };
  });

  const [stations, setStations] = useState<Station[]>(() => {
    const saved = localStorage.getItem('egl_stations');
    return saved ? JSON.parse(saved) : INITIAL_STATIONS;
  });

  const [rewardPoints, setRewardPoints] = useState<RewardPoint[]>(() => {
    const saved = localStorage.getItem('egl_reward_points');
    return saved ? JSON.parse(saved) : INITIAL_REWARD_POINTS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('egl_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [notifications, setNotifications] = useState<NotificationDispatch[]>([]);
  const [latestNotification, setLatestNotification] = useState<NotificationDispatch | null>(null);

  const [games] = useState<GameTitle[]>(INITIAL_GAMES);
  const [snacks] = useState<SnackItem[]>(INITIAL_SNACKS);

  // Check point expiration on load and every minute
  useEffect(() => {
    const checkExpirations = () => {
      const now = new Date();
      setRewardPoints((prev) =>
        prev.map((pt) => {
          if (!pt.isExpired && new Date(pt.expiryDate) < now) {
            return { ...pt, isExpired: true };
          }
          return pt;
        })
      );
    };
    checkExpirations();
    const interval = setInterval(checkExpirations, 60000);
    return () => clearInterval(interval);
  }, []);

  const activePointsBalance = calculateActiveBalance(rewardPoints);

  useEffect(() => {
    setCustomer((prev) => ({
      ...prev,
      totalPointsBalance: activePointsBalance,
    }));
  }, [rewardPoints, activePointsBalance]);

  useEffect(() => {
    localStorage.setItem('egl_customer', JSON.stringify(customer));
    localStorage.setItem('egl_stations', JSON.stringify(stations));
    localStorage.setItem('egl_reward_points', JSON.stringify(rewardPoints));
    localStorage.setItem('egl_bookings', JSON.stringify(bookings));
  }, [customer, stations, rewardPoints, bookings]);

  // Session timer loop
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setStations((prevStations) =>
        prevStations.map((station) => {
          if (station.currentSession && !station.currentSession.isPaused) {
            if (now >= station.currentSession.endTime) {
              return {
                ...station,
                status: 'available',
                currentSession: undefined,
              };
            }
          }
          return station;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Action: Login User
  const loginUser = (data: { name: string; phone: string; email: string }) => {
    const newCustomer: CustomerProfile = {
      id: `CUST-${data.phone.slice(-4)}`,
      name: data.name,
      phone: data.phone,
      email: data.email,
      totalPointsBalance: activePointsBalance,
      qrCodeValue: `EGL-${data.phone.slice(-4)}`,
      isLoggedIn: true,
    };
    setCustomer(newCustomer);
    supabaseService.syncCustomerProfile(newCustomer);
  };

  // Action: Logout User
  const logoutUser = () => {
    setCustomer((prev) => ({ ...prev, isLoggedIn: false }));
  };

  const clearLatestNotification = () => {
    setLatestNotification(null);
  };

  // Action: Start Station Session (Enforces exclusivity lock)
  const startStationSession = ({
    stationId,
    customerName,
    customerId,
    durationMinutes,
    simMode = 'standard',
    controllersCount,
    extraPersonsCount,
    redeemedPoints,
  }: {
    stationId: string;
    customerName: string;
    customerId: string;
    durationMinutes: number;
    simMode?: SimMode;
    controllersCount: number;
    extraPersonsCount: number;
    redeemedPoints: number;
  }) => {
    const station = stations.find((s) => s.id === stationId);
    if (!station) return;

    if (station.status === 'in-use') {
      alert(`Station "${station.name}" is currently IN-USE! No other modes can be played on it until session completes.`);
      return;
    }

    const bill = calculateBill({
      stationType: station.type,
      simMode,
      durationMinutes,
      controllersCount,
      extraPersonsCount,
      redeemPoints: redeemedPoints,
    });

    const now = Date.now();
    const endTime = now + durationMinutes * 60 * 1000;

    const newSession: ActiveSession = {
      sessionId: `sess-${Date.now().toString().slice(-4)}`,
      customerName,
      customerId,
      stationId,
      stationType: station.type,
      simMode,
      controllersCount,
      extraPersonsCount,
      durationMinutes,
      startTime: now,
      endTime,
      totalAmount: bill.finalPayable,
      pointsEarned: bill.pointsEarned,
      redeemedPoints,
      isPaused: false,
    };

    if (redeemedPoints > 0) {
      let pointsToDeduct = redeemedPoints;
      setRewardPoints((prev) =>
        prev.map((pt) => {
          if (!pt.isRedeemed && !pt.isExpired && pointsToDeduct > 0) {
            if (pt.points <= pointsToDeduct) {
              pointsToDeduct -= pt.points;
              return { ...pt, isRedeemed: true };
            } else {
              const remaining = pt.points - pointsToDeduct;
              pointsToDeduct = 0;
              return { ...pt, points: remaining };
            }
          }
          return pt;
        })
      );
    }

    if (bill.pointsEarned > 0) {
      issueRewardPoints(
        customerId,
        bill.pointsEarned,
        `${durationMinutes} min ${station.name} Session`
      );
    }

    setStations((prev) =>
      prev.map((s) => (s.id === stationId ? { ...s, status: 'in-use', currentSession: newSession } : s))
    );
  };

  const endStationSession = (stationId: string) => {
    setStations((prev) =>
      prev.map((s) => (s.id === stationId ? { ...s, status: 'available', currentSession: undefined } : s))
    );
  };

  const pauseResumeSession = (stationId: string) => {
    setStations((prev) =>
      prev.map((s) => {
        if (s.id === stationId && s.currentSession) {
          const session = s.currentSession;
          const now = Date.now();
          if (session.isPaused) {
            const newEndTime = now + (session.pausedTimeRemaining || 0);
            return {
              ...s,
              currentSession: {
                ...session,
                isPaused: false,
                endTime: newEndTime,
                pausedTimeRemaining: undefined,
              },
            };
          } else {
            const remaining = Math.max(0, session.endTime - now);
            return {
              ...s,
              currentSession: {
                ...session,
                isPaused: true,
                pausedTimeRemaining: remaining,
              },
            };
          }
        }
        return s;
      })
    );
  };

  const addSessionTime = (stationId: string, additionalMinutes: number) => {
    setStations((prev) =>
      prev.map((s) => {
        if (s.id === stationId && s.currentSession) {
          const session = s.currentSession;
          const addedMs = additionalMinutes * 60 * 1000;
          return {
            ...s,
            currentSession: {
              ...session,
              durationMinutes: session.durationMinutes + additionalMinutes,
              endTime: session.endTime + addedMs,
            },
          };
        }
        return s;
      })
    );
  };

  // Action: Create Pre-Booking & Dispatch SMS / Email Notifications
  const createBooking = (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: Booking = {
      ...bookingData,
      id: bookingId,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);
    supabaseService.saveBooking(newBooking);

    // Generate SMS & Email Confirmation Dispatch
    const smsContent = `Escape Gaming Lounge: Booking ${bookingId} confirmed for ${bookingData.stationType.toUpperCase()} on ${bookingData.date} (${bookingData.timeSlot}). Total Paid: ₹${bookingData.totalCost}.`;
    const emailSubject = `Confirmation Ticket for Booking ${bookingId} - Escape Gaming Lounge`;
    const emailBody = `Hi ${bookingData.customerName},\n\nYour slot reservation ${bookingId} is confirmed!\nDate: ${bookingData.date}\nTime: ${bookingData.timeSlot}\nStation: ${bookingData.stationType.toUpperCase()}\nTotal: ₹${bookingData.totalCost}\n\nShow this ticket at the counter to claim your session.\n- Escape Gaming Lounge Team`;

    const notification: NotificationDispatch = {
      id: `notif-${Date.now()}`,
      bookingId,
      recipientPhone: bookingData.customerPhone,
      recipientEmail: bookingData.customerEmail,
      smsContent,
      emailSubject,
      emailBody,
      sentAt: new Date().toISOString(),
    };

    setNotifications((prev) => [notification, ...prev]);
    setLatestNotification(notification);
    supabaseService.saveNotification(notification);

    if (bookingData.redeemedPoints > 0) {
      let pointsToDeduct = bookingData.redeemedPoints;
      setRewardPoints((prev) =>
        prev.map((pt) => {
          if (!pt.isRedeemed && !pt.isExpired && pointsToDeduct > 0) {
            if (pt.points <= pointsToDeduct) {
              pointsToDeduct -= pt.points;
              return { ...pt, isRedeemed: true };
            } else {
              const remaining = pt.points - pointsToDeduct;
              pointsToDeduct = 0;
              return { ...pt, points: remaining };
            }
          }
          return pt;
        })
      );
    }
  };

  const issueRewardPoints = (customerId: string, points: number, description: string) => {
    const now = new Date();
    const expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const newPoint: RewardPoint = {
      id: `pt-${Date.now().toString().slice(-6)}`,
      customerId,
      points,
      earnedDate: now.toISOString(),
      expiryDate,
      isExpired: false,
      isRedeemed: false,
      description,
    };

    setRewardPoints((prev) => [newPoint, ...prev]);
  };

  const updateStationStatus = (stationId: string, status: Station['status']) => {
    setStations((prev) => prev.map((s) => (s.id === stationId ? { ...s, status } : s)));
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        customer,
        stations,
        rewardPoints,
        bookings,
        games,
        snacks,
        notifications,
        latestNotification,
        activePointsBalance,
        loginUser,
        logoutUser,
        clearLatestNotification,
        startStationSession,
        endStationSession,
        pauseResumeSession,
        addSessionTime,
        createBooking,
        issueRewardPoints,
        updateStationStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
