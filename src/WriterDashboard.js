import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function WriterDashboard() {
  const navigate = useNavigate();
  const [currentWriter, setCurrentWriter] = useState(null);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const writer = JSON.parse(localStorage.getItem('openscroll_current_writer'));
    if (!writer) {
      navigate('/writer/login');
      return;
    }
    setCurrentWriter(writer);

    const allArticles = JSON.parse(localStorage.getItem('openscroll_articles')) || [];
    const writerArticles = allArticles.filter(
      (article) => article.authorEmail === writer.email
    );
    setArticles(writerArticles);
  }, [navigate]);

  const earnings = articles.reduce((sum, article) => {
    if (article.price && article.price !== '0') {
      return sum + parseFloat(article.price);
    }
    return sum;
  }, 0);

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      const allArticles = JSON.parse(localStorage.getItem('openscroll_articles')) || [];
      const updatedArticles = allArticles.filter((article, idx) => {
        const belongsToCurrentWriter = article.authorEmail === currentWriter.email;
        if (belongsToCurrentWriter) {
          const writerArticles = allArticles.filter(a => a.authorEmail === currentWriter.email);
          return writerArticles.indexOf(article) !== index;
        }
        return true;
      });
      localStorage.setItem('openscroll_articles', JSON.stringify(updatedArticles));

      const updatedWriterArticles = updatedArticles.filter(
        (article) => article.authorEmail === currentWriter.email
      );
      setArticles(updatedWriterArticles);
    }
  };

  // Styles
  const container = {
    minHeight: '100vh',
    backgroundColor: '#f9f9f7',
    fontFamily: "'Nunito Sans', sans-serif",
    padding: '2rem',
    marginTop: '5rem',
  };

  const header = {
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const statValue = {
    fontSize: '2rem',
    fontWeight: '700',
    marginTop: '0.5rem',
    color: '#2c2c2c',
  };

  const statLabel = {
    fontSize: '1rem',
    color: '#6b7280',
    marginTop: '0.5rem',
    textAlign: 'center',
  };

  const tableContainer = {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
  };

  const table = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
  };

  const th = {
    textAlign: 'left',
    padding: '1rem',
    fontSize: '1rem',
    color: '#6b7280',
    borderBottom: '1px solid #e5e7eb',
  };

  const td = {
    padding: '1rem',
    fontSize: '1rem',
    color: '#1a1a1a',
    borderBottom: '1px solid #f1f1f1',
  };

  const newArticleButton = {
    padding: '0.8rem 1.5rem',
    backgroundColor: '#2c2c2c',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    marginBottom: '2rem',
    textDecoration: 'none',
    display: 'inline-block',
  };

  const actionButton = {
    padding: '0.4rem 0.8rem',
    fontSize: '0.85rem',
    marginRight: '0.5rem',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
  };

  const editButton = {
    ...actionButton,
    backgroundColor: '#0077cc',
    color: '#ffffff',
  };

  const deleteButton = {
    ...actionButton,
    backgroundColor: '#dc2626',
    color: '#ffffff',
  };

  return (
    <>
      <div style={container}>
        {currentWriter && (
          <>
            <h1 style={header}>
              Welcome back, {currentWriter.fullName.split(' ')[0]} 👋
            </h1>

            <div style={statsGrid}>
              <div style={statCard}>
                <span style={statValue}>{articles.length}</span>
                <span style={statLabel}>Total Articles Posted</span>
              </div>

              <div style={statCard}>
                <span style={statValue}>₹ {earnings}</span>
                <span style={statLabel}>Total Earnings</span>
              </div>
            </div>

            <Link to="/writer/new-article" style={newArticleButton}>
              ➕ Add New Article
            </Link>

            <div style={tableContainer}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
                Your Articles
              </h2>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>Title</th>
                    <th style={th}>Price</th>
                    <th style={th}>Status</th>
                    <th style={th}>Posted On</th>
                    <th style={th}>Actions</th> {/* New Action Column */}
                  </tr>
                </thead>
                <tbody>
                  {articles.length > 0 ? (
                    articles.map((article, idx) => (
                      <tr key={idx}>
                        <td style={td}>{article.title}</td>
                        <td style={td}>₹ {article.price === '0' ? 'Free' : article.price}</td>
                        <td style={td}>{article.price === '0' ? 'Free' : 'Paid'}</td>
                        <td style={td}>{new Date(article.createdAt).toLocaleDateString()}</td>
                        <td style={td}>
                          <button
                            style={editButton}
                            onClick={() => navigate(`/writer/edit-article/${idx}`)}
                          >
                            Edit
                          </button>
                          <button
                            style={deleteButton}
                            onClick={() => handleDelete(idx)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td style={td} colSpan="5" align="center">
                        No articles posted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default WriterDashboard;
