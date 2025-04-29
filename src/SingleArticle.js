import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function SingleArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [unlockedArticles, setUnlockedArticles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      const response = await fetch('/api/getArticles');
      const data = await response.json();
      setArticle(data.articles[id]);
    }

    fetchArticle();

    const currentUser = JSON.parse(localStorage.getItem('openscroll_current_user'));
    if (currentUser) {
      setUserLoggedIn(true);
      setUserEmail(currentUser.email);
      fetchUnlocked(currentUser.email);
    }
  }, [id]);

  const fetchUnlocked = async (email) => {
    try {
      const response = await fetch('/api/getProfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: email }),
      });
      const result = await response.json();
      setUnlockedArticles(result.unlockedArticles.map((a) => a._id));
    } catch (error) {
      console.error(error);
    }
  };

  if (!article) {
    return <p style={{ padding: '2rem' }}>Loading...</p>;
  }

  const container = {
    minHeight: '100vh',
    backgroundColor: '#f9f9f7',
    fontFamily: "'Nunito Sans', sans-serif",
    padding: '2rem',
    marginTop: '5rem',
    position: 'relative',
  };

  const image = {
    width: '100%',
    maxHeight: '400px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '2rem',
  };

  const title = {
    fontSize: '2.2rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: '#1a1a1a',
  };

  const body = {
    fontSize: '1rem',
    color: '#333',
    lineHeight: '1.6',
  };

  const button = {
    marginTop: '2rem',
    padding: '0.8rem 1.5rem',
    backgroundColor: unlocking ? '#10b981' : '#2c2c2c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const modalOverlay = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalContent = {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center',
    fontFamily: "'Nunito Sans', sans-serif",
  };

  const isPaid = article.price !== '0';
  const isUnlocked = unlockedArticles.includes(article._id);

  const shortBody = article.body.slice(0, 300);

  const handleSubscribe = () => {
    if (!userLoggedIn) {
      navigate('/login');
    } else {
      setShowModal(true);
    }
  };

  const handleConfirmUnlock = async () => {
    try {
      const response = await fetch('/api/unlockArticle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail, articleId: article._id }),
      });

      const result = await response.json();
      if (response.ok) {
        setUnlocking(true);
        setShowModal(false);
        setUnlockedArticles((prev) => [...prev, article._id]);
        setTimeout(() => {
          setUnlocking(false);
          alert('Article unlocked! Enjoy reading.');
        }, 1000);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={container}>
      <img src={article.coverImage || 'https://via.placeholder.com/800x400?text=OpenScroll+Cover'} alt="cover" style={image} />
      <h1 style={title}>{article.title}</h1>

      <div style={body}>
        {(!isPaid || (isPaid && (userLoggedIn && isUnlocked))) ? (
          <>
            {article.body}
          </>
        ) : (
          <>
            {shortBody}...
            <div>
              <button style={button} onClick={handleSubscribe}>
                {unlocking ? 'Unlocked 🎉' : userLoggedIn ? `Unlock for ₹${article.price}` : 'Login to Continue'}
              </button>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h2>Confirm Unlock</h2>
            <p>Unlock this article for ₹{article.price}?</p>
            <button style={{ ...button, marginTop: '1rem' }} onClick={handleConfirmUnlock}>Confirm</button>
            <button
              style={{ ...button, marginTop: '1rem', backgroundColor: '#e5e7eb', color: '#111827' }}
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SingleArticle;
