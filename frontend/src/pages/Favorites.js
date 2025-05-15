import React, { useEffect, useState } from 'react';
import ArticleCard from '../ArticleCard';

function Favorites() {
  const [favoriteArticles, setFavoriteArticles] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('openscroll_current_user'));
    const allArticles = JSON.parse(localStorage.getItem('openscroll_all_articles')) || [];

    if (!user || !user.email) return;

    const favoriteIds = JSON.parse(localStorage.getItem(`openscroll_favorite_articles__${user.email}`)) || [];
    const favorites = allArticles.filter(article => favoriteIds.includes(article._id));
    setFavoriteArticles(favorites);
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: "'Nunito Sans', sans-serif" }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1.5rem' }}>❤️ Your Favorites</h2>
      {favoriteArticles.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
          {favoriteArticles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      ) : (
        <p style={{ fontSize: '1rem', color: '#6b7280' }}>No favorites yet. Explore and save articles!</p>
      )}
    </div>
  );
}

export default Favorites;
