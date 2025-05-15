import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import LoginPromptModal from './components/LoginPromptModal';

function ArticleCard({ article }) {
  const navigate = useNavigate();
  const [unlockedArticles, setUnlockedArticles] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const unlocked = JSON.parse(localStorage.getItem('openscroll_unlocked_articles')) || [];
    setUnlockedArticles(unlocked);

    const favs = JSON.parse(localStorage.getItem('openscroll_favorite_articles')) || [];
    setFavorites(favs);
  }, []);

  const currentUser = JSON.parse(localStorage.getItem('openscroll_current_user'));
  const isUnlocked =
    currentUser && (article.price === '0' || unlockedArticles.includes(article._id));
  const isFavorited = favorites.includes(article._id);

  const handleRead = () => navigate(`/articles/${article._id}`);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    const updated = isFavorited
      ? favorites.filter((id) => id !== article._id)
      : [...favorites, article._id];

    setFavorites(updated);
    localStorage.setItem('openscroll_favorite_articles', JSON.stringify(updated));
  };

  const card = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
    fontFamily: "'Nunito Sans', sans-serif",
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    border: '1px solid #f3f4f6',
    position: 'relative',
  };

  const imageWrapper = {
    position: 'relative',
    overflow: 'hidden',
    height: '200px',
  };

  const image = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.35s ease-in-out',
  };

  const content = {
    padding: '1.25rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  };

  const title = {
    fontSize: '1.125rem',
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: '0.1rem',
    lineHeight: '1.4',
  };

  const badgeRow = {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const badge = {
    backgroundColor: article.price === '0' ? '#d1fae5' : '#fef3c7',
    color: article.price === '0' ? '#065f46' : '#92400e',
    padding: '0.3rem 0.8rem',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: 600,
  };

  const categoryTag = {
    backgroundColor: '#eef2ff',
    color: '#4338ca',
    padding: '0.3rem 0.8rem',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: 600,
  };

  const author = {
    fontSize: '0.85rem',
    color: '#6b7280',
    textDecoration: 'none',
    marginTop: '0.2rem',
  };

  const unlockedTag = {
    position: 'absolute',
    top: '0.75rem',
    left: '0.75rem',
    backgroundColor: 'black',
    color: '#fff',
    fontSize: '0.7rem',
    padding: '0.3rem 0.7rem',
    borderRadius: '999px',
    fontWeight: 600,
    boxShadow: '0 0 12px rgba(255, 255, 255, 0.9)',
  };

  const heartIcon = {
    position: 'absolute',
    top: '0.75rem',
    right: '0.75rem',
    cursor: 'pointer',
    zIndex: 2,
    fontSize: '1.3rem',
    color: isFavorited ? '#d0f330' : '#d1d5db',
    filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))',
    outline: 'none',
  };

  const button = {
    marginTop: 'auto',
    padding: '0.7rem 1rem',
    backgroundColor: '#d0f330',
    color: 'black',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: 700,
    width: '100%',
    textAlign: 'center',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    outline: 'none',
    appearance: 'none',
    cursor: 'pointer',
  };

  return (
    <>
      <div
        style={card}
        onMouseEnter={(e) => {
          const img = e.currentTarget.querySelector('img');
          img.style.transform = 'scale(1.05)';
          e.currentTarget.style.transform = 'translateY(-6px)';
          e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.08)';
        }}
        onMouseLeave={(e) => {
          const img = e.currentTarget.querySelector('img');
          img.style.transform = 'scale(1)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.06)';
        }}
      >
        <div style={imageWrapper}>
          <img
            src={article.coverImage || 'https://via.placeholder.com/800x400?text=OpenScroll+Cover'}
            alt="cover"
            style={image}
          />
          {isUnlocked && <div style={unlockedTag}>Unlocked</div>}
          <div style={heartIcon} onClick={toggleFavorite}>
            {isFavorited ? <FaHeart size={20} color="#d0f330" /> : <FaRegHeart size={20} color="#d1d5db" />}
          </div>
        </div>

        <div style={content} title={article.shortDesc}>
          <div style={title}>{article.title}</div>

          {article.shortDesc && (
            <div style={{ fontSize: '0.9rem', color: '#4b5563' }}>
              {article.shortDesc}
            </div>
          )}

          {(article.authorfullName || article.authorEmail) && (
            <Link
              to={`/writers/${encodeURIComponent(article.authorEmail || '')}`}
              style={author}
              onClick={(e) => e.stopPropagation()}
            >
              By {article.authorfullName || article.authorEmail}
            </Link>
          )}

          <div style={badgeRow}>
            <span style={badge}>{article.price === '0' ? 'Free' : `₹${article.price}`}</span>
            {article.category && <span style={categoryTag}>{article.category}</span>}
          </div>

          <div
            style={button}
            onClick={handleRead}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Read Now
          </div>
        </div>
      </div>

      {showLoginModal && <LoginPromptModal onClose={() => setShowLoginModal(false)} />}
    </>
  );
}

export default ArticleCard;
