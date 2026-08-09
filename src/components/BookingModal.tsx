import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { StationType, SimMode } from '../types';
import { calculateBill, isWeekdayMonToFri, formatINR } from '../utils/pricing';
import { X, Calendar, Clock, Award, CheckCircle, AlertTriangle, Smartphone, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStationType?: StationType;
  initialSimMode?: SimMode;
  initialDuration?: number;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialStationType = 'ps5',
  initialSimMode = 'standard',
  initialDuration = 60,
}) => {
  const { customer, activePointsBalance, createBooking } = useApp();

  const [customerName, setCustomerName] = useState(customer.name);
  const [customerPhone, setCustomerPhone] = useState(customer.phone);
  const [customerEmail, setCustomerEmail] = useState(customer.email || 'gamer@escapegaming.com');
  const [stationType, setStationType] = useState<StationType>(initialStationType);
  const [simMode] = useState<SimMode>(initialSimMode);
  const [durationMinutes] = useState<number>(initialDuration);
  const [controllersCount, setControllersCount] = useState<number>(2);
  const [extraPersonsCount, setExtraPersonsCount] = useState<number>(0);
  
  const todayStr = new Date().toISOString().split('T')[0];
  const [bookingDate, setBookingDate] = useState<string>(todayStr);
  const [timeSlot, setTimeSlot] = useState<string>('15:00 - 16:00');
  
  const [redeemPoints, setRedeemPoints] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState('');

  if (!isOpen) return null;

  const isWeekday = isWeekdayMonToFri(bookingDate);

  const bill = calculateBill({
    stationType,
    simMode,
    durationMinutes,
    controllersCount,
    extraPersonsCount,
    redeemPoints,
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (redeemPoints > 0 && !isWeekday) {
      alert('Reward point redemptions are valid ONLY Monday to Friday!');
      return;
    }

    if (redeemPoints > activePointsBalance) {
      alert(`You only have ${activePointsBalance} active points!`);
      return;
    }

    const stationIdMap: Record<StationType, string> = {
      ps5: 'ps5-1',
      simracing: 'sim-1',
      vr: 'vr-1',
    };

    createBooking({
      customerName,
      customerPhone,
      customerEmail,
      customerId: customer.id,
      stationId: stationIdMap[stationType],
      stationType,
      simMode,
      date: bookingDate,
      timeSlot,
      durationMinutes,
      controllersCount,
      extraPersonsCount,
      totalCost: bill.finalPayable,
      redeemedPoints: redeemPoints,
      isRewardBooking: redeemPoints > 0,
    });

    setCreatedBookingId(`BK-${Math.floor(1000 + Math.random() * 9000)}`);
    setIsSuccess(true);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        {!isSuccess ? (
          <div>
            <h3 className="font-cyber" style={{ fontSize: '1.3rem', color: '#FFF', marginBottom: '4px' }}>
              Reserve Your Gaming Station
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '20px' }}>
              Instant SMS & Email booking confirmation will be sent upon locking slot.
            </p>

            <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Gamer Name:</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Mobile Phone Number:</label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Email Address:</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {(['ps5', 'simracing', 'vr'] as StationType[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStationType(st)}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: stationType === st ? '1px solid #06B6D4' : '1px solid rgba(255,255,255,0.1)',
                      background: stationType === st ? 'rgba(6, 182, 212, 0.2)' : '#0F172A',
                      color: '#FFF',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                    }}
                  >
                    {st === 'simracing' ? 'Sim / Immersive' : st}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                    <Calendar size={14} /> Date:
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                    <Clock size={14} /> Time Slot:
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                  >
                    <option value="12:00 - 13:00">12:00 PM - 01:00 PM</option>
                    <option value="13:00 - 14:00">01:00 PM - 02:00 PM</option>
                    <option value="14:00 - 15:00">02:00 PM - 03:00 PM</option>
                    <option value="15:00 - 16:00">03:00 PM - 04:00 PM</option>
                    <option value="16:00 - 17:00">04:00 PM - 05:00 PM</option>
                    <option value="17:00 - 18:00">05:00 PM - 06:00 PM</option>
                    <option value="18:00 - 19:00">06:00 PM - 07:00 PM</option>
                    <option value="19:00 - 20:00">07:00 PM - 08:00 PM</option>
                  </select>
                </div>
              </div>

              {stationType === 'ps5' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Controllers:</label>
                    <select
                      value={controllersCount}
                      onChange={(e) => setControllersCount(Number(e.target.value))}
                      style={{ width: '100%', padding: '10px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                    >
                      <option value={2}>1 or 2 Controllers (₹100/hr)</option>
                      <option value={4}>3 or 4 Controllers (₹170/hr)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Extra Persons (+₹30/ea):</label>
                    <input
                      type="number"
                      min={0}
                      max={5}
                      value={extraPersonsCount}
                      onChange={(e) => setExtraPersonsCount(Number(e.target.value))}
                      style={{ width: '100%', padding: '10px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              )}

              <div style={{ background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '12px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#C084FC', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={16} /> Redeem Reward Points
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Active Points: <strong>{activePointsBalance}</strong></span>
                </div>

                {!isWeekday && (
                  <div style={{ fontSize: '0.75rem', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <AlertTriangle size={14} /> Selected date is Weekend. Reward points are valid <strong>Mon-Fri ONLY</strong>.
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setRedeemPoints(0)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '6px',
                      border: redeemPoints === 0 ? '1px solid #8B5CF6' : '1px solid transparent',
                      background: redeemPoints === 0 ? 'rgba(139,92,246,0.3)' : '#0F172A',
                      color: '#FFF',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                  >
                    No Redeem
                  </button>

                  <button
                    type="button"
                    disabled={!isWeekday || activePointsBalance < 10}
                    onClick={() => setRedeemPoints(10)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '6px',
                      border: redeemPoints === 10 ? '1px solid #8B5CF6' : '1px solid transparent',
                      background: redeemPoints === 10 ? 'rgba(139,92,246,0.3)' : '#0F172A',
                      color: (!isWeekday || activePointsBalance < 10) ? '#6B7280' : '#FFF',
                      fontSize: '0.75rem',
                      cursor: (!isWeekday || activePointsBalance < 10) ? 'not-allowed' : 'pointer',
                    }}
                  >
                    10 Pts (Free 1-Hr 2P)
                  </button>

                  <button
                    type="button"
                    disabled={!isWeekday || activePointsBalance < 20}
                    onClick={() => setRedeemPoints(20)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '6px',
                      border: redeemPoints === 20 ? '1px solid #8B5CF6' : '1px solid transparent',
                      background: redeemPoints === 20 ? 'rgba(139,92,246,0.3)' : '#0F172A',
                      color: (!isWeekday || activePointsBalance < 20) ? '#6B7280' : '#FFF',
                      fontSize: '0.75rem',
                      cursor: (!isWeekday || activePointsBalance < 20) ? 'not-allowed' : 'pointer',
                    }}
                  >
                    20 Pts (Free 1-Hr 4P)
                  </button>
                </div>
              </div>

              <div style={{ background: '#0F172A', padding: '14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Total Amount Due:</div>
                  <div className="font-cyber" style={{ fontSize: '1.4rem', color: '#06B6D4' }}>{formatINR(bill.finalPayable)}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#10B981' }}>
                  +{bill.pointsEarned} Pts Earned
                </div>
              </div>

              <button type="submit" className="btn-neon-cyan" style={{ justifyContent: 'center', width: '100%' }}>
                Confirm & Send Confirmation
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
            }}>
              <CheckCircle size={36} />
            </div>

            <h3 className="font-cyber" style={{ fontSize: '1.4rem', color: '#FFF', marginBottom: '8px' }}>
              Booking Confirmed!
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#9CA3AF', marginBottom: '16px' }}>
              Booking Reference: <strong style={{ color: '#06B6D4' }}>{createdBookingId}</strong>
            </p>

            <div style={{ background: '#0F172A', padding: '16px', borderRadius: '12px', textAlign: 'left', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <div>📅 <strong>Date:</strong> {bookingDate} ({timeSlot})</div>
              <div>🎮 <strong>Station:</strong> {stationType.toUpperCase()}</div>
              <div>💰 <strong>Total Paid:</strong> {formatINR(bill.finalPayable)}</div>
            </div>

            {/* Instant Confirmation Badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', fontSize: '0.75rem', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.4)', padding: '8px 12px', borderRadius: '8px', color: '#67E8F9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Smartphone size={16} /> SMS Ticket Sent to <strong>{customerPhone}</strong>
              </div>
              <div style={{ background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.4)', padding: '8px 12px', borderRadius: '8px', color: '#C084FC', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} /> Email Ticket Sent to <strong>{customerEmail}</strong>
              </div>
            </div>

            <button className="btn-neon-purple" onClick={onClose} style={{ justifyContent: 'center', width: '100%' }}>
              Done & Return to Lounge
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
