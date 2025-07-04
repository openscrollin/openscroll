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
      setWriterName(user.fullName || user.name || user.email || 'User');
      setAvatarUrl(user.avatar || '');
    } else {
      setWriterName('');
      setAvatarUrl('');
    }
  }, [user]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/writer/login');
  };

  const navContainer = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.7rem 1rem',
    background: '#07080a',
    borderBottom: '0.01px solid #d0f330',
    boxShadow: '0 2px 24px 0 #d0f33022',
    position: 'sticky',
    top: 0,
    zIndex: 1001,
    minHeight: '64px',
    justifyContent: 'space-between',
    fontFamily: "'Nunito Sans', sans-serif",
  };

  const logoRow = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
  };

  const logoIcon = {
    width: '38px',
    height: '38px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#d0f330',
    borderRadius: '12px',
    marginRight: '0.5rem',
    boxShadow: '0 0 12px #d0f33033',
  };

  const logoSvg = {
    width: '28px',
    height: '28px',
    display: 'block',
  };

  const logoTextCol = {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1,
  };

  const logoBrand = {
    fontFamily: 'Nunito sans, Sans Serif',
    fontWeight: 700,
    fontSize: '1.5rem',
    color: '#d0f330',
    letterSpacing: '1px',
    marginBottom: 0,
  };

  const logoSub = {
    fontFamily: 'Nunito sans, Sans Serif',
    fontWeight: 0,
    fontSize: '0.7rem',
    color: '#d0f330',
    letterSpacing: '3px',
    marginTop: '5px'
  };

  const rightWrapper = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
  };

  const rightRow = {
    display: isMobile ? 'none' : 'flex',
    alignItems: 'center',
    gap: '1.2rem',
  };

  const avatarStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #d0f330',
    background: '#181a13',
  };

  const fallbackAvatar = {
    ...avatarStyle,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '600',
    fontSize: '0.9rem',
    color: '#d0f330',
    background: '#181a13',
  };

  const nameStyle = {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#fff',
    fontFamily: "'Nunito Sans', Nunito sans, Sans Serif",
    marginLeft: '0.5rem',
    textDecoration: 'none',
  };

  const logoutBtn = {
    backgroundColor: '#d0f330',
    color: '#111',
    padding: '0.6rem 1.2rem',
    borderRadius: '9999px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '1rem',
    marginLeft: '0.5rem',
    boxShadow: '0 0 8px #d0f33033',
    transition: 'background 0.18s, color 0.18s',
  };

  const navLinkStyle = {
    textDecoration: 'none',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'color 0.2s',
    padding: '0.3rem 0.7rem',
    borderRadius: '8px',
  };

  const hamburger = {
    fontSize: '2rem',
    color: '#d0f330',
    cursor: 'pointer',
    display: isMobile ? 'block' : 'none',
    background: 'none',
    border: 'none',
    zIndex: 2000,
  };

  const mobileMenu = {
    display: menuOpen ? 'flex' : 'none',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '1.2rem',
    position: 'absolute',
    top: '64px',
    right: '1rem',
    background: '#07080a',
    padding: '1.5rem 1.2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 24px #d0f33022',
    zIndex: 1500,
    minWidth: '220px',
  };

  return (
    <nav style={navContainer}>
      <div style={logoRow}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <div style={logoIcon}>
            <svg style={logoSvg} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="#111" strokeWidth="2"/>
              <path d="M8 8h8M8 12h8M8 16h4" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={logoTextCol}>
            <span style={logoBrand}>OpenScroll</span>
            <span style={logoSub}>FUTURE.STORIES</span>
          </div>
        </Link>
      </div>

      <div style={rightWrapper}>
        <div style={rightRow}>
          <Link to="/writer/dashboard" style={navLinkStyle}>Dashboard</Link>
          <Link to="/writer/new-article" style={navLinkStyle}>Add Article</Link>
          {avatarUrl ? (
            <img src={avatarUrl} alt="profile" style={avatarStyle} />
          ) : (
            <div style={fallbackAvatar}>
              {writerName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
          <Link to="/writer/dashboard" style={nameStyle}>
            {writerName}
          </Link>
          <button onClick={handleLogout} style={logoutBtn}>Logout</button>
        </div>
        <button style={hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobile && menuOpen && (
        <div style={mobileMenu}>
          <Link to="/writer/dashboard" style={navLinkStyle} onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <Link to="/writer/new-article" style={navLinkStyle} onClick={() => setMenuOpen(false)}>Add Article</Link>
          {avatarUrl ? (
            <img src={avatarUrl} alt="profile" style={avatarStyle} />
          ) : (
            <div style={fallbackAvatar}>
              {writerName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
          <Link to="/writer/dashboard" style={nameStyle} onClick={() => setMenuOpen(false)}>
            {writerName}
          </Link>
          <button onClick={() => { handleLogout(); setMenuOpen(false); }} style={logoutBtn}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default WriterNavbar;