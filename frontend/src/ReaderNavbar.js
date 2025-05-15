import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from './UserContext';

function ReaderNavbar() {
  const [readerName, setReaderName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setReaderName(user.name || user.fullName || user.email);
      setAvatarUrl(user.avatar || '');
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navContainer = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    backgroundColor: 'transparent',
    position: 'absolute',
    width: '100%',
    zIndex: 1000,
    fontFamily: "'Nunito Sans', sans-serif",
  };

  const logoStyle = {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1a1a1a',
    textDecoration: 'none',
  };

  const rightSection = {
    display: window.innerWidth > 768 ? 'flex' : 'none',
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

  const hamburger = {
    fontSize: '2rem',
    color: '#1a1a1a',
    cursor: 'pointer',
    display: window.innerWidth <= 768 ? 'block' : 'none',
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

      {/* Desktop */}
      <div style={rightSection}>
        {avatarUrl ? (
          <img src={avatarUrl} alt="profile" style={avatarStyle} />
        ) : (
          <div style={fallbackAvatar}>
            {readerName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        )}
        <Link to="/reader/dashboard" style={{ ...nameStyle, cursor: 'pointer', textDecoration: 'none' }}>
          {readerName}
        </Link>

        <button onClick={handleLogout} style={logoutBtn}>Logout</button>
      </div>

      {/* Hamburger */}
      <div style={hamburger} onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={mobileMenu}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="profile" style={avatarStyle} />
          ) : (
            <div style={fallbackAvatar}>
              {readerName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
          <Link to="/reader/dashboard" style={{ ...nameStyle, cursor: 'pointer', textDecoration: 'none' }}>
  {readerName}
</Link>

          <button onClick={() => { handleLogout(); setMenuOpen(false); }} style={logoutBtn}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default ReaderNavbar;
