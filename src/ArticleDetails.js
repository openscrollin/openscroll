import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function ArticleDetails() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const navigate = useNavigate();
  const isSubscribed = localStorage.getItem('subscribed') === 'true';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first.');
      navigate('/login');
    }

    const fetchArticle = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/articles/${id}`);
        const data = await response.json();
        setArticle(data);
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };

    fetchArticle();
  }, [navigate, id]);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    padding: '2rem',
    backgroundColor: '#f7f7f7'
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '700px',
    width: '100%',
    textAlign: 'center'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
    color: '#007BFF'
  };

  const contentStyle = {
    fontSize: '1.1rem',
    color: '#555',
    marginBottom: '1rem'
  };

  const linkStyle = {
    textDecoration: 'none',
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '5px',
    fontWeight: '600',
    display: 'inline-block',
    marginTop: '1.5rem'
  };

  if (!article) return <div>Loading...</div>;

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>{article.title}</h2>
        {(!article.isLocked || isSubscribed) ? (
          <p style={contentStyle}>{article.content}</p>
        ) : (
          <>
            <p style={contentStyle}>
              This article is locked. Please <Link to="/subscribe" style={{ color: '#007BFF', fontWeight: '600' }}>subscribe</Link> to read the full content.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default ArticleDetails;
