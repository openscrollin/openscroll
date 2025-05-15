import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PaymentSuccess() {
  const navigate = useNavigate();
  const [articleId, setArticleId] = useState(null);

  useEffect(() => {
    const pendingId = localStorage.getItem('pending_article_id');
    setArticleId(pendingId);

    // Remove from localStorage so it doesn't persist across reloads
    localStorage.removeItem('pending_article_id');
  }, []);

  const handleReadNow = () => {
    if (articleId) {
      navigate(`/articles/${articleId}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🎉 Payment Successful!</h2>
        <p style={styles.message}>You’ve unlocked this article. Thank you for supporting the writer.</p>
        <button onClick={handleReadNow} style={styles.button}>
          Read Now
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    fontFamily: "'Nunito Sans', sans-serif",
  },
  card: {
    background: 'white',
    padding: '2rem 3rem',
    borderRadius: '16px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
    color: '#10b981',
  },
  message: {
    fontSize: '1.1rem',
    marginBottom: '1.5rem',
    color: '#4b5563',
  },
  button: {
    backgroundColor: '#10b981',
    color: 'white',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

export default PaymentSuccess;
