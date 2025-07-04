import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WriterNavbar from './WriterNavbar';
import TextEditorWithAI from './TextEditorWithAI'; // ✅ AI Editor added

function NewArticle() {
  const navigate = useNavigate();

  const [coverImage, setCoverImage] = useState(null);
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [body, setBody] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!title.trim() || !shortDesc.trim() || !body.trim()) {
      setError('Please fill all the fields.');
      return;
    }

    const writerData = JSON.parse(localStorage.getItem('openscroll_current_writer'));
    if (!writerData) {
      setError('Writer not logged in.');
      return;
    }

    const reader = new FileReader();
    if (coverImage) {
      reader.readAsDataURL(coverImage);
      reader.onloadend = async () => {
        await saveArticle(reader.result, writerData);
      };
    } else {
      await saveArticle(null, writerData);
    }
  };

  const saveArticle = async (imageDataUrl, writerData) => {
    try {
      const response = await fetch('/api/addArticle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          shortDesc,
          body,
          price: price ? price : '0',
          coverImage: imageDataUrl,
          authorName: writerData.name || '',
          authorEmail: writerData.email,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage('Article posted successfully! Redirecting...');
        setTimeout(() => {
          navigate('/writer/dashboard');
        }, 2000);
      } else {
        setError(result.message || 'Failed to post article.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
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

  const editorWrapper = {
    marginBottom: '1rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '1rem',
    backgroundColor: '#fff',
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
      <WriterNavbar />

      <div style={container}>
        <div style={formBox}>
          <h1 style={heading}>Publish a New Article</h1>

          <form onSubmit={handleSubmit}>
            <label style={label}>Cover Image (Recommended: 1200 x 600)</label>
            <input
              type="file"
              accept="image/*"
              style={input}
              onChange={handleImageUpload}
            />

            <label style={label}>Article Title</label>
            <input
              type="text"
              placeholder="Enter article title"
              style={input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label style={label}>Short Description</label>
            <input
              type="text"
              placeholder="Enter short description"
              style={input}
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
            />

            <label style={label}>Full Article Body</label>
            <div style={editorWrapper}>
              <TextEditorWithAI value={body} onChange={setBody} />
            </div>

            <label style={label}>Price (₹)</label>
            <input
              type="number"
              placeholder="Enter price or 0 for free"
              style={input}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
            />

            <button type="submit" style={button}>
              Publish Article
            </button>

            {error && <div style={errorText}>{error}</div>}
            {successMessage && <div style={successText}>{successMessage}</div>}
          </form>
        </div>
      </div>
    </>
  );
}

export default NewArticle;
