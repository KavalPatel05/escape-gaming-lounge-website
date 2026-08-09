import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Plus, Check } from 'lucide-react';
import { formatINR } from '../utils/pricing';

export const SnackMenu: React.FC = () => {
  const { snacks } = useApp();
  const [addedItems, setAddedItems] = useState<Record<string, number>>({});

  const handleAddItem = (id: string) => {
    setAddedItems((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 className="font-cyber" style={{ fontSize: '1.8rem', color: '#FFF' }}>
            Gamer Snack & Refreshment Lounge
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
            Fuel your gaming sessions with cold brews, energy drinks & hot loaded snacks
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {snacks.map((snack) => {
          const count = addedItems[snack.id] || 0;

          return (
            <div key={snack.id} className="glass-card" style={{ overflow: 'hidden', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ height: '140px', borderRadius: '10px', overflow: 'hidden', marginBottom: '12px', position: 'relative' }}>
                <img src={snack.image} alt={snack.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {snack.isHot && (
                  <span style={{ position: 'absolute', top: '8px', right: '8px', background: '#DC2626', color: '#FFF', fontSize: '0.65rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Flame size={12} /> TOP SELLER
                  </span>
                )}
              </div>

              <div>
                <h4 style={{ fontSize: '0.95rem', color: '#FFF', fontWeight: 700, marginBottom: '4px' }}>
                  {snack.name}
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase' }}>
                  {snack.category}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <div className="font-cyber" style={{ fontSize: '1.2rem', color: '#06B6D4', fontWeight: 800 }}>
                  {formatINR(snack.price)}
                </div>

                <button
                  type="button"
                  onClick={() => handleAddItem(snack.id)}
                  style={{
                    background: count > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                    border: count > 0 ? '1px solid #10B981' : '1px solid #8B5CF6',
                    color: count > 0 ? '#34D399' : '#FFF',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {count > 0 ? <Check size={14} /> : <Plus size={14} />}
                  {count > 0 ? `Added (${count})` : 'Add to Bill'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
