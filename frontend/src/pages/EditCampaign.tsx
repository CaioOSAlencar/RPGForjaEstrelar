import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RPGBackground from '../components/RPGBackground';
import RPGHeader from '../components/RPGHeader';
import { campaignService, Campaign } from '../services/campaignService';

const EditCampaign: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    system: ''
  });

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      loadCampaign();
    } else if (id) {
      setError('ID da campanha inválido');
      setLoading(false);
    }
  }, [id]);

  const loadCampaign = async () => {
    if (!id || isNaN(Number(id))) {
      setError('ID da campanha inválido');
      return;
    }
    
    try {
      setLoading(true);
      const campaignData = await campaignService.getById(Number(id));
      setCampaign(campaignData);
      setFormData({
        name: campaignData.name,
        description: campaignData.description || '',
        system: campaignData.system
      });
    } catch (err: any) {
      setError('Erro ao carregar campanha');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!id || isNaN(Number(id))) {
      setError('ID da campanha inválido');
      setSaving(false);
      return;
    }
    
    try {
      await campaignService.update(Number(id), formData);
      navigate(`/campaigns/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar campanha');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rpg-container">
        <RPGHeader />
        <RPGBackground />
        <div className="rpg-card" style={{ marginTop: '70px', textAlign: 'center' }}>
          <span className="loading-spinner"></span>
          <p style={{ color: 'rgba(212, 175, 55, 0.7)', marginTop: '1rem' }}>
            Carregando campanha...
          </p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="rpg-container">
        <RPGHeader />
        <RPGBackground />
        <div className="rpg-card" style={{ marginTop: '70px' }}>
          <div className="rpg-error">
            ⚠️ Campanha não encontrada
          </div>
          <div className="rpg-link">
            <button onClick={() => navigate('/campaigns')}>
              ← Voltar às Campanhas
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rpg-container">
      <RPGHeader />
      <RPGBackground />
      
      <div className="rpg-card" style={{ maxWidth: '600px', marginTop: '70px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="rpg-title">
            ✏️ EDITAR CAMPANHA
          </h1>
          <p className="rpg-subtitle">
            Atualize as informações da sua campanha
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rpg-form">
          <div className="rpg-field">
            <label className="rpg-label">Nome da Campanha</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="rpg-input"
              placeholder="Ex: A Lenda dos Heróis Perdidos"
              required
            />
          </div>

          <div className="rpg-field">
            <label className="rpg-label">Sistema de RPG</label>
            <select
              value={formData.system}
              onChange={(e) => setFormData({ ...formData, system: e.target.value })}
              className="rpg-input"
              required
            >
              <option value="">Selecione um sistema</option>
              <option value="D&D 5e">D&D 5e</option>
              <option value="Pathfinder">Pathfinder</option>
              <option value="Call of Cthulhu">Call of Cthulhu</option>
              <option value="Vampire: The Masquerade">Vampire: The Masquerade</option>
              <option value="World of Darkness">World of Darkness</option>
              <option value="GURPS">GURPS</option>
              <option value="Savage Worlds">Savage Worlds</option>
              <option value="Fate Core">Fate Core</option>
              <option value="Cyberpunk 2020">Cyberpunk 2020</option>
              <option value="Shadowrun">Shadowrun</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="rpg-field">
            <label className="rpg-label">Descrição (Opcional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="rpg-input"
              placeholder="Descreva sua campanha, o cenário, a história..."
              rows={4}
              style={{ resize: 'vertical', minHeight: '100px' }}
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
              onClick={() => navigate(`/campaigns/${id}`)}
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
              disabled={saving}
              className="rpg-button"
              style={{ flex: 1 }}
            >
              {saving ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="loading-spinner"></span>
                  Salvando...
                </span>
              ) : (
                '💾 Salvar Alterações'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCampaign;