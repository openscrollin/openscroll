import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ReaderProfile() {
  const [user, setUser] = useState(null);
  const [unlockedArticles, setUnlockedArticles] = useState([]);
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('openscroll_current_user'));

    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
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

  const section = {
    marginBottom: '2.5rem',
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
  };

  const input = {
    padding: '0.8rem',
    width: '100%',
    borderRadius: '8px',
    border: '1px solid #ccc',
    marginTop: '1rem',
    fontSize: '1rem',
  };

  const button = {
    marginTop: '1rem',
    padding: '0.7rem 1.2rem',
    backgroundColor: '#2c2c2c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
  };

  const handleViewArticle = (index) => {
    navigate(`/articles/${index}`);
  };

  const handlePasswordChange = () => {
    if (newPassword.trim().length < 6) {
      alert('Password should be at least 6 characters!');
      return;
    }
    let updatedUser = { ...user, password: newPassword };
    localStorage.setItem('openscroll_current_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setNewPassword('');
    setSuccessMessage('Password updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div style={container}>
      <h1 style={heading}>Your Profile</h1>

      {user && (
        <div style={section}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Welcome, {user.name || user.email} 👋</h2>
          <p style={{ color: '#6b7280' }}>{user.email}</p>
        </div>
      )}

      {/* Purchase History */}
      <div style={section}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Unlocked Articles</h2>
        {unlockedArticles.length === 0 ? (
          <p style={{ color: '#6b7280' }}>You haven't unlocked any articles yet.</p>
        ) : (
          <div style={articleList}>
            {unlockedArticles.map((article) => (
              <div key={article._id} style={articleCard}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{article.title || "Untitled"}</h3>
                <button style={button} onClick={() => handleViewArticle(article._id)}>View Article</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Change Password Section */}
      <div style={section}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Change Password</h2>
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
        {successMessage && <p style={{ color: 'green', marginTop: '1rem' }}>{successMessage}</p>}
      </div>

    </div>
  );
}

export default ReaderProfile;
