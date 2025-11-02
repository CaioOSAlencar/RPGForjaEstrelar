import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RPGBackground from '../components/RPGBackground';
import RPGHeader from '../components/RPGHeader';
import { campaignService, Campaign } from '../services/campaignService';

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const data = await campaignService.getAll();
      setCampaigns(data);
    } catch (err: any) {
      setError('Erro ao carregar campanhas');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rpg-container">
      <RPGHeader />
      <RPGBackground />
      
      <div className="rpg-card" style={{ maxWidth: '800px', marginTop: '70px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="rpg-title">
            🏰 CAMPANHAS
          </h1>
          <p className="rpg-subtitle">
            Suas aventuras épicas
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowCreateForm(true)}
            className="rpg-button"
            style={{ flex: 1, minWidth: '200px' }}
          >
            ✨ Nova Campanha
          </button>
          <button
            onClick={() => navigate('/campaigns/join')}
            className="rpg-button"
            style={{ 
              flex: 1, 
              minWidth: '200px',
              background: 'linear-gradient(135deg, #228B22 0%, #32CD32 100%)'
            }}
          >
            🚪 Entrar em Campanha
          </button>
        </div>

        {error && (
          <div className="rpg-error" style={{ marginBottom: '1rem' }}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <span className="loading-spinner"></span>
            <p style={{ color: 'rgba(212, 175, 55, 0.7)', marginTop: '1rem' }}>
              Carregando campanhas...
            </p>
          </div>
        ) : campaigns.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 1rem',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '8px',
            border: '2px dashed rgba(212, 175, 55, 0.3)'
          }}>
            <h3 style={{ 
              fontFamily: 'Cinzel, serif', 
              color: '#D4AF37', 
              marginBottom: '1rem',
              fontSize: '1.2rem'
            }}>
              📜 Nenhuma Campanha Encontrada
            </h3>
            <p style={{ color: 'rgba(212, 175, 55, 0.7)', marginBottom: '1.5rem' }}>
              Você ainda não participa de nenhuma aventura.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="rpg-button"
            >
              🎲 Criar Primeira Campanha
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                style={{
                  background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)',
                  border: '2px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#D4AF37';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onClick={() => navigate(`/campaigns/${campaign.id}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ 
                      fontFamily: 'Cinzel, serif', 
                      color: '#D4AF37', 
                      fontSize: '1.2rem',
                      marginBottom: '0.5rem'
                    }}>
                      {campaign.name}
                    </h3>
                    <p style={{ color: 'rgba(212, 175, 55, 0.8)', fontSize: '0.9rem' }}>
                      🎲 {campaign.system}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                      background: 'rgba(212, 175, 55, 0.2)',
                      color: '#D4AF37',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontFamily: 'Cinzel, serif'
                    }}>
                      #{campaign.roomCode}
                    </span>
                  </div>
                </div>
                
                {campaign.description && (
                  <p style={{ 
                    color: 'rgba(212, 175, 55, 0.6)', 
                    fontSize: '0.9rem',
                    marginBottom: '1rem',
                    lineHeight: '1.4'
                  }}>
                    {campaign.description}
                  </p>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(212, 175, 55, 0.5)', fontSize: '0.8rem' }}>
                    👑 Mestre: {campaign.master?.name || 'Desconhecido'}
                  </span>
                  <span style={{ color: 'rgba(212, 175, 55, 0.5)', fontSize: '0.8rem' }}>
                    📅 {new Date(campaign.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Form Modal */}
        {showCreateForm && (
          <CreateCampaignModal 
            onClose={() => setShowCreateForm(false)}
            onSuccess={() => {
              setShowCreateForm(false);
              loadCampaigns();
            }}
          />
        )}

        <div className="rpg-link">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
          >
            ← Voltar à Taverna
          </button>
        </div>
      </div>
    </div>
  );
};

interface CreateCampaignModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    system: 'D&D 5e',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await campaignService.create(formData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar campanha');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.95) 100%)',
        border: '2px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '12px',
        padding: '2rem',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="rpg-title" style={{ fontSize: '1.8rem' }}>
            ✨ NOVA CAMPANHA
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="rpg-form">
          <div className="rpg-field">
            <label className="rpg-label">Nome da Campanha</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="rpg-input"
              placeholder="Ex: A Maldição de Strahd"
              required
            />
          </div>

          <div className="rpg-field">
            <label className="rpg-label">Sistema de RPG</label>
            <select
              name="system"
              value={formData.system}
              onChange={handleChange}
              className="rpg-input"
              required
            >
              <option value="D&D 5e">D&D 5e</option>
              <option value="Pathfinder">Pathfinder</option>
              <option value="Call of Cthulhu">Call of Cthulhu</option>
              <option value="Vampire">Vampire: The Masquerade</option>
              <option value="Tormenta20">Tormenta20</option>
              <option value="3D&T">3D&T</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="rpg-field">
            <label className="rpg-label">Descrição (Opcional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="rpg-input"
              placeholder="Descreva sua campanha..."
              rows={3}
              style={{ resize: 'vertical', minHeight: '80px' }}
            />
          </div>

          {error && (
            <div className="rpg-error">
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="rpg-button"
              style={{ 
                flex: 1,
                background: 'rgba(139, 0, 0, 0.2)',
                border: '2px solid rgba(139, 0, 0, 0.5)'
              }}
            >
              ❌ Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rpg-button"
              style={{ flex: 1 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="loading-spinner"></span>
                  Criando...
                </span>
              ) : (
                '🎲 Criar Campanha'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Campaigns;