import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddArticle() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [body, setBody] = useState('');
  const [price, setPrice] = useState('');
  const [coverImage, setCoverImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!coverImage) {
      alert('Please upload a cover image!');
      return;
    }

    const newArticle = {
      title,
      shortDesc,
      body,
      price: price || '0',
      coverImage, // ✅ Save image data
      authorEmail: JSON.parse(localStorage.getItem('openscroll_current_writer')).email,
      createdAt: new Date().toISOString()
    };

    const existingArticles = JSON.parse(localStorage.getItem('openscroll_articles')) || [];
    existingArticles.push(newArticle);
    localStorage.setItem('openscroll_articles', JSON.stringify(existingArticles));

    navigate('/writer/dashboard');
  };

  // Styles
  const container = {
    minHeight: '100vh',
    backgroundColor: '#f9f9f7',
    fontFamily: "'Nunito Sans', sans-serif",
    padding: '2rem',
    marginTop: '5rem',
  };

  const form = {
    maxWidth: '700px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  };

  const heading = {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '2rem',
    color: '#1a1a1a',
    textAlign: 'center',
  };

  const label = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#1a1a1a',
  };

  const input = {
    width: '100%',
    padding: '0.8rem',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    marginBottom: '1.5rem',
    fontSize: '1rem',
    fontFamily: "'Nunito Sans', sans-serif",
  };

  const textarea = {
    width: '100%',
    minHeight: '150px',
    padding: '0.8rem',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    marginBottom: '1.5rem',
    fontSize: '1rem',
    fontFamily: "'Nunito Sans', sans-serif",
  };

  const button = {
    width: '100%',
    backgroundColor: '#2c2c2c',
    color: '#ffffff',
    padding: '0.8rem',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1rem',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={container}>
      <form style={form} onSubmit={handleSubmit}>
        <h1 style={heading}>Publish a New Article</h1>

        <label style={label}>Cover Image (Recommended: 1200 x 600)</label>
        <input
          type="file"
          accept="image/*"
          style={input}
          onChange={handleImageUpload}
          required
        />

        <label style={label}>Article Title</label>
        <input
          type="text"
          placeholder="Enter article title"
          style={input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label style={label}>Short Description</label>
        <input
          type="text"
          placeholder="Enter short description"
          style={input}
          value={shortDesc}
          onChange={(e) => setShortDesc(e.target.value)}
          required
        />

        <label style={label}>Full Article Body</label>
        <textarea
          placeholder="Write your full article here..."
          style={textarea}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        ></textarea>

        <label style={label}>Price (₹)</label>
        <input
          type="number"
          placeholder="Enter price or 0 for free"
          style={input}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button type="submit" style={button}>
          Publish Article
        </button>
      </form>
    </div>
  );
}

export default AddArticle;
