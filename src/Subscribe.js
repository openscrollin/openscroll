import React from 'react';
import { useNavigate } from 'react-router-dom';

function Subscribe() {
  const navigate = useNavigate();

  const handleSubscribe = () => {
    localStorage.setItem('subscribed', 'true');
    alert('Subscription successful! You can now access all articles.');
    navigate('/articles');
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    padding: '2rem',
    backgroundColor: '#f7f7f7'
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: '#007BFF'
  };

  const descriptionStyle = {
    fontSize: '1.2rem',
    color: '#555',
    marginBottom: '2rem'
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '1rem'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Subscribe Now</h2>
        <p style={descriptionStyle}>
          Get unlimited access to all premium articles. Subscribe now and start reading!
        </p>
        <button onClick={handleSubscribe} style={buttonStyle}>
          Subscribe for Free
        </button>
      </div>
    </div>
  );
}

export default Subscribe;
