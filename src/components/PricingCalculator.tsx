import React, { useState } from 'react';
import type { StationType, SimMode } from '../types';
import { calculateBill, formatINR } from '../utils/pricing';
import { Calculator, Gamepad, Compass, Sparkles, Users, Award, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PricingCalculatorProps {
  onBookNow: (params: {
    stationType: StationType;
    simMode?: SimMode;
    durationMinutes: number;
    controllersCount: number;
    extraPersonsCount: number;
  }) => void;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({ onBookNow }) => {
  const { activePointsBalance } = useApp();
  const [stationType, setStationType] = useState<StationType>('ps5');
  const [simMode, setSimMode] = useState<SimMode>('standard');
  const [controllersCount, setControllersCount] = useState<number>(2);
  const [extraPersonsCount, setExtraPersonsCount] = useState<number>(0);
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [redeemPoints, setRedeemPoints] = useState<number>(0);

  const bill = calculateBill({
    stationType,
    simMode,
    durationMinutes,
    controllersCount,
    extraPersonsCount,
    redeemPoints,
  });

  return (
    <div className="glass-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.2)', padding: '8px', borderRadius: '10px', color: '#06B6D4' }}>
            <Calculator size={22} />
          </div>
          <div>
            <h3 className="font-cyber" style={{ fontSize: '1.2rem', color: '#FFF' }}>
              Live Price Calculator
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Instant rate estimate & reward points simulation</p>
          </div>
        </div>

        <span style={{ fontSize: '0.75rem', background: 'rgba(139, 92, 246, 0.15)', color: '#C084FC', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
          Standard Transparent Pricing
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#D1D5DB', fontWeight: 600, marginBottom: '8px' }}>
              1. Select Gaming Rig:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setStationType('ps5')}
                style={{
                  background: stationType === 'ps5' ? 'rgba(124, 58, 237, 0.3)' : 'rgba(15, 23, 42, 0.6)',
                  border: stationType === 'ps5' ? '1px solid #8B5CF6' : '1px solid rgba(255,255,255,0.1)',
                  color: '#FFF',
                  padding: '10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Gamepad size={16} color="#8B5CF6" /> PS5
              </button>

              <button
                type="button"
                onClick={() => setStationType('simracing')}
                style={{
                  background: stationType === 'simracing' ? 'rgba(6, 182, 212, 0.3)' : 'rgba(15, 23, 42, 0.6)',
                  border: stationType === 'simracing' ? '1px solid #06B6D4' : '1px solid rgba(255,255,255,0.1)',
                  color: '#FFF',
                  padding: '10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Compass size={16} color="#06B6D4" /> PS5 + SimRig
              </button>

              <button
                type="button"
                onClick={() => setStationType('vr')}
                style={{
                  background: stationType === 'vr' ? 'rgba(236, 72, 153, 0.3)' : 'rgba(15, 23, 42, 0.6)',
                  border: stationType === 'vr' ? '1px solid #EC4899' : '1px solid rgba(255,255,255,0.1)',
                  color: '#FFF',
                  padding: '10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Sparkles size={16} color="#EC4899" /> VR Setup
              </button>
            </div>
          </div>

          {stationType === 'ps5' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#D1D5DB', fontWeight: 600, marginBottom: '8px' }}>
                Controllers Count:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setControllersCount(2)}
                  style={{
                    background: controllersCount <= 2 ? 'rgba(139, 92, 246, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                    border: controllersCount <= 2 ? '1px solid #8B5CF6' : '1px solid rgba(255,255,255,0.1)',
                    color: '#FFF',
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  1-2 Controllers (₹100/hr)
                </button>
                <button
                  type="button"
                  onClick={() => setControllersCount(4)}
                  style={{
                    background: controllersCount > 2 ? 'rgba(139, 92, 246, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                    border: controllersCount > 2 ? '1px solid #8B5CF6' : '1px solid rgba(255,255,255,0.1)',
                    color: '#FFF',
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  3-4 Controllers (₹170/hr)
                </button>
              </div>
            </div>
          )}

          {stationType === 'simracing' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#D1D5DB', fontWeight: 600, marginBottom: '8px' }}>
                Mode (1 Mode Played at a Time):
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setSimMode('standard')}
                  style={{
                    background: simMode === 'standard' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                    border: simMode === 'standard' ? '1px solid #06B6D4' : '1px solid rgba(255,255,255,0.1)',
                    color: '#FFF',
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Standard (₹150 30m / ₹250 1h)
                </button>
                <button
                  type="button"
                  onClick={() => setSimMode('immersive')}
                  style={{
                    background: simMode === 'immersive' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                    border: simMode === 'immersive' ? '1px solid #06B6D4' : '1px solid rgba(255,255,255,0.1)',
                    color: '#FFF',
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Immersive Motion (₹200 30m / ₹300 1h)
                </button>
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#D1D5DB', fontWeight: 600, marginBottom: '8px' }}>
              Duration:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {[30, 60, 120, 180].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDurationMinutes(mins)}
                  style={{
                    background: durationMinutes === mins ? 'rgba(16, 185, 129, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                    border: durationMinutes === mins ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.1)',
                    color: '#FFF',
                    padding: '8px 4px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {mins === 30 ? '30 Mins' : `${mins / 60} Hr${mins > 60 ? 's' : ''}`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.8rem', color: '#D1D5DB', fontWeight: 600 }}>
                Extra Person Count (+₹30/person):
              </label>
              <span style={{ fontSize: '0.8rem', color: '#34D399', fontWeight: 700 }}>{extraPersonsCount} Extra</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Users size={16} color="#9CA3AF" />
              <input
                type="range"
                min="0"
                max="5"
                value={extraPersonsCount}
                onChange={(e) => setExtraPersonsCount(Number(e.target.value))}
                style={{ flex: 1, accentColor: '#06B6D4' }}
              />
            </div>
          </div>

          <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid var(--border-neon-purple)', borderRadius: '10px', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#C084FC', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Award size={14} /> Reward Redemption Test:
              </span>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Bal: {activePointsBalance} pts</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setRedeemPoints(0)}
                style={{
                  flex: 1,
                  padding: '6px',
                  fontSize: '0.75rem',
                  borderRadius: '6px',
                  border: redeemPoints === 0 ? '1px solid #8B5CF6' : '1px solid transparent',
                  background: redeemPoints === 0 ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255,255,255,0.05)',
                  color: '#FFF',
                  cursor: 'pointer',
                }}
              >
                No Points
              </button>
              <button
                type="button"
                onClick={() => setRedeemPoints(10)}
                disabled={activePointsBalance < 10}
                style={{
                  flex: 1,
                  padding: '6px',
                  fontSize: '0.75rem',
                  borderRadius: '6px',
                  border: redeemPoints === 10 ? '1px solid #8B5CF6' : '1px solid transparent',
                  background: redeemPoints === 10 ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255,255,255,0.05)',
                  color: activePointsBalance < 10 ? '#6B7280' : '#FFF',
                  cursor: activePointsBalance < 10 ? 'not-allowed' : 'pointer',
                }}
              >
                Redeem 10 Pts (2P)
              </button>
              <button
                type="button"
                onClick={() => setRedeemPoints(20)}
                disabled={activePointsBalance < 20}
                style={{
                  flex: 1,
                  padding: '6px',
                  fontSize: '0.75rem',
                  borderRadius: '6px',
                  border: redeemPoints === 20 ? '1px solid #8B5CF6' : '1px solid transparent',
                  background: redeemPoints === 20 ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255,255,255,0.05)',
                  color: activePointsBalance < 20 ? '#6B7280' : '#FFF',
                  cursor: activePointsBalance < 20 ? 'not-allowed' : 'pointer',
                }}
              >
                Redeem 20 Pts (4P)
              </button>
            </div>
            {redeemPoints > 0 && (
              <p style={{ fontSize: '0.7rem', color: '#F59E0B', marginTop: '6px' }}>
                ⚠️ Note: Point redemptions require pre-booking and are valid strictly Monday to Friday.
              </p>
            )}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          borderRadius: '14px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
              Estimated Summary
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#D1D5DB' }}>
                <span>Base Game Rate ({durationMinutes}m):</span>
                <span style={{ fontWeight: 600 }}>{formatINR(bill.basePrice)}</span>
              </div>

              {extraPersonsCount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#D1D5DB' }}>
                  <span>Extra Person Fee ({extraPersonsCount} x ₹30):</span>
                  <span style={{ fontWeight: 600 }}>+{formatINR(bill.extraPersonFee)}</span>
                </div>
              )}

              {bill.discountApplied > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34D399' }}>
                  <span>Reward Discount ({redeemPoints} pts):</span>
                  <span style={{ fontWeight: 700 }}>-{formatINR(bill.discountApplied)}</span>
                </div>
              )}

              <hr style={{ border: 'none', borderTop: '1px dashed rgba(255,255,255,0.1)', margin: '8px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>Total Payable:</span>
                <span className="font-cyber" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#06B6D4' }}>
                  {formatINR(bill.finalPayable)}
                </span>
              </div>

              <div style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '8px 12px',
                borderRadius: '8px',
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#34D399',
                fontSize: '0.8rem',
              }}>
                <ShieldCheck size={16} />
                <span>You will earn <strong>+{bill.pointsEarned} Reward Point</strong> for this session!</span>
              </div>
            </div>
          </div>

          <button
            className="btn-neon-purple"
            onClick={() => onBookNow({ stationType, simMode, durationMinutes, controllersCount, extraPersonsCount })}
            style={{ width: '100%', marginTop: '20px', justifyContent: 'center' }}
          >
            Lock & Book Slot
          </button>
        </div>
      </div>
    </div>
  );
};
