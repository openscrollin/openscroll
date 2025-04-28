import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [articleData, setArticleData] = useState({
    title: '',
    shortDesc: '',
    body: '',
    price: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const allArticles = JSON.parse(localStorage.getItem('openscroll_articles')) || [];
    const writerData = JSON.parse(localStorage.getItem('openscroll_current_writer'));
    if (!writerData) {
      navigate('/writer/login');
      return;
    }

    const writerArticles = allArticles.filter(
      (article) => article.authorEmail === writerData.email
    );

    const currentArticle = writerArticles[parseInt(id)];

    if (currentArticle) {
      setArticleData({
        title: currentArticle.title || '',
        shortDesc: currentArticle.shortDesc || '',
        body: currentArticle.body || '',
        price: currentArticle.price || '',
      });
    } else {
      navigate('/writer/dashboard');
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    setArticleData({ ...articleData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!articleData.title.trim() || !articleData.shortDesc.trim() || !articleData.body.trim()) {
      setError('Please fill all required fields.');
      return;
    }

    const allArticles = JSON.parse(localStorage.getItem('openscroll_articles')) || [];
    const writerData = JSON.parse(localStorage.getItem('openscroll_current_writer'));
    const writerArticles = allArticles.filter(
      (article) => article.authorEmail === writerData.email
    );

    const realArticleIndex = allArticles.findIndex(
      (article) => article.authorEmail === writerData.email &&
      writerArticles.indexOf(article) === parseInt(id)
    );

    if (realArticleIndex !== -1) {
      allArticles[realArticleIndex] = {
        ...allArticles[realArticleIndex],
        ...articleData,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem('openscroll_articles', JSON.stringify(allArticles));

      setSuccessMessage('Article updated successfully! Redirecting...');
      setTimeout(() => {
        navigate('/writer/dashboard');
      }, 2000);
    } else {
      setError('Error updating article.');
    }
  };

  const container = {
    minHeight: '100vh',
    backgroundColor: '#f9f9f7',
    fontFamily: "'Nunito Sans', sans-serif",
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const formBox = {
    backgroundColor: '#ffffff',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: '600px',
  };

  const heading = {
    fontSize: '2rem',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '2rem',
  };

  const label = {
    fontWeight: '600',
    marginBottom: '0.5rem',
    marginTop: '1rem',
    fontSize: '1rem',
  };

  const input = {
    padding: '1rem',
    width: '100%',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    marginBottom: '1rem',
  };

  const textarea = {
    padding: '1rem',
    width: '100%',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    height: '150px',
    marginBottom: '1rem',
    resize: 'vertical',
  };

  const button = {
    padding: '1rem',
    backgroundColor: '#2c2c2c',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1rem',
    width: '100%',
    cursor: 'pointer',
    marginTop: '1rem',
  };

  const errorText = {
    color: 'red',
    fontSize: '0.9rem',
    textAlign: 'center',
    marginTop: '1rem',
  };

  const successText = {
    color: 'green',
    fontSize: '1rem',
    textAlign: 'center',
    marginTop: '1rem',
  };

  return (
    <>


      <div style={container}>
        <div style={formBox}>
          <h1 style={heading}>Edit Your Article</h1>

          <form onSubmit={handleSubmit}>
            <label style={label}>Article Title</label>
            <input
              type="text"
              name="title"
              style={input}
              value={articleData.title}
              onChange={handleChange}
            />

            <label style={label}>Short Description</label>
            <input
              type="text"
              name="shortDesc"
              style={input}
              value={articleData.shortDesc}
              onChange={handleChange}
            />

            <label style={label}>Full Article Body</label>
            <textarea
              name="body"
              style={textarea}
              value={articleData.body}
              onChange={handleChange}
            />

            <label style={label}>Price (₹)</label>
            <input
              type="number"
              name="price"
              style={input}
              value={articleData.price}
              onChange={handleChange}
              min="0"
            />

            <button type="submit" style={button}>
              Update Article
            </button>

            {error && <div style={errorText}>{error}</div>}
            {successMessage && <div style={successText}>{successMessage}</div>}
          </form>
        </div>
      </div>
    </>
  );
}

export default EditArticle;
