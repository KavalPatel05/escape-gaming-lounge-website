import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, TrendingUp, Award, DollarSign, Activity, Users, Settings, Download, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../utils/pricing';

export const AdminView: React.FC = () => {
  const { stations, rewardPoints, bookings } = useApp();

  const [ps5Base2P, setPs5Base2P] = useState(100);
  const [ps5Base4P, setPs5Base4P] = useState(170);
  const [extraPersonFee, setExtraPersonFee] = useState(30);
  const [vr1h, setVr1h] = useState(250);
  const [simStd1h, setSimStd1h] = useState(250);
  const [simImm1h, setSimImm1h] = useState(300);
  const [expirationDays, setExpirationDays] = useState(30);

  const [savedMsg, setSavedMsg] = useState('');

  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalCost, 5800);
  const totalPointsIssued = rewardPoints.reduce((sum, p) => sum + p.points, 0);
  const totalPointsExpired = rewardPoints.filter((p) => p.isExpired).reduce((sum, p) => sum + p.points, 0);
  const totalPointsRedeemed = rewardPoints.filter((p) => p.isRedeemed).reduce((sum, p) => sum + p.points, 0);
  const activePoints = totalPointsIssued - totalPointsExpired - totalPointsRedeemed;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg('Station tariffs & reward settings saved successfully!');
    setTimeout(() => setSavedMsg(''), 4000);
  };

  const handleExportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Booking ID,Customer,Station,Date,Cost\n"
      + bookings.map(b => `${b.id},${b.customerName},${b.stationType},${b.date},${b.totalCost}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Escape_Lounge_Register_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container-custom" style={{ padding: '32px 1.5rem 60px 1.5rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F59E0B', fontWeight: 700, fontSize: '0.85rem' }}>
            <ShieldAlert size={18} /> ADMIN CONTROL & ANALYTICS
          </div>
          <h1 className="font-cyber" style={{ fontSize: '1.8rem', color: '#FFF' }}>
            Lounge Management Console
          </h1>
        </div>

        <button className="btn-neon-cyan" onClick={handleExportData} style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
          <Download size={16} /> Export Daily Register (CSV)
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '32px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#9CA3AF', fontSize: '0.8rem', marginBottom: '8px' }}>
            <span>Total Lounge Revenue</span>
            <DollarSign size={18} color="#06B6D4" />
          </div>
          <div className="font-cyber" style={{ fontSize: '1.8rem', color: '#FFF', fontWeight: 800 }}>
            {formatINR(totalRevenue)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#34D399', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={12} /> +18.4% vs last week
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#9CA3AF', fontSize: '0.8rem', marginBottom: '8px' }}>
            <span>Station Utilization</span>
            <Activity size={18} color="#8B5CF6" />
          </div>
          <div className="font-cyber" style={{ fontSize: '1.8rem', color: '#FFF', fontWeight: 800 }}>
            {stations.filter(s => s.status === 'in-use').length} / {stations.length} Active
          </div>
          <div style={{ fontSize: '0.75rem', color: '#C084FC', marginTop: '4px' }}>
            PS5 Squad #2 in-use
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#9CA3AF', fontSize: '0.8rem', marginBottom: '8px' }}>
            <span>Active Reward Tokens</span>
            <Award size={18} color="#EC4899" />
          </div>
          <div className="font-cyber" style={{ fontSize: '1.8rem', color: '#34D399', fontWeight: 800 }}>
            {activePoints} Pts
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '4px' }}>
            Total Issued: {totalPointsIssued} Pts
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#9CA3AF', fontSize: '0.8rem', marginBottom: '8px' }}>
            <span>Expired Points (30d)</span>
            <Award size={18} color="#EF4444" />
          </div>
          <div className="font-cyber" style={{ fontSize: '1.8rem', color: '#EF4444', fontWeight: 800 }}>
            {totalPointsExpired} Pts
          </div>
          <div style={{ fontSize: '0.75rem', color: '#F87171', marginTop: '4px' }}>
            Strict 30-day policy enforced
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 className="font-cyber" style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={20} color="#06B6D4" /> Station Pricing & Tariff Configurator
          </h3>

          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ color: '#D1D5DB', display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>PS5 1-2 Ctrlrs (₹/hr):</label>
                <input
                  type="number"
                  value={ps5Base2P}
                  onChange={(e) => setPs5Base2P(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>

              <div>
                <label style={{ color: '#D1D5DB', display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>PS5 3-4 Ctrlrs (₹/hr):</label>
                <input
                  type="number"
                  value={ps5Base4P}
                  onChange={(e) => setPs5Base4P(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ color: '#D1D5DB', display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>Extra Person Fee (₹):</label>
                <input
                  type="number"
                  value={extraPersonFee}
                  onChange={(e) => setExtraPersonFee(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>

              <div>
                <label style={{ color: '#D1D5DB', display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>VR 1 Hour (₹):</label>
                <input
                  type="number"
                  value={vr1h}
                  onChange={(e) => setVr1h(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ color: '#D1D5DB', display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>SimRacing Std 1h (₹):</label>
                <input
                  type="number"
                  value={simStd1h}
                  onChange={(e) => setSimStd1h(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>

              <div>
                <label style={{ color: '#D1D5DB', display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>SimRacing Immersive 1h (₹):</label>
                <input
                  type="number"
                  value={simImm1h}
                  onChange={(e) => setSimImm1h(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>
            </div>

            {savedMsg && (
              <div style={{ fontSize: '0.75rem', color: '#34D399', background: 'rgba(16,185,129,0.15)', padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} /> {savedMsg}
              </div>
            )}

            <button type="submit" className="btn-neon-purple" style={{ justifyContent: 'center', marginTop: '6px' }}>
              Save Tariff Configurations
            </button>
          </form>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 className="font-cyber" style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="#EC4899" /> Reward Token Rules Manager
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem' }}>
            <div style={{ background: '#0F172A', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontWeight: 700, color: '#C084FC', marginBottom: '4px' }}>Point Expiration Limit:</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  value={expirationDays}
                  onChange={(e) => setExpirationDays(Number(e.target.value))}
                  style={{ width: '80px', padding: '6px', background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFF' }}
                />
                <span style={{ color: '#9CA3AF' }}>Days after point assignment / payment</span>
              </div>
            </div>

            <div style={{ background: '#0F172A', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontWeight: 700, color: '#06B6D4', marginBottom: '4px' }}>2-Player Redemption Rule:</div>
              <div style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>10 Points = 1 Hr Free Session (Mon-Fri only)</div>
            </div>

            <div style={{ background: '#0F172A', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontWeight: 700, color: '#10B981', marginBottom: '4px' }}>4-Player Redemption Rule:</div>
              <div style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>20 Points required (redeem 20 from 1 gamer or 10+10 split from 2 gamers)</div>
            </div>
          </div>
        </div>

      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 className="font-cyber" style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={20} color="#8B5CF6" /> Reward Ledger Audit Log
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF' }}>
                <th style={{ padding: '10px' }}>Point ID</th>
                <th style={{ padding: '10px' }}>Customer ID</th>
                <th style={{ padding: '10px' }}>Points</th>
                <th style={{ padding: '10px' }}>Earned Date</th>
                <th style={{ padding: '10px' }}>30-Day Expiry Date</th>
                <th style={{ padding: '10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rewardPoints.map((pt) => (
                <tr key={pt.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px', color: '#06B6D4', fontFamily: 'monospace' }}>{pt.id}</td>
                  <td style={{ padding: '10px', color: '#FFF' }}>{pt.customerId}</td>
                  <td style={{ padding: '10px', color: '#34D399', fontWeight: 700 }}>+{pt.points} Pts</td>
                  <td style={{ padding: '10px', color: '#9CA3AF' }}>{new Date(pt.earnedDate).toLocaleDateString()}</td>
                  <td style={{ padding: '10px', color: '#9CA3AF' }}>{new Date(pt.expiryDate).toLocaleDateString()}</td>
                  <td style={{ padding: '10px' }}>
                    {pt.isRedeemed ? (
                      <span style={{ color: '#9CA3AF', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>Redeemed</span>
                    ) : pt.isExpired ? (
                      <span style={{ color: '#EF4444', background: 'rgba(239,68,68,0.15)', padding: '2px 8px', borderRadius: '4px' }}>Expired (30d)</span>
                    ) : (
                      <span style={{ color: '#34D399', background: 'rgba(16,185,129,0.15)', padding: '2px 8px', borderRadius: '4px' }}>Active</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
