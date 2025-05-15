import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = ['Technology', 'Design', 'Marketing', 'Business', 'Education', 'Lifestyle'];

  useEffect(() => {
    fetch(`http://localhost:5002/api/articles/public/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setArticle(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load article');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setArticle({ ...article, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('openscroll_token');

    try {
      const res = await fetch(`http://localhost:5002/api/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(article),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess('✅ Article updated successfully!');
        setTimeout(() => navigate('/writer/dashboard'), 1500);
      } else {
        setError(result.message || 'Failed to update article');
      }
    } catch (err) {
      setError('Server error while updating article');
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (!article) return <div style={{ padding: '2rem' }}>❌ Article not found</div>;

  // UI Styles
  const formContainer = {
    padding: '2rem',
    maxWidth: '700px',
    margin: 'auto',
    fontFamily: "'Nunito Sans', sans-serif",
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
  };

  const label = {
    fontWeight: '600',
    marginBottom: '0.5rem',
    marginTop: '1rem',
    display: 'block',
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
    ...input,
    height: '150px',
    resize: 'vertical',
  };

  const select = {
    ...input,
    cursor: 'pointer',
    backgroundColor: '#fff',
  };

  const button = {
    padding: '1rem',
    backgroundColor: '#2c2c2c',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1rem',
    width: '100%',
    cursor: 'pointer',
    marginTop: '1rem',
  };

  return (
    <div style={formContainer}>
      <h2>Edit Article</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        {article.coverImage && (
          <>
            <label style={label}>Cover Image</label>
            <img
              src={article.coverImage}
              alt="cover"
              style={{ width: '100%', height: 'auto', borderRadius: '8px', marginBottom: '1rem' }}
            />
          </>
        )}

        <label style={label}>Article Title</label>
        <input
          name="title"
          value={article.title || ''}
          onChange={handleChange}
          style={input}
          required
        />

        <label style={label}>Short Description</label>
        <input
          name="shortDesc"
          value={article.shortDesc || ''}
          onChange={handleChange}
          style={input}
        />

        <label style={label}>Summary</label>
        <input
          name="summary"
          value={article.summary || ''}
          onChange={handleChange}
          style={input}
        />

        <label style={label}>Category</label>
        <select
          name="category"
          value={article.category || ''}
          onChange={handleChange}
          style={select}
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label style={label}>Full Article Body</label>
        <textarea
          name="body"
          value={article.body || ''}
          onChange={handleChange}
          style={textarea}
        />

        <label style={label}>Price (₹)</label>
        <input
          type="number"
          name="price"
          value={article.price || ''}
          onChange={handleChange}
          style={input}
          min="0"
        />

        <button type="submit" style={button}>Update Article</button>
      </form>
    </div>
  );
}

export default EditArticle;
