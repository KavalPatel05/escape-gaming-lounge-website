import React from 'react';
import { useApp } from '../context/AppContext';
import { Smartphone, Mail, CheckCircle, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { latestNotification, clearLatestNotification } = useApp();

  if (!latestNotification) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 120,
      maxWidth: '420px',
      width: 'calc(100% - 48px)',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(16px)',
      border: '1.5px solid #10B981',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 12px 36px rgba(16, 185, 129, 0.3)',
      animation: 'slideIn 0.3s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: 800, fontSize: '0.85rem' }}>
          <CheckCircle size={18} /> BOOKING CONFIRMATION SENT!
        </div>
        <button
          onClick={clearLatestNotification}
          style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0 }}
        >
          <X size={18} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem', color: '#D1D5DB' }}>
        {/* SMS Notification Card */}
        <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '10px', borderRadius: '10px' }}>
          <div style={{ color: '#06B6D4', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Smartphone size={14} /> SMS Delivered to {latestNotification.recipientPhone}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9CA3AF', fontFamily: 'monospace', lineHeight: '1.4' }}>
            "{latestNotification.smsContent}"
          </div>
        </div>

        {/* Email Notification Card */}
        <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '10px', borderRadius: '10px' }}>
          <div style={{ color: '#C084FC', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Mail size={14} /> Email Sent to {latestNotification.recipientEmail}
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#FFF' }}>
            Subject: {latestNotification.emailSubject}
          </div>
        </div>
      </div>
    </div>
  );
};
