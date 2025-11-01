import React from 'react';
import { useNavigate } from 'react-router-dom';

const RPGHeader: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.9) 100%)',
      backdropFilter: 'blur(10px)',
      border: 'none',
      borderBottom: '2px solid rgba(212, 175, 55, 0.3)',
      padding: '0.75rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      {/* Logo/Title */}
      <div 
        onClick={() => navigate('/dashboard')}
        style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '1.3rem',
          fontWeight: 700,
          color: '#D4AF37',
          cursor: 'pointer',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}
      >
        ⚔️ CONCLAVE
      </div>

      {/* User Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ 
          color: 'rgba(212, 175, 55, 0.7)', 
          fontSize: '0.9rem',
          fontFamily: 'Crimson Text, serif'
        }}>
        </span>
        
        <button
          onClick={() => navigate('/profile')}
          style={{
            background: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '6px',
            padding: '0.4rem 0.8rem',
            color: '#D4AF37',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: 'Cinzel, serif'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
            e.currentTarget.style.borderColor = '#D4AF37';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
          }}
        >
          👤 Perfil
        </button>

        <button
          onClick={handleLogout}
          style={{
            background: 'rgba(139, 0, 0, 0.2)',
            border: '1px solid rgba(139, 0, 0, 0.5)',
            borderRadius: '6px',
            padding: '0.4rem 0.8rem',
            color: '#ff6b6b',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: 'Cinzel, serif'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(139, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(139, 0, 0, 0.2)';
          }}
        >
          🚪 Sair
        </button>
      </div>
    </div>
  );
};

export default RPGHeader;