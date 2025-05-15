import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from './UserContext';

function WriterNavbar() {
  const [writerName, setWriterName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const { logout, user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setWriterName(user.fullName || user.name || user.email);
      setAvatarUrl(user.avatar || '');
    }
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/writer/login');
  };

  const navContainer = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1.2rem 2rem',
  height: '80px',
  minHeight: '80px',
  width: '100%', // ✅
  backgroundColor: '#f9f9f7',
  borderBottom: '1px solid #e5e7eb',
  position: 'sticky', // or 'fixed' for total control
  top: 0,
  zIndex: 999,
  fontFamily: "'Nunito Sans', sans-serif",
  transition: 'none', // ✅
};


  const logoStyle = {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1a1a1a',
    textDecoration: 'none',
  };

  const rightSection = {
    display: isMobile ? 'none' : 'flex',
    alignItems: 'center',
    gap: '1rem',
  };

  const avatarStyle = {
    width: '36px',
    height: '36px',
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

  const nameStyle = {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#1a1a1a',
  };

  const logoutBtn = {
    backgroundColor: '#d0f330',
    color: '#1a1a1a',
    padding: '0.6rem 1.2rem',
    borderRadius: '9999px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '1rem',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#1a1a1a',
    fontSize: '1rem',
    fontWeight: '500',
  };

  const hamburger = {
    fontSize: '2rem',
    color: '#1a1a1a',
    cursor: 'pointer',
    display: isMobile ? 'block' : 'none',
  };

  const mobileMenu = {
    display: menuOpen ? 'flex' : 'none',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    position: 'absolute',
    top: '80px',
    right: '2rem',
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    zIndex: 999,
  };

  return (
    <nav style={navContainer}>
      <Link to="/" style={logoStyle}>OpenScroll</Link>

      {/* Desktop Menu */}
      <div style={rightSection}>
        <Link to="/writer/dashboard" style={linkStyle}>Dashboard</Link>
        <Link to="/writer/new-article" style={linkStyle}>Add Article</Link>

        {user && (
          <>
            {avatarUrl ? (
              <img src={avatarUrl} alt="profile" style={avatarStyle} />
            ) : (
              <div style={fallbackAvatar}>
                {writerName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
            <Link to="/writer/dashboard" style={{ ...nameStyle, textDecoration: 'none' }}>
              {writerName?.split(' ')[0]}
            </Link>
            <button onClick={handleLogout} style={logoutBtn}>Logout</button>
          </>
        )}
      </div>

      {/* Hamburger */}
      <div style={hamburger} onClick={() => setMenuOpen(!menuOpen)}>☰</div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={mobileMenu}>
          <Link to="/writer/dashboard" style={linkStyle}>Dashboard</Link>
          <Link to="/writer/new-article" style={linkStyle}>Add Article</Link>
          {user && (
            <>
              {avatarUrl ? (
                <img src={avatarUrl} alt="profile" style={avatarStyle} />
              ) : (
                <div style={fallbackAvatar}>
                  {writerName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <span style={nameStyle}>{writerName?.split(' ')[0]}</span>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} style={logoutBtn}>
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default WriterNavbar;
