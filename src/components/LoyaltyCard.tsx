import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, QrCode, Clock, Info, Calendar } from 'lucide-react';

export const LoyaltyCard: React.FC = () => {
  const { customer, rewardPoints } = useApp();

  return (
    <div className="glass-card" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 27, 75, 0.9))' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
        
        {/* Left Side: Digital QR Pass */}
        <div style={{
          background: 'linear-gradient(135deg, #4C1D95 0%, #1E1B4B 100%)',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid rgba(192, 38, 211, 0.4)',
          boxShadow: '0 10px 30px rgba(124, 58, 237, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#C084FC', fontWeight: 800 }}>
                  VIP REWARDS PASS
                </span>
                <h3 className="font-cyber" style={{ fontSize: '1.2rem', color: '#FFF' }}>
                  {customer.name}
                </h3>
              </div>
              <Award size={32} color="#EC4899" />
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', margin: '16px 0' }}>
              <div style={{ background: '#000', padding: '8px', borderRadius: '8px', color: '#FFF' }}>
                <QrCode size={56} />
              </div>
              <div style={{ color: '#0F172A' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                  Member Pass ID
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, fontFamily: 'monospace' }}>
                  {customer.id}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#475569' }}>
                  Scan at staff counter to earn/redeem
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Active Loyalty Balance</div>
              <div className="font-cyber" style={{ fontSize: '2rem', color: '#34D399', fontWeight: 900 }}>
                {customer.totalPointsBalance} <span style={{ fontSize: '1rem', color: '#A7F3D0' }}>PTS</span>
              </div>
            </div>

            <div style={{ fontSize: '0.7rem', color: '#C084FC', background: 'rgba(255, 255, 255, 0.1)', padding: '4px 10px', borderRadius: '12px' }}>
              30-Day Auto Expiration
            </div>
          </div>
        </div>

        {/* Right Side: Expiration Ledger & Redemption Terms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 className="font-cyber" style={{ fontSize: '1.2rem', color: '#FFF', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} color="#06B6D4" /> Points Expiration Schedule (30-Day Window)
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>
              Every point assigned expires strictly 30 days after payment/issuance date.
            </p>
          </div>

          {/* Points Ledger List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
            {rewardPoints.map((pt) => {
              const now = new Date();
              const exp = new Date(pt.expiryDate);
              const daysLeft = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 3600 * 24));

              return (
                <div
                  key={pt.id}
                  style={{
                    background: pt.isExpired ? 'rgba(239, 68, 68, 0.1)' : pt.isRedeemed ? 'rgba(107, 114, 128, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    border: `1px solid ${pt.isExpired ? 'rgba(239, 68, 68, 0.3)' : pt.isRedeemed ? 'rgba(107, 114, 128, 0.2)' : 'rgba(16, 185, 129, 0.3)'}`,
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#FFF' }}>{pt.description}</div>
                    <div style={{ fontSize: '0.7rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <Calendar size={12} /> Earned: {new Date(pt.earnedDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: pt.isExpired ? '#EF4444' : pt.isRedeemed ? '#9CA3AF' : '#34D399' }}>
                      +{pt.points} Pts
                    </div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: pt.isExpired ? '#EF4444' : daysLeft <= 5 ? '#F59E0B' : '#6EE7B7' }}>
                      {pt.isRedeemed ? 'Redeemed' : pt.isExpired ? 'Expired' : `${daysLeft} days left`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '12px', padding: '14px', fontSize: '0.8rem' }}>
            <div style={{ color: '#06B6D4', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={16} /> Official Rewards Policy:
            </div>
            <ul style={{ paddingLeft: '18px', color: '#D1D5DB', display: 'flex', flexDirection: 'column', gap: '4px', lineHeight: '1.4' }}>
              <li><strong>1 Point Granted</strong> for every 1 hr paid session.</li>
              <li><strong>10 Points = 1 Hr Free Session</strong> (2 Players).</li>
              <li><strong>20 Points = 1 Hr Free Session</strong> (4 Players). Either 20 from 1 player or 10+10 split from 2 players.</li>
              <li>Valid <strong>ONLY Monday to Friday</strong>. Subject to availability & pre-booking required.</li>
              <li>Points expire strictly <strong>30 days</strong> after point assignment/payment.</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};
