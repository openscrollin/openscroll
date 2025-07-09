import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReaderNavbar from '../ReaderNavbar';
import Loader from '../components/Loader';

function ReaderPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('openscroll_current_user'));
    if (!user || !user.email) {
      navigate('/login');
      return;
    }

    fetch(`http://localhost:5002/api/reader/purchases/${user.email}`)
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort(
          (a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt)
        );
        setPurchases(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching purchases:', err);
        setLoading(false);
      });
  }, [navigate]);

  const container = {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '6rem 1.5rem 3rem',
    fontFamily: "'Nunito Sans', sans-serif",
    minHeight: '100vh',
    backgroundColor: '#f9f9f7',
  };

  const heading = {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '2rem',
    color: '#1a1a1a',
    textAlign: 'left',
  };

  const card = {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  };

  const readBtn = {
    backgroundColor: '#2c2c2c',
    color: '#ffffff',
    padding: '0.6rem 1.1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.95rem',
    marginTop: '0.5rem',
  };

  const meta = {
    margin: '0.3rem 0',
    color: '#6b7280',
    fontSize: '0.9rem',
  };

  return (
    <>
      <ReaderNavbar />
      {loading ? (
        <Loader message="Loading purchases..." type="dashboard" />
      ) : (
        <div style={container}>
          <h2 style={heading}>Your Purchases</h2>

          {purchases.length === 0 ? (
            <p style={{ color: '#374151', fontSize: '1.1rem' }}>
              You haven't purchased any articles yet.
            </p>
          ) : (
            purchases.map((article) => (
              <div key={article._id} style={card}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem' }}>{article.title}</h3>
                  <p style={meta}>
                    Category: <strong>{article.category}</strong> | Price: ₹
                    {article.price === '0' ? 'Free' : article.price}
                  </p>
                  <p style={{ ...meta, fontSize: '0.85rem' }}>
                    Unlocked on: {new Date(article.unlockedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Link to={`/articles/${article._id}`}>
                    <button style={readBtn}>Read Again</button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}

export default ReaderPurchases;
