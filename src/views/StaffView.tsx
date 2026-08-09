import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { SimMode } from '../types';
import { formatINR } from '../utils/pricing';
import { UserCheck, Play, Pause, Square, PlusCircle, Award, Clock, Gamepad, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

export const StaffView: React.FC = () => {
  const {
    stations,
    startStationSession,
    endStationSession,
    pauseResumeSession,
    addSessionTime,
    issueRewardPoints,
    bookings,
  } = useApp();

  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [gamerName, setGamerName] = useState('');
  const [gamerPhone, setGamerPhone] = useState('');
  const [durationMins, setDurationMins] = useState<number>(60);
  const [controllers, setControllers] = useState<number>(2);
  const [extraPersons, setExtraPersons] = useState<number>(0);
  const [simMode, setSimMode] = useState<SimMode>('standard');
  const [redeemPoints] = useState<number>(0);

  const [grantCustomerId, setGrantCustomerId] = useState('CUST-001');
  const [grantPoints, setGrantPoints] = useState<number>(1);
  const [grantDesc, setGrantDesc] = useState('Manual Staff Bonus');
  const [grantSuccessMsg, setGrantSuccessMsg] = useState('');

  const targetStation = stations.find((s) => s.id === selectedStationId);

  const handleStartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStationId) return;

    startStationSession({
      stationId: selectedStationId,
      customerName: gamerName || 'Walk-in Gamer',
      customerId: gamerPhone ? `CUST-${gamerPhone.slice(-4)}` : 'CUST-001',
      durationMinutes: durationMins,
      simMode,
      controllersCount: controllers,
      extraPersonsCount: extraPersons,
      redeemedPoints: redeemPoints,
    });

    setSelectedStationId(null);
    setGamerName('');
    setGamerPhone('');
  };

  const handleManualGrant = (e: React.FormEvent) => {
    e.preventDefault();
    issueRewardPoints(grantCustomerId, grantPoints, grantDesc);
    setGrantSuccessMsg(`Successfully granted ${grantPoints} point(s) to ${grantCustomerId}!`);
    setTimeout(() => setGrantSuccessMsg(''), 4000);
  };

  return (
    <div className="container-custom" style={{ padding: '32px 1.5rem 60px 1.5rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: 700, fontSize: '0.85rem' }}>
            <UserCheck size={18} /> STAFF OPERATOR DESK
          </div>
          <h1 className="font-cyber" style={{ fontSize: '1.8rem', color: '#FFF' }}>
            Station Timers & Live Session Controller
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="glass-card" style={{ padding: '10px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulse-dot pulse-dot-green"></span>
            <span>Available: <strong>{stations.filter((s) => s.status === 'available').length}</strong> / 4</span>
          </div>
          <div className="glass-card" style={{ padding: '10px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulse-dot pulse-dot-red"></span>
            <span>In Use: <strong>{stations.filter((s) => s.status === 'in-use').length}</strong> / 4</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {stations.map((st) => {
          const session = st.currentSession;
          let remainingSeconds = 0;
          let progressPercent = 0;

          if (session) {
            if (session.isPaused && session.pausedTimeRemaining !== undefined) {
              remainingSeconds = Math.max(0, Math.floor(session.pausedTimeRemaining / 1000));
            } else {
              remainingSeconds = Math.max(0, Math.floor((session.endTime - Date.now()) / 1000));
            }

            const totalSeconds = session.durationMinutes * 60;
            const elapsed = totalSeconds - remainingSeconds;
            progressPercent = Math.min(100, Math.max(0, (elapsed / totalSeconds) * 100));
          }

          const minsLeft = Math.floor(remainingSeconds / 60);
          const secsLeft = remainingSeconds % 60;
          const formattedTime = `${minsLeft.toString().padStart(2, '0')}:${secsLeft.toString().padStart(2, '0')}`;

          return (
            <div key={st.id} className={`glass-card ${st.status === 'in-use' ? 'glass-card-pink' : ''}`} style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {st.type === 'ps5' && <Gamepad size={20} color="#8B5CF6" />}
                    {st.type === 'simracing' && <Compass size={20} color="#06B6D4" />}
                    {st.type === 'vr' && <Sparkles size={20} color="#EC4899" />}
                    <h3 style={{ fontSize: '1rem', color: '#FFF', fontWeight: 700 }}>{st.name}</h3>
                  </div>

                  <span className={st.status === 'available' ? 'badge-available' : 'badge-in-use'} style={{ padding: '3px 8px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700 }}>
                    {st.status.toUpperCase()}
                  </span>
                </div>

                {session ? (
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem' }}>
                      <span style={{ color: '#9CA3AF' }}>Gamer:</span>
                      <strong style={{ color: '#FFF' }}>{session.customerName}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem' }}>
                      <span style={{ color: '#9CA3AF' }}>Setup:</span>
                      <span style={{ color: '#06B6D4' }}>
                        {session.stationType === 'ps5' ? `${session.controllersCount} Ctrlrs (${session.extraPersonsCount} Extra)` : session.simMode}
                      </span>
                    </div>

                    <div style={{ textAlign: 'center', margin: '14px 0 8px 0' }}>
                      <div style={{ fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'uppercase' }}>
                        {session.isPaused ? '⏸️ SESSION PAUSED' : '⏱️ TIME REMAINING'}
                      </div>
                      <div className="font-cyber" style={{ fontSize: '2.2rem', color: minsLeft < 5 ? '#EF4444' : '#34D399', fontWeight: 900 }}>
                        {formattedTime}
                      </div>
                    </div>

                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${progressPercent}%`, background: minsLeft < 5 ? '#EF4444' : '#10B981', transition: 'width 1s linear' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.75rem' }}>
                      <span style={{ color: '#9CA3AF' }}>Billed: {formatINR(session.totalAmount)}</span>
                      <span style={{ color: '#C084FC' }}>+{session.pointsEarned} Pts</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px dashed rgba(255,255,255,0.1)', padding: '24px', borderRadius: '12px', textAlign: 'center', marginBottom: '16px' }}>
                    <Clock size={32} color="#6B7280" style={{ margin: '0 auto 8px auto' }} />
                    <div style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>Station Ready for Gamer</div>
                  </div>
                )}
              </div>

              <div>
                {session ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    <button
                      onClick={() => pauseResumeSession(st.id)}
                      style={{ background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #F59E0B', color: '#FCD34D', padding: '8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      {session.isPaused ? <Play size={14} /> : <Pause size={14} />}
                      {session.isPaused ? 'Resume' : 'Pause'}
                    </button>

                    <button
                      onClick={() => addSessionTime(st.id, 30)}
                      style={{ background: 'rgba(6, 182, 212, 0.2)', border: '1px solid #06B6D4', color: '#67E8F9', padding: '8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <PlusCircle size={14} /> +30m
                    </button>

                    <button
                      onClick={() => endStationSession(st.id)}
                      style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <Square size={14} /> Stop
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn-neon-cyan"
                    onClick={() => {
                      setSelectedStationId(st.id);
                      setSimMode('standard');
                    }}
                    style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
                  >
                    Start Session Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 className="font-cyber" style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="#EC4899" /> Manual Points Assigner
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '16px' }}>
            Grant loyalty points directly to member account by ID. Points strictly expire after 30 days.
          </p>

          <form onSubmit={handleManualGrant} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#D1D5DB', display: 'block', marginBottom: '4px' }}>Customer ID:</label>
              <input
                type="text"
                required
                value={grantCustomerId}
                onChange={(e) => setGrantCustomerId(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#D1D5DB', display: 'block', marginBottom: '4px' }}>Points:</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={grantPoints}
                  onChange={(e) => setGrantPoints(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#D1D5DB', display: 'block', marginBottom: '4px' }}>Reason / Notes:</label>
                <input
                  type="text"
                  value={grantDesc}
                  onChange={(e) => setGrantDesc(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {grantSuccessMsg && (
              <div style={{ fontSize: '0.8rem', color: '#34D399', background: 'rgba(16,185,129,0.15)', padding: '8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> {grantSuccessMsg}
              </div>
            )}

            <button type="submit" className="btn-neon-purple" style={{ justifyContent: 'center', marginTop: '4px' }}>
              Assign Points Now
            </button>
          </form>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 className="font-cyber" style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} color="#06B6D4" /> Pre-Booked Customer Register
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '16px' }}>
            Upcoming pre-bookings for today
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto' }}>
            {bookings.map((bk) => (
              <div key={bk.id} style={{ background: '#0F172A', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#FFF', fontSize: '0.85rem' }}>{bk.customerName} ({bk.id})</div>
                  <div style={{ fontSize: '0.75rem', color: '#06B6D4' }}>{bk.stationType.toUpperCase()} - {bk.timeSlot}</div>
                  <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Phone: {bk.customerPhone}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: '#34D399', fontSize: '0.85rem' }}>{formatINR(bk.totalCost)}</div>
                  {bk.isRewardBooking && <span style={{ fontSize: '0.65rem', background: 'rgba(139,92,246,0.2)', color: '#C084FC', padding: '2px 6px', borderRadius: '4px' }}>Reward Slot</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {selectedStationId && targetStation && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '24px' }}>
            <h3 className="font-cyber" style={{ fontSize: '1.2rem', color: '#FFF', marginBottom: '4px' }}>
              Start Session: {targetStation.name}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '16px' }}>Fill gamer details and controller setup</p>

            <form onSubmit={handleStartSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#D1D5DB', display: 'block', marginBottom: '4px' }}>Gamer Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aman Sharma"
                  value={gamerName}
                  onChange={(e) => setGamerName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#D1D5DB', display: 'block', marginBottom: '4px' }}>Duration:</label>
                  <select
                    value={durationMins}
                    onChange={(e) => setDurationMins(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 12px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                  >
                    <option value={30}>30 Mins</option>
                    <option value={60}>1 Hour (60m)</option>
                    <option value={120}>2 Hours (120m)</option>
                  </select>
                </div>

                {targetStation.type === 'ps5' ? (
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#D1D5DB', display: 'block', marginBottom: '4px' }}>Controllers:</label>
                    <select
                      value={controllers}
                      onChange={(e) => setControllers(Number(e.target.value))}
                      style={{ width: '100%', padding: '8px 12px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                    >
                      <option value={2}>1-2 Controllers (₹100/h)</option>
                      <option value={4}>3-4 Controllers (₹170/h)</option>
                    </select>
                  </div>
                ) : targetStation.type === 'simracing' ? (
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#D1D5DB', display: 'block', marginBottom: '4px' }}>Mode:</label>
                    <select
                      value={simMode}
                      onChange={(e) => setSimMode(e.target.value as SimMode)}
                      style={{ width: '100%', padding: '8px 12px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                    >
                      <option value="standard">Standard Sim (₹150/₹250)</option>
                      <option value="immersive">Immersive Motion (₹200/₹300)</option>
                    </select>
                  </div>
                ) : null}
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#D1D5DB', display: 'block', marginBottom: '4px' }}>Extra Persons (+₹30 each):</label>
                <input
                  type="number"
                  min={0}
                  max={4}
                  value={extraPersons}
                  onChange={(e) => setExtraPersons(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedStationId(null)}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFF', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-neon-cyan" style={{ flex: 1, justifyContent: 'center' }}>
                  Confirm & Start Timer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
