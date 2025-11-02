import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  loading = false,
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          border: 'rgba(139, 0, 0, 0.5)',
          title: '#ff6b6b',
          message: 'rgba(255, 107, 107, 0.8)',
          confirmBg: 'rgba(139, 0, 0, 0.3)',
          confirmBorder: 'rgba(139, 0, 0, 0.6)'
        };
      case 'info':
        return {
          border: 'rgba(0, 100, 200, 0.5)',
          title: '#87CEEB',
          message: 'rgba(135, 206, 235, 0.8)',
          confirmBg: 'rgba(0, 100, 200, 0.3)',
          confirmBorder: 'rgba(0, 100, 200, 0.6)'
        };
      default:
        return {
          border: 'rgba(212, 175, 55, 0.5)',
          title: '#D4AF37',
          message: 'rgba(212, 175, 55, 0.8)',
          confirmBg: 'rgba(212, 175, 55, 0.3)',
          confirmBorder: 'rgba(212, 175, 55, 0.6)'
        };
    }
  };

  const colors = getColors();

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
      zIndex: 1001
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.95) 100%)',
        border: `2px solid ${colors.border}`,
        borderRadius: '12px',
        padding: '2rem',
        width: '90%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h3 style={{ 
            color: colors.title, 
            fontFamily: 'Cinzel, serif',
            fontSize: '1.2rem',
            marginBottom: '1rem'
          }}>
            {title}
          </h3>
          <p style={{ color: colors.message }}>
            {message}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={onCancel}
            className="rpg-button"
            style={{ 
              flex: 1,
              background: 'rgba(212, 175, 55, 0.2)',
              border: '2px solid rgba(212, 175, 55, 0.5)'
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rpg-button"
            style={{ 
              flex: 1,
              background: colors.confirmBg,
              border: `2px solid ${colors.confirmBorder}`
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="loading-spinner"></span>
                Processando...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;