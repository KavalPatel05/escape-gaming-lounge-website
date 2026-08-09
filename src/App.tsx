import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CustomerView } from './views/CustomerView';
import { StaffView } from './views/StaffView';
import { AdminView } from './views/AdminView';
import { BookingModal } from './components/BookingModal';
import { AuthModal } from './components/AuthModal';
import { NotificationToast } from './components/NotificationToast';
import type { StationType, SimMode } from './types';

const MainContent: React.FC = () => {
  const { role } = useApp();
  const [activeSection, setActiveSection] = useState('stations');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const [bookingParams, setBookingParams] = useState<{
    stationType?: StationType;
    simMode?: SimMode;
    durationMinutes?: number;
  }>({});

  const handleOpenBooking = (params?: { stationType?: StationType; simMode?: SimMode; durationMinutes?: number }) => {
    if (params) {
      setBookingParams(params);
    }
    setIsBookingOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenAuth={() => setIsAuthOpen(true)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main style={{ flex: 1 }}>
        {role === 'customer' && (
          <CustomerView
            onOpenBooking={handleOpenBooking}
            activeSection={activeSection}
          />
        )}

        {role === 'staff' && <StaffView />}

        {role === 'admin' && <AdminView />}
      </main>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialStationType={bookingParams.stationType || 'ps5'}
        initialSimMode={bookingParams.simMode || 'standard'}
        initialDuration={bookingParams.durationMinutes || 60}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <NotificationToast />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
