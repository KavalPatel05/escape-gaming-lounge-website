import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { supabaseService } from '../services/supabaseService';
import { X, Smartphone, Mail, UserCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

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
  const [email, setEmail] = useState('patel.kaval.02@gmail.com');
  const [password, setPassword] = useState('GamerPass123!');
  const [otpCode, setOtpCode] = useState('');

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  // Handle Mobile Phone SMS OTP Send
  const handleSendPhoneOtp = async () => {
    setLoading(true);
    setFeedback(null);

    const res = await supabaseService.sendPhoneOtp(phone);
    setLoading(false);

    if (res.success) {
      setIsOtpSent(true);
      setFeedback({ type: 'success', message: res.message });
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  // Handle Mobile Phone SMS OTP Verify
  const handleVerifyPhoneOtp = async () => {
    setLoading(true);
    setFeedback(null);

    const res = await supabaseService.verifyPhoneOtp(phone, otpCode);
    setLoading(false);

    if (res.success) {
      setFeedback({ type: 'success', message: 'Authentication Successful!' });
      loginUser({
        name: name || `Gamer (${phone.slice(-4)})`,
        phone: phone,
        email: email,
      });
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  // Handle Email Password Authentication
  const handleEmailAuth = async () => {
    setLoading(true);
    setFeedback(null);

    let res;
    if (authMode === 'signup') {
      res = await supabaseService.signUpWithEmail(email, password, name, phone);
    } else {
      res = await supabaseService.signInWithEmail(email, password);
    }
    setLoading(false);

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      loginUser({
        name: name || email.split('@')[0],
        phone: phone,
        email: email,
      });
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (loginMethod === 'phone') {
      if (!isOtpSent) {
        handleSendPhoneOtp();
      } else {
        handleVerifyPhoneOtp();
      }
    } else {
      handleEmailAuth();
    }
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
            {authMode === 'login' ? 'Gamer Auth Portal' : 'Create Member Account'}
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>
            Real Supabase Authentication via Mobile SMS OTP or Email
          </p>
        </div>

        {/* Feedback Alert Banner */}
        {feedback && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '10px',
            marginBottom: '16px',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: feedback.type === 'success' ? '1px solid #10B981' : '1px solid #EF4444',
            color: feedback.type === 'success' ? '#34D399' : '#F87171',
          }}>
            {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Method Selector: Phone vs Email */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px', background: '#0F172A', padding: '4px', borderRadius: '10px' }}>
          <button
            type="button"
            onClick={() => { setLoginMethod('phone'); setIsOtpSent(false); setFeedback(null); }}
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
            <Smartphone size={16} color="#06B6D4" /> Mobile SMS OTP
          </button>

          <button
            type="button"
            onClick={() => { setLoginMethod('email'); setIsOtpSent(false); setFeedback(null); }}
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
              <label style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Mobile Phone (+91):</label>
              <input
                type="text"
                required
                disabled={isOtpSent}
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
                placeholder="patel.kaval.02@gmail.com"
                style={{ width: '100%', padding: '10px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
              />
            </div>
          )}

          {loginMethod === 'phone' && isOtpSent && (
            <div>
              <label style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Enter 6-Digit SMS OTP Code:</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                style={{ width: '100%', padding: '10px', background: '#0F172A', border: '1px solid #06B6D4', borderRadius: '8px', color: '#FFF', fontSize: '1rem', letterSpacing: '0.3em', textAlign: 'center' }}
              />
            </div>
          )}

          {loginMethod === 'email' && (
            <div>
              <label style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Account Password:</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
              />
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-neon-purple" style={{ justifyContent: 'center', width: '100%', marginTop: '6px' }}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : loginMethod === 'phone' ? (!isOtpSent ? 'Send Mobile SMS OTP' : 'Verify OTP & Login') : (authMode === 'login' ? 'Sign In with Email' : 'Register Account')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.8rem', color: '#9CA3AF' }}>
          {authMode === 'login' ? (
            <span>New Gamer? <button onClick={() => setAuthMode('signup')} style={{ background: 'none', border: 'none', color: '#06B6D4', fontWeight: 700, cursor: 'pointer' }}>Create Account</button></span>
          ) : (
            <span>Already have an account? <button onClick={() => setAuthMode('login')} style={{ background: 'none', border: 'none', color: '#06B6D4', fontWeight: 700, cursor: 'pointer' }}>Sign In</button></span>
          )}
        </div>
      </div>
    </div>
  );
};
