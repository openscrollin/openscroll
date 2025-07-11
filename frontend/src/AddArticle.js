import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { auth, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import Loader from './components/Loader';

function AddArticle() {
  const navigate = useNavigate();
  const quillRef = useRef(null);

  const [firebaseUser, setFirebaseUser] = useState(null);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [price, setPrice] = useState('');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const categories = [
    '', 'Technology', 'Science', 'Fiction', 'Non-fiction', 'AI', 'Cyberpunk',
    'Culture', 'Tutorial', 'Opinion', 'Other',
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("✅ Firebase User detected:", user);
      setFirebaseUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError('No file selected.');
      return;
    }

    setUploadingImage(true);
    setError('');
    setSuccessMessage('');

    try {
      // Create a unique filename
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `coverImages/${fileName}`);

      console.log('📤 Uploading image to Firebase Storage...', fileName);

      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      console.log('✅ Image uploaded successfully:', snapshot);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      console.log('✅ Download URL obtained:', downloadURL);

      setCoverImage(downloadURL);
      setSuccessMessage('Image uploaded successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('❌ Image upload failed:', err);
      setError(`Failed to upload image: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (publish) => {
    if (!title.trim() || !body.trim()) {
      setError('Title and content are required.');
      return;
    }
    if (!category) {
      setError('Please select a category.');
      return;
    }

    const writerData = JSON.parse(localStorage.getItem('openscroll_current_user'));
    const token = localStorage.getItem('writerToken');

    if (!writerData || !token) {
      setError('User not authenticated.');
      return;
    }

    const articleData = {
      title: title.trim(),
      body,
      excerpt: excerpt || body.replace(/<[^>]+>/g, '').substring(0, 200) + '...',
      category,
      coverImage,
      price: isPremium ? price : '0',
      isPremium,
      isPublished: publish,
      authorName: writerData.name || writerData.fullName || 'Unknown Author',
      authorEmail: writerData.email,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('https://openscroll-backend.onrender.com/api/addArticle', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage(publish ? 'Article published successfully! Redirecting...' : 'Draft saved!');
        setTimeout(() => navigate('/writer/dashboard'), 1800);
      } else {
        setError(result.message || 'Failed to save article.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    }
  };

  const saveAsDraft = async () => {
    setSaving(true);
    setError('');
    setSuccessMessage('');
    await handleSubmit(false);
    setSaving(false);
  };

  const publishArticle = async () => {
    setPublishing(true);
    setError('');
    setSuccessMessage('');
    await handleSubmit(true);
    setPublishing(false);
  };

  const styles = {
    container: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '4rem 1rem 2rem',
      minHeight: '100vh',
      background: '#07080a',
      fontFamily: "'Nunito Sans', sans-serif",
      position: 'relative',
    },
    glass: {
      background: 'rgba(24,26,19,0.85)',
      borderRadius: 16,
      boxShadow: '0 4px 32px #d0f33011',
      border: '1.5px solid #d0f33022',
      padding: 24,
      marginBottom: 0,
    },
    neon: {
      boxShadow: '0 0 24px #d0f33055',
    },
    input: {
      width: '100%',
      padding: '0.9rem 1rem',
      fontSize: '1rem',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      backgroundColor: '#181a13',
      color: '#fff',
      marginBottom: '0.75rem',
      outline: 'none',
    },
    label: {
      display: 'block',
      fontWeight: '600',
      fontSize: '0.95rem',
      color: '#b6c2b6',
      marginBottom: '0.4rem',
      marginTop: '1rem',
    },
    button: {
      marginTop: 0,
      padding: '0.8rem 1.5rem',
      background: 'linear-gradient(90deg, #d0f330 60%, #b0e000 100%)',
      color: '#111',
      fontWeight: 700,
      fontSize: '1rem',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      marginLeft: 8,
      marginRight: 0,
      boxShadow: '0 0 16px #d0f33044',
      transition: 'background 0.18s, color 0.18s',
    },
    ghostBtn: {
      background: 'none',
      color: '#d0f330',
      boxShadow: 'none',
      border: '1.5px solid #d0f33044',
      marginLeft: 0,
      marginRight: 8,
    },
  };

  if (saving) {
    return <Loader message="Saving article..." type="form" />;
  }

  if (publishing) {
    return <Loader message="Publishing article..." type="form" />;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 32,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <h1 style={{ color: '#fff', fontSize: '2.2rem', fontWeight: 700, marginBottom: 6 }}>Editor</h1>
          <p style={{ color: '#d0f330', opacity: 0.7, fontFamily: 'monospace', fontWeight: 600 }}>NEURAL.WRITING.ASSISTANT</p>
        </div>
      </div>

      <div
        className="add-article-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '3fr 1fr',
          gap: 32,
        }}
      >
        {/* Main Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Title */}
          <div style={{ ...styles.glass, ...styles.neon }}>
            <input
              type="text"
              placeholder="Enter your article title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ ...styles.input, fontSize: 22, fontWeight: 600, marginBottom: 0 }}
            />
          </div>
          {/* Content */}
          <div style={{ ...styles.glass, ...styles.neon }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <span style={{ color: '#fff', fontWeight: 600, fontSize: 17 }}>Content</span>
              <span style={{ color: '#b6c2b6', fontFamily: 'monospace', fontSize: 13 }}>{body.length} chars</span>
            </div>
            <div style={{ marginBottom: 50 }}>
              <ReactQuill
                ref={quillRef}
                value={body}
                onChange={setBody}
                style={{
                  height: 260,
                  background: '#181a13',
                  color: '#fff',
                  borderRadius: 12,
                }}
              />
            </div>
          </div>
        </div>
        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Article Settings */}
          <div style={{ ...styles.glass, ...styles.neon }}>
            <span
              style={{
                color: '#fff',
                fontWeight: 600,
                fontSize: 17,
                marginBottom: 16,
                display: 'block',
              }}
            >
              Article Settings
            </span>
            {/* Excerpt */}
            <div style={{ marginBottom: 16 }}>
              <label style={styles.label}>Summary</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief description of your article..."
                style={{ ...styles.input, height: 80, resize: 'none' }}
              />
            </div>
            {/* Cover Image */}
            <div style={{ marginBottom: 16 }}>
              <label style={styles.label}>Cover Image</label>
              <input
                type="file"
                accept="image/*"
                style={styles.input}
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
              {uploadingImage && (
                <div style={{ color: '#d0f330', fontSize: '0.9rem', marginTop: 8 }}>
                  Uploading image...
                </div>
              )}
              {coverImage && (
                <div style={{ marginTop: 8 }}>
                  <img
                    src={coverImage}
                    alt="cover"
                    style={{
                      width: '100%',
                      borderRadius: 10,
                      maxHeight: 120,
                      objectFit: 'cover',
                    }}
                  />
                  <div style={{ color: '#4ade80', fontSize: '0.8rem', marginTop: 4 }}>
                    ✅ Image uploaded successfully
                  </div>
                </div>
              )}
            </div>
            {/* Category Dropdown */}
            <div style={{ marginBottom: 16 }}>
              <label style={styles.label}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ ...styles.input, marginBottom: 0 }}
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat ? cat : 'Select a category'}
                  </option>
                ))}
              </select>
            </div>
            {/* Premium */}
            <div
              style={{
                borderTop: '1px solid #d0f33022',
                paddingTop: 16,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
              >
                <label
                  style={{
                    color: '#b6c2b6',
                    fontWeight: 600,
                    fontSize: 15,
                  }}
                >
                  Premium Article
                </label>
                <button
                  onClick={() => setIsPremium(!isPremium)}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    background: isPremium ? '#d0f330' : '#444',
                    border: 'none',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: '#fff',
                      position: 'absolute',
                      left: isPremium ? 22 : 4,
                      top: 3,
                      transition: 'left 0.2s',
                    }}
                  />
                </button>
              </div>
              {isPremium && (
                <div>
                  <label style={styles.label}>Price (INR)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{ ...styles.input, paddingLeft: 32 }}
                    min="0"
                  />
                  <span
                    style={{
                      position: 'absolute',
                      marginLeft: -28,
                      marginTop: 12,
                      color: '#b6c2b6',
                    }}
                  >
                    ₹
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className="bottom-action-buttons"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              marginTop: '8px',
              justifyContent: 'space-between',
            }}
          >
            <button 
              style={{...styles.ghostBtn, ...styles.button}} 
              onClick={saveAsDraft} 
              disabled={saving || uploadingImage}
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button 
              style={styles.button} 
              onClick={publishArticle} 
              disabled={publishing || uploadingImage}
            >
              {publishing ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {(error || successMessage) && (
        <div
          style={{
            marginTop: 24,
            textAlign: 'center',
            color: error ? '#ff4d4f' : '#4ade80',
            fontWeight: 600,
            fontSize: 16,
            padding: '12px',
            borderRadius: '8px',
            background: error ? 'rgba(255, 77, 79, 0.1)' : 'rgba(74, 222, 128, 0.1)',
            border: `1px solid ${error ? '#ff4d4f' : '#4ade80'}`,
          }}
        >
          {error || successMessage}
        </div>
      )}

      {/* Media queries for responsiveness */}
      <style>{`
        @media (max-width: 900px) {
          .add-article-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }

        @media (max-width: 600px) {
          .add-article-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .add-article-grid > div {
            padding: 0 !important;
          }
          input, textarea, select {
            font-size: 1rem !important;
          }
          .bottom-action-buttons {
            flex-direction: row !important;
            justify-content: space-between !important;
          }
          .bottom-action-buttons button {
            flex: 1;
            min-width: 45%;
          }
        }

        @media (max-width: 500px) {
          h1 {
            font-size: 1.3rem !important;
          }
          .add-article-grid {
            gap: 8px !important;
          }
        }

        @keyframes pulse {
          0% { text-shadow: 0 0 8px #d0f33055; }
          100% { text-shadow: 0 0 24px #d0f330; }
        }
      `}</style>
    </div>
  );
}

export default AddArticle;