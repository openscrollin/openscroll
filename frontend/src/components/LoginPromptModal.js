import React from 'react';
import { useNavigate } from 'react-router-dom';

const backdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999,
};

const modalStyle = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '16px',
  maxWidth: '560px',
  width: '90%',
  textAlign: 'center',
  position: 'relative',
  boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
  fontFamily: "'Nunito Sans', sans-serif",
};

const closeBtn = {
  position: 'absolute',
  top: '0.8rem',
  right: '1rem',
  background: 'transparent',
  border: 'none',
  fontSize: '1.2rem',
  cursor: 'pointer',
  color: '#333',
};

const heading = {
  fontSize: '1.5rem',
  fontWeight: 700,
  marginBottom: '1rem',
  color: '#111827',
};

const message = {
  fontSize: '1rem',
  color: '#4b5563',
  marginBottom: '1.5rem',
};

const loginBtn = {
  padding: '0.7rem 1.4rem',
  backgroundColor: '#2c2c2c',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: '1rem',
};

const adBox = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '1rem',
  textAlign: 'left',
  marginBottom: '1.5rem'
};

const adTitle = {
  fontWeight: 700,
  fontSize: '1.1rem',
  marginBottom: '0.4rem',
  color: '#111827',
};

const adSummary = {
  fontSize: '0.95rem',
  color: '#4b5563',
  marginBottom: '0.5rem',
};

const adPrice = {
  fontSize: '0.9rem',
  fontWeight: 600,
  color: '#2c2c2c',
};

function LoginPromoModal({ onClose, adArticle }) {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
    onClose();
  };

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtn} onClick={onClose}>✖️</button>
        <div style={heading}>Log in to unlock articles</div>
        <p style={message}>Explore exclusive reads and save your favorites when you're signed in.</p>

        {adArticle && (
          <div style={adBox}>
            <div style={adTitle}>{adArticle.title}</div>
            <div style={adSummary}>{adArticle.summary}</div>
            <div style={adPrice}>₹{adArticle.price}</div>
          </div>
        )}

        <button style={loginBtn} onClick={handleLoginClick}>Log In</button>
      </div>
    </div>
  );
}

export default LoginPromoModal;
