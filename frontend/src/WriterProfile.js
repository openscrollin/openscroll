import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function WriterProfile() {
  const { email } = useParams();
  const [articles, setArticles] = useState([]);
  const [writerName, setWriterName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const allArticles = JSON.parse(localStorage.getItem('openscroll_articles')) || [];
    const writerArticles = allArticles.filter((article) => article.authorEmail === email);

    if (writerArticles.length > 0) {
      setArticles(writerArticles);
      setWriterName(writerArticles[0].authorName || writerArticles[0].authorEmail); // Use Name if available
    } else {
      setArticles([]);
    }
  }, [email]);

  const container = {
    minHeight: '100vh',
    backgroundColor: '#f9f9f7',
    padding: '2rem',
    fontFamily: "'Nunito Sans', sans-serif",
    marginTop: '5rem',
  };

  const heading = {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '2rem',
    textAlign: 'center',
    color: '#1a1a1a',
  };

  const subheading = {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    color: '#4b5563',
  };

  const articleList = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  };

  const articleCard = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.3s ease',
  };

  const handleClickArticle = (index) => {
    navigate(`/articles/${index}`);
  };

  return (
    <div style={container}>
      <h1 style={heading}>About the Writer</h1>

      {writerName ? (
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={subheading}>{writerName}</h2>
          <p style={{ color: '#6b7280' }}>{email}</p>
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>No writer information found.</p>
      )}

      <div>
        <h2 style={subheading}>Articles by {writerName.split(' ')[0]}</h2>
        {articles.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center' }}>No articles found for this writer.</p>
        ) : (
          <div style={articleList}>
            {articles.map((article, idx) => (
              <div
                key={idx}
                style={articleCard}
                onClick={() => handleClickArticle(article.index)} // Assuming each article has its index saved
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
              >
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{article.title}</h3>
                <p style={{ fontSize: '0.95rem', color: '#6b7280' }}>{article.shortDesc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WriterProfile;
