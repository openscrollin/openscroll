// ReaderProfile.js with fixes: name in nav, overview content, default fallback name

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ReaderProfile() {
  const [user, setUser] = useState(null);
  const [unlockedArticles, setUnlockedArticles] = useState([]);
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [editingName, setEditingName] = useState(false);
  const [updatedName, setUpdatedName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('openscroll_current_user'));
    if (!currentUser) {
      navigate('/login');
    } else {
      if (!currentUser.name && currentUser.fullName) currentUser.name = currentUser.fullName;
      setUser(currentUser);
      setUpdatedName(currentUser.name || '');
      setAvatarUrl(currentUser.avatar || '');
      fetchUnlockedArticles(currentUser.email);
    }
  }, [navigate]);

  const fetchUnlockedArticles = async (email) => {
    try {
      const response = await fetch('/api/getProfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: email }),
      });
      const result = await response.json();
      setUnlockedArticles(result.unlockedArticles || []);
    } catch (error) {
      console.error('Error fetching unlocked articles:', error);
    }
  };

  const handlePasswordChange = () => {
    if (newPassword.trim().length < 6) {
      alert('Password should be at least 6 characters!');
      return;
    }
    const updatedUser = { ...user, password: newPassword };
    localStorage.setItem('openscroll_current_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setNewPassword('');
    setSuccessMessage('Password updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleViewArticle = (id) => {
    navigate(`/articles/${id}`);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'YOUR_CLOUDINARY_PRESET');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUDINARY_NAME/image/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setAvatarUrl(data.secure_url);
      const updatedUser = { ...user, avatar: data.secure_url };
      setUser(updatedUser);
      localStorage.setItem('openscroll_current_user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Avatar upload failed:', err);
    }
  };

  const saveUpdatedName = () => {
    const updatedUser = { ...user, name: updatedName };
    setUser(updatedUser);
    localStorage.setItem('openscroll_current_user', JSON.stringify(updatedUser));
    setEditingName(false);
  };

  const container = {
    maxWidth: '720px',
    margin: '6rem auto',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 12px 32px rgba(0,0,0,0.05)',
    backgroundColor: '#fff',
    fontFamily: "'Nunito Sans', sans-serif",
  };

  const banner = {
    background: 'linear-gradient(120deg, #2C2C2C, #1f2937)',
    height: '120px',
    position: 'relative',
  };

  const avatar = {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    border: '3px solid #fff',
    position: 'absolute',
    bottom: '-36px',
    left: '2rem',
    backgroundColor: '#e5e7eb',
    backgroundSize: 'cover',
    backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '1.25rem',
    color: '#374151',
  };

  const profileSection = {
    padding: '3rem 2rem 2rem',
  };

  const name = {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '0.3rem',
    color: '#111827',
  };

  const email = {
    fontSize: '0.95rem',
    color: '#6b7280',
    marginBottom: '1.5rem',
  };

  const tabGroup = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '2rem',
  };

  const tabButton = (tab) => ({
    border: '1px solid #d1d5db',
    borderRadius: '999px',
    padding: '0.4rem 1rem',
    backgroundColor: activeTab === tab ? '#2c2c2c' : '#fff',
    fontSize: '0.85rem',
    fontWeight: '500',
    color: activeTab === tab ? '#fff' : '#1f2937',
    cursor: 'pointer',
  });

  const sectionCard = {
    backgroundColor: '#f9fafb',
    padding: '1rem 1.2rem',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    fontSize: '0.95rem',
    fontWeight: '500',
    color: '#374151',
  };

  const input = {
    padding: '0.8rem',
    fontSize: '1rem',
    width: '100%',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    marginTop: '0.5rem',
    marginBottom: '1rem',
  };

  const button = {
    backgroundColor: '#2c2c2c',
    color: 'white',
    padding: '0.6rem 1.2rem',
    fontSize: '0.9rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  };

  return (
    <div style={container}>
      <div style={banner}>
        <div style={avatar}>
          {!avatarUrl && (user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U')}
        </div>
        <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ position: 'absolute', bottom: '1rem', right: '1rem' }} />
      </div>

      <div style={profileSection}>
        {editingName ? (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
              placeholder="Enter your name"
              style={input}
            />
            <button style={button} onClick={saveUpdatedName}>Save</button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={name}>{user?.name || 'Reader'}</div>
            <button onClick={() => setEditingName(true)} style={tabButton('edit')}>Edit</button>
          </div>
        )}

        <div style={email}>{user?.email}</div>

        <div style={tabGroup}>
          <button style={tabButton('overview')} onClick={() => setActiveTab('overview')}>Overview</button>
          <button style={tabButton('articles')} onClick={() => setActiveTab('articles')}>Unlocked Articles</button>
          <button style={tabButton('settings')} onClick={() => setActiveTab('settings')}>Change Password</button>
        </div>

        {activeTab === 'overview' && (
          <div style={sectionCard}>
            <div>
              <div><strong>Name:</strong> {user?.name || 'Reader'}</div>
              <div><strong>Email:</strong> {user?.email}</div>
            </div>
          </div>
        )}

        {activeTab === 'articles' && (
          <div style={{ marginBottom: '2rem' }}>
            {unlockedArticles.length === 0 ? (
              <div style={sectionCard}>You haven't unlocked any articles yet.</div>
            ) : (
              unlockedArticles.map((article) => (
                <div key={article._id} style={sectionCard}>
                  <span>{article.title}</span>
                  <button style={button} onClick={() => handleViewArticle(article._id)}>
                    Read
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.95rem', fontWeight: '500', color: '#374151' }}>
              Change Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={input}
            />
            <button style={button} onClick={handlePasswordChange}>
              Update Password
            </button>
            {successMessage && (
              <p style={{ color: 'green', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                {successMessage}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReaderProfile;
