import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Smartphone, Mail, UserCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginUser } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('gamer@escapegaming.com');
  const [otpOrPass, setOtpOrPass] = useState('123456');

  const [isOtpSent, setIsOtpSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (loginMethod === 'phone' && !isOtpSent) {
      setIsOtpSent(true);
      return;
    }

    // Process Login / Registration
    loginUser({
      name: name || (loginMethod === 'phone' ? `Gamer (${phone.slice(-4)})` : email.split('@')[0]),
      phone: phone || '+91 98765 43210',
      email: email || 'gamer@escapegaming.com',
    });

    onClose();
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
      zIndex: 110,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '28px', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
            boxShadow: '0 0 20px rgba(124, 58, 237, 0.5)',
          }}>
            <UserCheck size={24} color="#FFF" />
          </div>

          <h3 className="font-cyber" style={{ fontSize: '1.3rem', color: '#FFF', marginBottom: '4px' }}>
            {authMode === 'login' ? 'Gamer Portal Login' : 'Create Member Account'}
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>
            Login via Phone Number or Email ID to access bookings & 30-day reward points
          </p>
        </div>

        {/* Method Toggle: Phone vs Email */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px', background: '#0F172A', padding: '4px', borderRadius: '10px' }}>
          <button
            type="button"
            onClick={() => { setLoginMethod('phone'); setIsOtpSent(false); }}
            style={{
              background: loginMethod === 'phone' ? 'rgba(6, 182, 212, 0.3)' : 'transparent',
              border: loginMethod === 'phone' ? '1px solid #06B6D4' : 'none',
              color: '#FFF',
              padding: '8px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Smartphone size={16} color="#06B6D4" /> Mobile Phone
          </button>

          <button
            type="button"
            onClick={() => { setLoginMethod('email'); setIsOtpSent(false); }}
            style={{
              background: loginMethod === 'email' ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
              border: loginMethod === 'email' ? '1px solid #8B5CF6' : 'none',
              color: '#FFF',
              padding: '8px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Mail size={16} color="#8B5CF6" /> Email ID
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {authMode === 'signup' && (
            <div>
              <label style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Full Name:</label>
              <input
                type="text"
                required
                placeholder="e.g. Kavalpreet Singh"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '10px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
              />
            </div>
          )}

          {loginMethod === 'phone' ? (
            <div>
              <label style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Mobile Phone Number:</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                style={{ width: '100%', padding: '10px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
              />
            </div>
          ) : (
            <div>
              <label style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Email Address:</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="gamer@escapegaming.com"
                style={{ width: '100%', padding: '10px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
              />
            </div>
          )}

          {(isOtpSent || loginMethod === 'email') && (
            <div>
              <label style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>
                {loginMethod === 'phone' ? 'Enter 6-Digit SMS OTP:' : 'Account Password:'}
              </label>
              <input
                type="password"
                required
                value={otpOrPass}
                onChange={(e) => setOtpOrPass(e.target.value)}
                placeholder="••••••"
                style={{ width: '100%', padding: '10px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem', letterSpacing: '0.2em' }}
              />
            </div>
          )}

          <button type="submit" className="btn-neon-purple" style={{ justifyContent: 'center', width: '100%', marginTop: '6px' }}>
            {loginMethod === 'phone' && !isOtpSent ? 'Send OTP Code' : authMode === 'login' ? 'Authenticate & Login' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.8rem', color: '#9CA3AF' }}>
          {authMode === 'login' ? (
            <span>New Gamer? <button onClick={() => setAuthMode('signup')} style={{ background: 'none', border: 'none', color: '#06B6D4', fontWeight: 700, cursor: 'pointer' }}>Create Account</button></span>
          ) : (
            <span>Already have an account? <button onClick={() => setAuthMode('login')} style={{ background: 'none', border: 'none', color: '#06B6D4', fontWeight: 700, cursor: 'pointer' }}>Login</button></span>
          )}
        </div>
      </div>
    </div>
  );
};
