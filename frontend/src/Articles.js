import React, { useEffect, useState } from 'react';
import ArticleCard from './ArticleCard';

function Articles() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const storedArticles = JSON.parse(localStorage.getItem('openscroll_articles')) || [];
    setArticles(storedArticles);
  }, []);

  const container = {
    minHeight: '100vh',
    backgroundColor: '#f9f9f7',
    fontFamily: "'Nunito Sans', sans-serif",
    padding: '2rem',
    marginTop: '5rem',
  };

  const heading = {
    fontSize: '2.2rem',
    fontWeight: '700',
    marginBottom: '2rem',
    color: '#1a1a1a',
    textAlign: 'center',
  };

  const grid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  };

  return (
    <div style={container}>
      <h1 style={heading}>Explore Articles</h1>

      <div style={grid}>
        {articles.length > 0 ? (
          articles.map((article, idx) => (
            <ArticleCard article={article} key={idx} index={idx} />
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>
            No articles published yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default Articles;
