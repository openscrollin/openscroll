import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('openscroll_current_user'));
    setIsLoggedIn(!!currentUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('openscroll_current_user');
    setIsLoggedIn(false);
    navigate('/');
    window.location.reload(); // To refresh Navbar
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
  };

  const logoStyle = {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1a1a1a',
    textDecoration: 'none',
  };

  const linkGroup = {
    display: menuOpen ? 'flex' : 'none',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    position: 'absolute',
    top: '80px',
    right: '2rem',
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#1a1a1a',
    fontSize: '1.1rem',
    fontWeight: '500',
    transition: 'color 0.3s',
  };

  const buttonStyle = {
    padding: '0.7rem 1.5rem',
    backgroundColor: '#d0f330',
    color: '#1a1a1a',
    border: 'none',
    borderRadius: '9999px',
    fontWeight: '700',
    fontSize: '1rem',
    textDecoration: 'none',
    cursor: 'pointer',
  };

  const hamburger = {
    fontSize: '2rem',
    color: '#1a1a1a',
    cursor: 'pointer',
    display: 'none',
  };

  const desktopLinks = {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  };

  return (
    <nav style={navContainer}>
      {/* Updated: Logo is now a clickable Link */}
      <Link to="/" style={logoStyle}>OpenScroll</Link>

      {/* Desktop Links */}
      <div style={{ ...desktopLinks, display: window.innerWidth > 768 ? 'flex' : 'none' }}>
        <Link to="/about" style={linkStyle}>About</Link>
        <Link to="/articles" style={linkStyle}>Articles</Link>
        <Link to="/team" style={linkStyle}>Team</Link>
        {!isLoggedIn ? (
          <Link to="/login" style={buttonStyle}>Login</Link>
        ) : (
          <button onClick={handleLogout} style={buttonStyle}>Logout</button>
        )}
      </div>

      {/* Hamburger Icon */}
      <div style={{ ...hamburger, display: window.innerWidth <= 768 ? 'block' : 'none' }}
           onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={linkGroup}>
          <Link to="/about" style={linkStyle} onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/articles" style={linkStyle} onClick={() => setMenuOpen(false)}>Articles</Link>
          <Link to="/team" style={linkStyle} onClick={() => setMenuOpen(false)}>Team</Link>
          {!isLoggedIn ? (
            <Link to="/login" style={buttonStyle} onClick={() => setMenuOpen(false)}>Login</Link>
          ) : (
            <button onClick={() => { handleLogout(); setMenuOpen(false); }} style={buttonStyle}>Logout</button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
