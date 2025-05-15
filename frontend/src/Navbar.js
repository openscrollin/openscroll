import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [readerName, setReaderName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('openscroll_current_user'));
    if (currentUser) {
      setIsLoggedIn(true);
      setReaderName(currentUser.name || currentUser.fullName || currentUser.email);
      setAvatarUrl(currentUser.avatar || '');
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('openscroll_current_user');
    localStorage.removeItem('openscroll_token');
    setIsLoggedIn(false);
    navigate('/');
    window.location.reload();
  };

  const navContainer = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.6rem 2rem',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9f9f7',
    fontFamily: "'Nunito Sans', sans-serif",
  };

  const logoStyle = {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#1a1a1a',
    textDecoration: 'none',
  };

  const desktopLinks = {
    display: isMobile ? 'none' : 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#1a1a1a',
    fontSize: '1rem',
    fontWeight: '500',
  };

  const buttonStyle = {
    padding: '0.5rem 1.2rem',
    backgroundColor: '#d0f330',
    color: '#1a1a1a',
    border: 'none',
    borderRadius: '9999px',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
  };

  const avatarStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #d1d5db',
  };

  const fallbackAvatar = {
    ...avatarStyle,
    backgroundColor: '#e5e7eb',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '600',
    fontSize: '0.9rem',
    color: '#374151',
  };

  const hamburger = {
    fontSize: '1.5rem',
    cursor: 'pointer',
    display: isMobile ? 'block' : 'none',
  };

  return (
    <nav style={navContainer}>
      <Link to="/" style={logoStyle}>OpenScroll</Link>

      <div style={desktopLinks}>
        <Link to="/articles" style={linkStyle}>Articles</Link>

        {isLoggedIn && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" style={avatarStyle} />
            ) : (
              <div style={fallbackAvatar}>{readerName?.charAt(0)?.toUpperCase()}</div>
            )}
            <span style={{ fontSize: '1rem' }}>{readerName}</span>
          </div>
        )}

        {!isLoggedIn ? (
          <Link to="/login" style={buttonStyle}>Login</Link>
        ) : (
          <button onClick={handleLogout} style={buttonStyle}>Logout</button>
        )}
      </div>

      <div style={hamburger} onClick={() => setMenuOpen(!menuOpen)}>☰</div>

      {menuOpen && isMobile && (
        <div style={{
          position: 'absolute',
          top: '64px',
          right: '1rem',
          background: '#fff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          padding: '1rem',
          zIndex: 999,
        }}>
          <Link to="/articles" style={linkStyle}>Articles</Link><br />
          {isLoggedIn ? (
            <>
              <div style={{ margin: '0.5rem 0' }}>
                <span style={linkStyle}>{readerName}</span>
              </div>
              <button onClick={handleLogout} style={buttonStyle}>Logout</button>
            </>
          ) : (
            <Link to="/login" style={buttonStyle}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
