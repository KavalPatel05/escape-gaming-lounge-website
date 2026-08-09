import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { StationType } from '../types';
import { Search, Flame } from 'lucide-react';

export const GameCatalog: React.FC = () => {
  const { games } = useApp();
  const [filterType, setFilterType] = useState<StationType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = games.filter((game) => {
    const matchesType = filterType === 'all' || game.stationType === filterType;
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.genre.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 className="font-cyber" style={{ fontSize: '1.8rem', color: '#FFF' }}>
            Featured Lounge Games
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
            Top titles pre-installed on high-refresh 4K displays & VR headsets
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input
              type="text"
              placeholder="Search title or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: '#0F172A',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                padding: '8px 12px 8px 36px',
                borderRadius: '10px',
                color: '#FFF',
                fontSize: '0.85rem',
                width: '200px',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', background: '#0F172A', padding: '4px', borderRadius: '10px' }}>
            {(['all', 'ps5', 'simracing', 'vr'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterType(cat)}
                style={{
                  background: filterType === cat ? 'linear-gradient(135deg, #7C3AED, #06B6D4)' : 'transparent',
                  color: '#FFF',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
        {filteredGames.map((game) => (
          <div key={game.id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
              <img
                src={game.image}
                alt={game.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
              />
              <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', color: '#F59E0B', fontWeight: 700 }}>
                {game.rating}
              </div>

              {game.isPopular && (
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'linear-gradient(90deg, #EC4899, #7C3AED)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.65rem', color: '#FFF', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Flame size={12} /> HOT TITLE
                </div>
              )}
            </div>

            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontSize: '1rem', color: '#FFF', fontWeight: 700, marginBottom: '4px' }}>
                  {game.name}
                </h4>
                <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{game.genre}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '0.7rem', color: '#06B6D4', textTransform: 'uppercase', fontWeight: 700, background: 'rgba(6,182,212,0.1)', padding: '3px 8px', borderRadius: '6px' }}>
                  {game.stationType.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 600 }}>Available to Play</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
