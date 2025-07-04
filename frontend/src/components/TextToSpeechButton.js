import React, { useState, useEffect } from 'react';
import { getSpeechFromText } from '../utils/textToSpeech';

const glassButtonStyle = {
  padding: '10px 20px',
  background: '#ffff', // White background
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  color: '#111', // Black text
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '12px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background 0.3s ease, color 0.3s ease, transform 0.2s ease', // Added transform to transition
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
};

const glassButtonHoverStyle = {
  background: '#bde32c', // Yellow on hover
  color: '#111', // Keep text black on hover
  transform: 'scale(1.03)', // Slight scale effect on hover
};

const modalOverlayBase = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  opacity: 0,
  pointerEvents: 'none',
  transition: 'opacity 0.3s ease',
};

const modalBoxBase = {
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  padding: '2rem',
  borderRadius: '16px',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
  maxWidth: '400px',
  width: '90%',
  textAlign: 'center',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  transform: 'scale(0.95)',
  opacity: 0,
  transition: 'all 0.3s ease',
};

const TextToSpeechButton = ({ text }) => {
  const [language, setLanguage] = useState('en');
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (showModal) {
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
    }
  }, [showModal]);

  const handleSpeak = async () => {
    setLoading(true);
    const audioBlob = await getSpeechFromText(text, language);
    setLoading(false);
    setShowModal(false);

    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    }
  };

  return (
    <div style={{ margin: '1rem 0', display: 'flex', justifyContent: 'flex-end' }}>
      <button
        onClick={() => setShowModal(true)}
        style={glassButtonStyle}
        onMouseOver={(e) => Object.assign(e.target.style, glassButtonHoverStyle)}
        onMouseOut={(e) => Object.assign(e.target.style, glassButtonStyle)}
      >
        Listen
      </button>

      {showModal && (
        <div
          style={{
            ...modalOverlayBase,
            opacity: animate ? 1 : 0,
            pointerEvents: animate ? 'auto' : 'none',
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              ...modalBoxBase,
              opacity: animate ? 1 : 0,
              transform: animate ? 'scale(1)' : 'scale(0.95)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: '1rem', color: '#111' }}>Select Language</h3>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                padding: '0.6rem',
                borderRadius: '8px',
                fontWeight: '500',
                width: '100%',
                marginBottom: '1.5rem',
                border: '1px solid #ccc',
              }}
            >
              <option value="en">English</option>
              <option value="hi">Hindi (Beta)</option>
            </select>

            <button
              onClick={handleSpeak}
              disabled={loading}
              style={glassButtonStyle} // Apply the same style to the Generate Audio button
              onMouseOver={(e) => Object.assign(e.target.style, glassButtonHoverStyle)}
              onMouseOut={(e) => Object.assign(e.target.style, glassButtonStyle)}
            >
              {loading ? 'Loading audio...' : 'Generate Audio'}
            </button>
          </div>
        </div>
      )}

      {audioUrl && (
        <audio
          src={audioUrl}
          controls
          autoPlay
          style={{ display: 'block', marginTop: '1rem', width: '100%' }}
        />
      )}
    </div>
  );
};

export default TextToSpeechButton;