import React from 'react';
import { useApp } from '../context/AppContext';
import { PricingCalculator } from '../components/PricingCalculator';
import { LoyaltyCard } from '../components/LoyaltyCard';
import { GameCatalog } from '../components/GameCatalog';
import { SnackMenu } from '../components/SnackMenu';
import type { StationType, SimMode } from '../types';
import { Gamepad2, Compass, Sparkles, Star, MapPin, Clock, Phone, Award } from 'lucide-react';

interface CustomerViewProps {
  onOpenBooking: (params?: { stationType: StationType; simMode?: SimMode; durationMinutes?: number }) => void;
  activeSection: string;
}

export const CustomerView: React.FC<CustomerViewProps> = ({ onOpenBooking }) => {
  const { stations } = useApp();

  return (
    <div style={{ paddingBottom: '60px' }}>
      
      {/* Hero Section */}
      <section style={{ padding: '70px 0 40px 0', textAlign: 'center', position: 'relative' }}>
        <div className="container-custom">
          <h1 className="font-brand-hero" style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', fontWeight: 700, lineHeight: '1.15', marginBottom: '8px' }}>
            <span className="hero-gradient-text">Escape the Ordinary.</span>
          </h1>
          <h1 className="font-brand-hero" style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>
            Play Better.
          </h1>

          <p style={{ maxWidth: '640px', margin: '0 auto 28px auto', color: '#9CA3AF', fontSize: '1.1rem', fontWeight: 400 }}>
            Premium console gaming • Immersive VR • Racing simulators
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <a href="#rates" className="btn-pill-purple" style={{ textDecoration: 'none' }}>
              View Pricing
            </a>
            <button className="btn-neon-purple" onClick={() => onOpenBooking()}>
              <Star size={16} /> Pre-Book Slot
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', fontSize: '0.75rem', color: '#6B7280', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>📍 SHOP NO 13 B WING DATTANI L D</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>📞 +91 88550 84065</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '48px' }}>
            <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
              <Gamepad2 size={28} color="#8B5CF6" style={{ margin: '0 auto 8px auto' }} />
              <div className="font-cyber" style={{ fontSize: '1.2rem', color: '#FFF' }}>2x PS5 Consoles</div>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>1-4 Controllers (₹100-₹170/h)</div>
            </div>

            <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
              <Compass size={28} color="#06B6D4" style={{ margin: '0 auto 8px auto' }} />
              <div className="font-cyber" style={{ fontSize: '1.2rem', color: '#FFF' }}>1x PS5 + SimRacing Rig</div>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>PS5 Gaming & Immersive Motion Sim</div>
            </div>

            <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
              <Sparkles size={28} color="#EC4899" style={{ margin: '0 auto 8px auto' }} />
              <div className="font-cyber" style={{ fontSize: '1.2rem', color: '#FFF' }}>1x VR Arena</div>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Meta Quest 3 & PS VR2</div>
            </div>

            <div className="glass-card glass-card-green" style={{ padding: '16px', textAlign: 'center' }}>
              <Award size={28} color="#10B981" style={{ margin: '0 auto 8px auto' }} />
              <div className="font-cyber" style={{ fontSize: '1.2rem', color: '#34D399' }}>Reward Pass</div>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>10 Pts = 1 Hr Free (Mon-Fri)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stations Showcase Section */}
      <section id="stations" style={{ padding: '40px 0' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 className="font-cyber" style={{ fontSize: '2rem', color: '#FFF' }}>
              Our Gaming Hardware & Live Availability
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
              Real-time status of all 4 lounge stations
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {stations.map((st) => (
              <div key={st.id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', height: '180px' }}>
                  <img src={st.image} alt={st.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    {st.status === 'available' ? (
                      <span className="badge-available" style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="pulse-dot pulse-dot-green"></span> AVAILABLE
                      </span>
                    ) : (
                      <span className="badge-in-use" style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="pulse-dot pulse-dot-red"></span> IN SESSION
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: '#FFF', fontWeight: 700, marginBottom: '6px' }}>
                      {st.name}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#9CA3AF', lineHeight: '1.5', marginBottom: '14px' }}>
                      {st.description}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {st.specs.map((sp, idx) => (
                        <span key={idx} style={{ background: 'rgba(255,255,255,0.06)', color: '#D1D5DB', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem' }}>
                          ✓ {sp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#06B6D4', fontWeight: 700 }}>
                      {st.type === 'ps5' ? '₹100 (1-2P) / ₹170 (3-4P)' : st.type === 'vr' ? '₹150 (30m) / ₹250 (1h)' : '₹150-₹300'}
                    </div>

                    <button
                      className="btn-neon-cyan"
                      onClick={() => onOpenBooking({ stationType: st.type })}
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    >
                      Book Station
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Calculator Section */}
      <section id="rates" style={{ padding: '40px 0' }}>
        <div className="container-custom">
          <PricingCalculator onBookNow={onOpenBooking} />
        </div>
      </section>

      {/* Loyalty Pass & Rewards Section */}
      <section id="loyalty" style={{ padding: '40px 0' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 className="font-cyber" style={{ fontSize: '2rem', color: '#FFF' }}>
              Your Loyalty & Reward Pass
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
              1 Hr Paid Gaming = 1 Point. Points expire 30 days after assignment!
            </p>
          </div>

          <LoyaltyCard />
        </div>
      </section>

      {/* Game Catalog Section */}
      <section id="games" style={{ padding: '40px 0' }}>
        <div className="container-custom">
          <GameCatalog />
        </div>
      </section>

      {/* Snack Lounge Section */}
      <section id="snacks" style={{ padding: '40px 0' }}>
        <div className="container-custom">
          <SnackMenu />
        </div>
      </section>

      {/* Footer Info */}
      <footer style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container-custom" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
          <div>
            <div className="font-cyber" style={{ fontSize: '1.3rem', color: '#FFF', marginBottom: '12px' }}>
              ESCAPE GAMING LOUNGE
            </div>
            <p style={{ fontSize: '0.8rem', color: '#9CA3AF', lineHeight: '1.6' }}>
              Inspired by escapegaminglounge.com. The ultimate third space for console, simracing & VR gamers.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#FFF', marginBottom: '12px' }}>Location & Hours</h4>
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} color="#06B6D4" /> Escape Gaming Lounge, FC Road, Pune</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={16} color="#8B5CF6" /> Open Daily: 11:00 AM - 11:00 PM</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={16} color="#10B981" /> +91 98765 43210</div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#FFF', marginBottom: '12px' }}>Transparent Rates</h4>
            <ul style={{ fontSize: '0.8rem', color: '#9CA3AF', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>• PS5 (1-2 controllers): ₹100 / hr</li>
              <li>• PS5 (3-4 controllers): ₹170 / hr</li>
              <li>• Extra person fee: ₹30 / person</li>
              <li>• VR: ₹150 (30m) / ₹250 (1h)</li>
              <li>• SimRacing: ₹150-₹250 (Std) | ₹200-₹300 (Immersive)</li>
            </ul>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#6B7280', marginTop: '32px', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          © 2026 Escape Gaming Lounge. All Rights Reserved. Mobile Compatible & PWA Ready.
        </div>
      </footer>

    </div>
  );
};
