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
        const response = await fetch('http://localhost:5002/api/articles/public');
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

  const container = {
    minHeight: '100vh',
    backgroundColor: '#f9f9f7',
    fontFamily: "'Nunito Sans', sans-serif",
    padding: '6rem 1.5rem 3rem',
    maxWidth: '960px',
    margin: '0 auto',
  };

  const heading = {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '2rem',
    color: '#1a1a1a',
  };

  const statsGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  };

  const statCard = {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
    textAlign: 'center',
  };

  const statValue = {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#2c2c2c',
  };

  const statLabel = {
    fontSize: '1rem',
    color: '#6b7280',
    marginTop: '0.5rem',
  };

  const articleCard = {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    marginBottom: '1.2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const readButton = {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    cursor: 'pointer',
  };

  return (
    <>
      <ReaderNavbar />
      <div style={container}>
        <h2 style={heading}>Reader Dashboard</h2>

        <div style={statsGrid}>
          <div style={statCard}>
            <div style={statValue}>{unlockedList.length}</div>
            <div style={statLabel}>Articles Unlocked</div>
          </div>
          <div style={statCard}>
            <div style={statValue}>₹ {totalSpent}</div>
            <div style={statLabel}>Total Spent</div>
          </div>
        </div>

        <h3 style={{ ...heading, fontSize: '1.5rem', marginBottom: '1.5rem' }}>Recently Unlocked</h3>

        {unlockedList.length === 0 ? (
          <p style={{ color: '#6b7280' }}>You haven't unlocked any articles yet.</p>
        ) : (
          unlockedList.map(article => (
            <div key={article._id} style={articleCard}>
              <div>
                <div style={{ fontWeight: '600' }}>{article.title}</div>
                <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>{article.category}</div>
              </div>
              <button style={readButton} onClick={() => navigate(`/articles/${article._id}`)}>
                Read Again
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default ReaderDashboard;
