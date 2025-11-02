import React from 'react';
import { useNavigate } from 'react-router-dom';
import RPGBackground from '../components/RPGBackground';
import RPGHeader from '../components/RPGHeader';
import { getUserFromStorage } from '../utils/localStorage';

const Dashboard: React.FC = () => {
  const user = getUserFromStorage();
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <RPGHeader />
      <RPGBackground />
      
      <div className="dashboard-content" style={{ marginTop: '70px' }}>
        <div className="dashboard-header">
          <h1 className="rpg-title">
            🏰 CONCLAVE
          </h1>
          <p className="rpg-subtitle">
            Bem-vindo, {user.name}! 🎭
          </p>
        </div>

        <div className="rpg-card" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'Cinzel, serif', color: '#D4AF37', marginBottom: '1rem' }}>
            🚧 Em Construção 🚧
          </h2>
          <p style={{ color: 'rgba(212, 175, 55, 0.7)', marginBottom: '2rem' }}>
            A taverna está sendo preparada para receber os aventureiros...
          </p>
          
          <div className="dashboard-grid">
            <div 
              className="dashboard-card"
              onClick={() => navigate('/campaigns')}
              style={{ cursor: 'pointer', opacity: 1 }}
            >
              <h3 style={{ fontFamily: 'Cinzel, serif', color: '#D4AF37', marginBottom: '0.5rem' }}>📜 Campanhas</h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(212, 175, 55, 0.8)' }}>Clique para acessar</p>
            </div>
            
            <div className="dashboard-card">
              <h3 style={{ fontFamily: 'Cinzel, serif', color: '#D4AF37', marginBottom: '0.5rem' }}>🗺️ Mapas</h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(212, 175, 55, 0.6)' }}>Em breve...</p>
            </div>
            
            <div className="dashboard-card">
              <h3 style={{ fontFamily: 'Cinzel, serif', color: '#D4AF37', marginBottom: '0.5rem' }}>🎭 Personagens</h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(212, 175, 55, 0.6)' }}>Em breve...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;