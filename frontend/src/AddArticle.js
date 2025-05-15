import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import WriterNavbar from './WriterNavbar';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

function AddArticle() {
  const navigate = useNavigate();

  const [mode, setMode] = useState('write'); // 'write' or 'upload'
  const [coverImage, setCoverImage] = useState(null);
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('');
  const [body, setBody] = useState('');
  const [articleFile, setArticleFile] = useState(null);
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const categories = ['Technology', 'Design', 'Marketing', 'Business', 'Education', 'Lifestyle'];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.docx'))) {
      setArticleFile(file);
    } else {
      setError('Only PDF or DOCX files are allowed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!title || !shortDesc || !summary || !category || (mode === 'write' ? !body : !articleFile)) {
      setError('Please fill in all required fields.');
      return;
    }

    const writerData = JSON.parse(localStorage.getItem('openscroll_current_writer'));
    const token = localStorage.getItem('openscroll_token');

    if (!writerData || !token) {
      setError('User not authenticated.');
      return;
    }

    const articleData = {
      title,
      shortDesc,
      summary,
      category,
      body: mode === 'write' ? body : '',
      price: price ? price : '0',
      authorName: writerData.name,
      authorEmail: writerData.email,
      createdAt: new Date().toISOString(),
    };

    if (coverImage) {
      const reader = new FileReader();
      reader.readAsDataURL(coverImage);
      reader.onloadend = async () => {
        articleData.coverImage = reader.result;
        await saveArticle(articleData, token);
      };
    } else {
      await saveArticle(articleData, token);
    }
  };

  const saveArticle = async (articleData, token) => {
    try {
      const formData = new FormData();
      for (const key in articleData) {
        formData.append(key, articleData[key]);
      }

      if (mode === 'upload' && articleFile) {
        formData.append('articleFile', articleFile);
      }

      const response = await fetch('http://localhost:5002/api/articles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage('Article published successfully! Redirecting...');
        setTimeout(() => navigate('/writer/dashboard'), 2000);
      } else {
        setError(result.message || 'Failed to publish article.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again later.');
    }
  };

  const container = {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: "'Nunito Sans', sans-serif",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  };

  const formBox = {
    backgroundColor: '#fff',
    borderRadius: '20px',
    boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
    padding: '2rem',
    width: '100%',
    maxWidth: '720px',
  };

  const heading = {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '1.5rem',
    textAlign: 'center',
  };

  const label = {
    display: 'block',
    fontWeight: '600',
    fontSize: '0.95rem',
    color: '#374151',
    marginBottom: '0.4rem',
    marginTop: '1rem',
  };

  const input = {
    width: '100%',
    padding: '0.9rem 1rem',
    fontSize: '1rem',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    marginBottom: '0.75rem',
  };

  const select = {
    ...input,
    backgroundColor: '#fff',
    cursor: 'pointer',
  };

  const button = {
    marginTop: '1.5rem',
    padding: '1rem',
    width: '100%',
    backgroundColor: 'black',
    color: '#fff',
    fontWeight: '700',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
  };

  const messageText = {
    fontSize: '0.95rem',
    textAlign: 'center',
    marginTop: '1rem',
  };

  const toggleWrapper = {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
    marginBottom: '1rem',
  };

  return (
    <>
      
      <div style={container}>
        <div style={formBox}>
          <h1 style={heading}>Publish a New Article</h1>
          <form onSubmit={handleSubmit}>
            <label style={label}>Cover Image</label>
            <input type="file" accept="image/*" style={input} onChange={handleImageUpload} />

            <label style={label}>Article Title</label>
            <input type="text" placeholder="Enter article title" style={input} value={title} onChange={(e) => setTitle(e.target.value)} />

            <label style={label}>Short Description</label>
            <input type="text" placeholder="Enter short description" style={input} value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} />

            <label style={label}>Summary</label>
            <input type="text" placeholder="Add a summary in one line" style={input} value={summary} onChange={(e) => setSummary(e.target.value)} />

            <label style={label}>Category</label>
            <select style={select} value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <div style={toggleWrapper}>
              <label>
                <input
                  type="radio"
                  value="write"
                  checked={mode === 'write'}
                  onChange={() => setMode('write')}
                /> Write Article
              </label>
              <label>
                <input
                  type="radio"
                  value="upload"
                  checked={mode === 'upload'}
                  onChange={() => setMode('upload')}
                /> Upload PDF/DOCX
              </label>
            </div>

            {mode === 'write' ? (
              <>
                <label style={label}>Full Article Body</label>
                <ReactQuill value={body} onChange={setBody} style={{ marginBottom: '1rem' }} />
              </>
            ) : (
              <>
                <label style={label}>Upload File</label>
                <input type="file" accept=".pdf,.doc,.docx" style={input} onChange={handleFileUpload} />
              </>
            )}

            <label style={label}>Price (₹)</label>
            <input type="number" placeholder="Enter price or 0 for free" style={input} value={price} onChange={(e) => setPrice(e.target.value)} min="0" />

            <button type="submit" style={button}>Publish Article</button>

            {error && <div style={{ ...messageText, color: 'red' }}>{error}</div>}
            {successMessage && <div style={{ ...messageText, color: 'green' }}>{successMessage}</div>}
          </form>
        </div>
      </div>
    </>
  );
}

export default AddArticle;
