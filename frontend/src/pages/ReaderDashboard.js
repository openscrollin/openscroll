import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReaderNavbar from '../ReaderNavbar';

function ReaderDashboard() {
  const navigate = useNavigate();
  const [unlockedArticles, setUnlockedArticles] = useState([]);
  const [articlesData, setArticlesData] = useState([]);

  useEffect(() => {
    const unlocked = JSON.parse(localStorage.getItem('openscroll_unlocked_articles')) || [];
    setUnlockedArticles(unlocked);
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('https://openscroll-backend.onrender.com/api/articles/public');
        const data = await response.json();
        setArticlesData(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  const unlockedList = articlesData.filter(article =>
    unlockedArticles.includes(article._id)
  );

  const totalSpent = unlockedList.reduce((sum, a) => {
    const price = parseFloat(a.price);
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  return (
    <>
      <ReaderNavbar />
      <div style={{ padding: '5rem 2rem 2rem 2rem', minHeight: '100vh', background: '#0f0f0f', fontFamily: "'Nunito Sans', sans-serif" }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
              Reader Dashboard
            </h1>
            <p style={{ color: '#d0f330', opacity: 0.7, fontFamily: 'monospace', fontWeight: 600, letterSpacing: 2 }}>
              DISCOVER.READ.EXPLORE
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <GlassCard>
            <div style={iconCircle('#38bdf8')}>
              <span style={{ fontSize: 24 }}>📚</span>
            </div>
            <div style={statValue}>{unlockedList.length}</div>
            <div style={statLabel}>Articles Unlocked</div>
          </GlassCard>

          <GlassCard>
            <div style={iconCircle('#facc15')}>
              <span style={{ fontSize: 24 }}>💰</span>
            </div>
            <div style={statValue}>₹ {totalSpent}</div>
            <div style={statLabel}>Total Spent</div>
          </GlassCard>
        </div>

        {/* Recently Unlocked */}
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#ffffff', marginBottom: '1.5rem' }}>Recently Unlocked</h3>

        {unlockedList.length === 0 ? (
          <p style={{ color: '#999999' }}>You haven't unlocked any articles yet.</p>
        ) : (
          unlockedList.map(article => (
            <div key={article._id} style={articleCard}>
              <div>
                <div style={{ fontWeight: '600', color: '#ffffff' }}>{article.title}</div>
                <div style={{ color: '#cccccc', fontSize: '0.9rem' }}>{article.category}</div>
              </div>
              <button
                className="read-again-btn"
                style={readButton}
                onClick={() => navigate(`/articles/${article._id}`)}
              >
                Read Again
              </button>
            </div>
          ))
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0% { text-shadow: 0 0 8px #d0f33055; }
          100% { text-shadow: 0 0 24px #d0f330; }
        }
        @media (max-width: 600px) {
          .read-again-btn {
            font-size: 0.9rem !important;
            padding: 0.5rem 0.9rem !important;
          }
        }
      `}</style>
    </>
  );
}

// Local GlassCard component
function GlassCard({ children, style }) {
  return (
    <div
      style={{
        background: 'rgba(24,26,19,0.85)',
        borderRadius: 16,
        boxShadow: '0 4px 32px #ffffff11',
        border: '1.5px solid #ffffff22',
        padding: 24,
        textAlign: 'center',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const iconCircle = (color) => ({
  width: 44,
  height: 44,
  borderRadius: 12,
  background: color + '22',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 10px',
  border: `1.5px solid ${color}55`,
  boxShadow: `0 0 12px ${color}33`,
});

const statValue = {
  fontSize: '2rem',
  fontWeight: '700',
  color: '#ffffff',
};

const statLabel = {
  fontSize: '1rem',
  color: '#cccccc',
  marginTop: '0.5rem',
};

const articleCard = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  padding: '1.5rem',
  marginBottom: '1.2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 0 12px rgba(255,255,255,0.05)',
};

const readButton = {
  backgroundColor: '#E40B6F',
  color: 'white',
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '8px',
  fontSize: '0.95rem',
  cursor: 'pointer',
  boxShadow: '0 0 10px rgba(228, 11, 111, 0.5)',
};

export default ReaderDashboard;
