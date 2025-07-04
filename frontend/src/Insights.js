import React, { useEffect, useState } from 'react';
import ArticleCard from './ArticleCard';

function Insights() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('https://openscroll-backend.onrender.com/api/articles/public')
      .then((res) => res.json())
      .then((data) => {
        const topArticles = data.slice(0, 4);
        setArticles(topArticles);
      })
      .catch((err) => console.error('Failed to load insights:', err));
  }, []);

  const sectionStyle = {
    padding: '6rem 2rem',
    //backgroundColor: '#07080a', // Use solid background
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
  };

  const headingStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '1rem',
  };

  const subtitleStyle = {
    fontSize: '1.2rem',
    color: '#6b7280',
    marginBottom: '3rem',
  };

  const grid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  };

  return (
    <section className="insights-section fade-in-up" style={sectionStyle}>
      <h2 style={headingStyle}>Insights for Excellence</h2>
      <p style={subtitleStyle}>Curated articles to fuel your knowledge journey.</p>
      <div style={grid}>
        {articles.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>
    </section>
  );
}

export default Insights;
