import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Gamepad2, ShieldAlert, UserCheck, Star, Menu, X, Award, Sparkles, User } from 'lucide-react';
import type { UserRole } from '../types';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenAuth: () => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onOpenAuth, activeSection, setActiveSection }) => {
  const { role, setRole, customer, activePointsBalance } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setMobileMenuOpen(false);
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(7, 9, 19, 0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(139, 92, 246, 0.2)' }}>
      {/* Top Banner: Role Switcher Bar */}
      <div style={{ background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.15))', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '6px 0' }}>
        <div className="container-custom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9CA3AF' }}>
            <Sparkles size={14} style={{ color: '#06B6D4' }} />
            <span>Mode Select:</span>
          </div>

          <div style={{ display: 'flex', gap: '6px', background: 'rgba(15, 23, 42, 0.8)', padding: '3px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              onClick={() => handleRoleChange('customer')}
              style={{
                background: role === 'customer' ? 'linear-gradient(135deg, #7C3AED, #06B6D4)' : 'transparent',
                color: '#FFF',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Gamepad2 size={12} />
              Customer
            </button>

            <button
              onClick={() => handleRoleChange('staff')}
              style={{
                background: role === 'staff' ? 'linear-gradient(135deg, #059669, #10B981)' : 'transparent',
                color: role === 'staff' ? '#FFF' : '#9CA3AF',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <UserCheck size={12} />
              Staff Desk
            </button>

            <button
              onClick={() => handleRoleChange('admin')}
              style={{
                background: role === 'admin' ? 'linear-gradient(135deg, #DC2626, #F59E0B)' : 'transparent',
                color: role === 'admin' ? '#FFF' : '#9CA3AF',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <ShieldAlert size={12} />
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container-custom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveSection('home')}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(124, 58, 237, 0.6)'
          }}>
            <Gamepad2 size={24} color="#FFF" />
          </div>
          <div>
            <div className="font-cyber" style={{ fontSize: '1.2rem', fontWeight: 800, background: 'linear-gradient(90deg, #FFF, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ESCAPE
            </div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: '#8B5CF6', fontWeight: 700 }}>
              GAMING LOUNGE
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="desktop-only">
          {role === 'customer' && (
            <>
              <button
                onClick={() => setActiveSection('stations')}
                style={{ background: 'none', border: 'none', color: activeSection === 'stations' ? '#06B6D4' : '#D1D5DB', fontWeight: 600, cursor: 'pointer' }}
              >
                Stations & Rates
              </button>
              <button
                onClick={() => setActiveSection('loyalty')}
                style={{ background: 'none', border: 'none', color: activeSection === 'loyalty' ? '#06B6D4' : '#D1D5DB', fontWeight: 600, cursor: 'pointer' }}
              >
                Rewards Pass
              </button>
              <button
                onClick={() => setActiveSection('games')}
                style={{ background: 'none', border: 'none', color: activeSection === 'games' ? '#06B6D4' : '#D1D5DB', fontWeight: 600, cursor: 'pointer' }}
              >
                Game Catalog
              </button>
              <button
                onClick={() => setActiveSection('snacks')}
                style={{ background: 'none', border: 'none', color: activeSection === 'snacks' ? '#06B6D4' : '#D1D5DB', fontWeight: 600, cursor: 'pointer' }}
              >
                Snack Bar
              </button>
            </>
          )}

          {role === 'staff' && (
            <span style={{ fontSize: '0.85rem', color: '#10B981', background: 'rgba(16,185,129,0.1)', padding: '4px 12px', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.3)' }}>
              ● Staff Console Active
            </span>
          )}

          {role === 'admin' && (
            <span style={{ fontSize: '0.85rem', color: '#F59E0B', background: 'rgba(245,158,11,0.1)', padding: '4px 12px', borderRadius: '12px', border: '1px solid rgba(245,158,11,0.3)' }}>
              ● Admin Privileges Active
            </span>
          )}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {role === 'customer' && (
            <>
              {/* User Account Login Button */}
              <button
                onClick={onOpenAuth}
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFF',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <User size={14} color="#06B6D4" />
                <span>{customer.isLoggedIn ? customer.name.split(' ')[0] : 'Login'}</span>
              </button>

              {/* Reward Points Counter */}
              <div
                onClick={() => setActiveSection('loyalty')}
                style={{
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <Award size={16} color="#EC4899" />
                <span style={{ fontWeight: 800, color: '#FFF', fontSize: '0.9rem' }}>{activePointsBalance}</span>
                <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Pts</span>
              </div>
            </>
          )}

          <button className="btn-neon-cyan" onClick={onOpenBooking} style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            <Star size={14} />
            Book Slot
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', display: 'none' }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div style={{ background: '#0F172A', padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={() => { setActiveSection('stations'); setMobileMenuOpen(false); }} style={{ background: 'none', border: 'none', color: '#FFF', textAlign: 'left', padding: '8px', fontSize: '1rem' }}>
              🎮 Stations & Rates
            </button>
            <button onClick={() => { setActiveSection('loyalty'); setMobileMenuOpen(false); }} style={{ background: 'none', border: 'none', color: '#FFF', textAlign: 'left', padding: '8px', fontSize: '1rem' }}>
              🏆 Rewards Pass ({activePointsBalance} pts)
            </button>
            <button onClick={() => { setActiveSection('games'); setMobileMenuOpen(false); }} style={{ background: 'none', border: 'none', color: '#FFF', textAlign: 'left', padding: '8px', fontSize: '1rem' }}>
              🎯 Game Catalog
            </button>
            <button onClick={() => { setActiveSection('snacks'); setMobileMenuOpen(false); }} style={{ background: 'none', border: 'none', color: '#FFF', textAlign: 'left', padding: '8px', fontSize: '1rem' }}>
              🍿 Lounge Snack Menu
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
};
