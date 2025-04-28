import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ArticleCard({ article, index }) {
  const [unlockedArticles, setUnlockedArticles] = useState([]);

  useEffect(() => {
    const unlocked = JSON.parse(localStorage.getItem('openscroll_unlocked_articles')) || [];
    setUnlockedArticles(unlocked);
  }, []);

  const isUnlocked = unlockedArticles.includes(index.toString());

  const card = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    textDecoration: 'none',
    color: '#1a1a1a',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.3s ease',
    fontFamily: "'Nunito Sans', sans-serif",
    cursor: 'pointer',
  };

  const image = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  };

  const content = {
    padding: '1rem',
    position: 'relative',
  };

  const title = {
    fontSize: '1.2rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
  };

  const description = {
    fontSize: '0.95rem',
    color: '#6b7280',
    marginBottom: '0.5rem',
    minHeight: '48px',
    overflow: 'hidden',
  };

  const badge = {
    display: 'inline-block',
    backgroundColor: article.price === '0' ? '#34d399' : '#fbbf24',
    color: '#1a1a1a',
    padding: '0.4rem 0.8rem',
    borderRadius: '999px',
    fontSize: '0.8rem',
    fontWeight: '700',
    marginTop: '0.5rem',
  };

  const authorLink = {
    display: 'block',
    marginTop: '0.5rem',
    fontSize: '0.85rem',
    color: '#4f46e5',
    fontWeight: '600',
    textDecoration: 'none',
  };

  const unlockedBadge = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    backgroundColor: '#10b981',
    color: 'white',
    padding: '0.3rem 0.6rem',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: '700',
  };

  return (
    <Link
      to={`/articles/${index}`}
      style={card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
      }}
    >
      <img
        src={article.coverImage || 'https://via.placeholder.com/800x400?text=OpenScroll+Cover'}
        alt="cover"
        style={image}
      />
      <div style={content}>
        {isUnlocked && <div style={unlockedBadge}>Unlocked</div>}
        <div style={title}>{article.title}</div>
        <div style={description}>{article.shortDesc}</div>
        <span style={badge}>
          {article.price === '0' ? 'Free' : `₹${article.price}`}
        </span>

        {/* NEW - Author Name Link */}
        {article.authorEmail && (
          <Link
            to={`/writers/${encodeURIComponent(article.authorEmail)}`}
            style={authorLink}
            onClick={(e) => e.stopPropagation()} // Prevent clicking the card if clicking link
          >
            ✍️ {article.authorName || article.authorEmail}
          </Link>
        )}
      </div>
    </Link>
  );
}

export default ArticleCard;
