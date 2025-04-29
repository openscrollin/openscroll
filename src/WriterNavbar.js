import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function WriterNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('openscroll_current_writer');
    navigate('/writer/login');
  };

  const navbar = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    fontFamily: "'Nunito Sans', sans-serif",
    position: 'sticky',
    top: 0,
    zIndex: 100,
  };

  const logo = {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1a1a1a',
    textDecoration: 'none',
  };

  const navLinks = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  };

  const button = {
    padding: '0.6rem 1.2rem',
    backgroundColor: '#2c2c2c',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    textDecoration: 'none',
  };

  const profile = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#2c2c2c',
  };

  return (
    <nav style={navbar}>
      <Link to="/writer/dashboard" style={logo}>OpenScroll</Link>

      <div style={navLinks}>
        <Link to="/writer/dashboard" style={{ color: '#2c2c2c', textDecoration: 'none', fontWeight: '600' }}>
          Dashboard
        </Link>

        <Link to="/writer/new-article" style={button}>
          ➕ Add Article
        </Link>

        <div onClick={handleLogout} style={profile}>
          <img src="/profile-placeholder.png" alt="profile" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
          Logout
        </div>
      </div>
    </nav>
  );
}

export default WriterNavbar;
