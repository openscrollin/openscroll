import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navContainer = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.7rem 1rem',
    background: '#07080a',
    borderBottom: '0.01px solid #d0f330',
    boxShadow: '0 2px 24px 0 #d0f33022',
    position: 'fixed',
    width: '100%',
    left: 0,
    top: 0,
    zIndex: 100, // <-- increase this value above the moving grid's z-index
    minHeight: '64px',
    justifyContent: 'space-between',
    fontFamily: "'Nunito Sans', sans-serif",
  };

  const logoRow = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flex: 1, // ensures logo stays left
  };

  const rightWrapper = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
    marginLeft: 'auto', // pushes rightWrapper to the extreme right
  };

  const logoIcon = {
    width: 48,
    height: 48,
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #d0f330 60%, #bde32c 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 24px #d0f33077',
    position: 'relative',
  };

  const logoSvg = {
    width: 28,
    height: 28,
    color: '#111',
    display: 'block',
    zIndex: 1,
  };

  const logoTextCol = {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.1,
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
    marginTop: '5px',
  };

  const rightRow = {
    display: isMobile ? 'none' : 'flex',
    alignItems: 'center',
    gap: '1.2rem',
  };

  const signInStyle = {
    background: 'none',
    border: 'none',
    color: '#d0f330',
    fontWeight: 600,
    fontSize: '1.1rem',
    fontFamily: 'Nunito sans, Sans Serif',
    cursor: 'pointer',
    padding: 0,
    marginRight: '0.5rem',
    textDecoration: 'none',
    transition: 'color 0.18s',
  };

  const getStartedStyle = {
    background: '#d0f330',
    color: '#111',
    fontWeight: 700,
    fontSize: '1.15rem',
    fontFamily: 'Nunito Sans, Nunito sans, Sans Serif',
    border: 'none',
    borderRadius: '16px',
    padding: '0.7rem 2rem',
    boxShadow: '0 0 24px #d0f33055',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
    marginLeft: '0.2rem',
  };

  const hamburger = {
    fontSize: '2rem',
    padding: '0.7rem 0.3rem',
    color: '#d0f330',
    display: isMobile ? 'block' : 'none',
    background: 'none',
    border: 'none',
    zIndex: 2000, // Add this line
  };

  // Add hover handlers for buttons
  const handleSignInHover = e => {
    e.target.style.color = '#111';
    e.target.style.background = '#d0f330';
    e.target.style.boxShadow = '0 0 24px #d0f33077';
    e.target.style.transition = 'all 0.18s';
  };
  const handleSignInOut = e => {
    e.target.style.color = '#d0f330';
    e.target.style.background = 'none';
    e.target.style.boxShadow = 'none';
  };

  const handleGetStartedHover = e => {
    e.target.style.background = '#bde32c';
    e.target.style.color = '#111';
    e.target.style.boxShadow = '0 0 32px #d0f33099';
    e.target.style.transition = 'all 0.18s';
  };
  const handleGetStartedOut = e => {
    e.target.style.background = '#d0f330';
    e.target.style.color = '#111';
    e.target.style.boxShadow = '0 0 24px #d0f33055';
  };

  // Mobile menu styles
  const mobileMenu = {
    display: menuOpen ? 'flex' : 'none',
    flexDirection: 'column',
    position: 'fixed',
    top: '100%',
    right: 0,
    left: 0,
    background: 'rgba(7,8,10,0.97)',
    boxShadow: '0 8px 32px #000a',
    padding: '1.5rem 1.2rem 1.2rem 1.2rem',
    zIndex: 100,
    borderBottomLeftRadius: '0.8rem',
    borderBottomRightRadius: '0.8rem',
    animation: menuOpen ? 'fadeInDown 0.25s' : 'none',
  };

  const mobileButtonRow = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '0.5rem',
    alignItems: 'stretch',
  };

  return (
    <nav style={navContainer}>
      <div style={logoRow}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <div style={logoIcon}>
            {/* BookOpen SVG */}
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
          <Link
            to="/login"
            style={signInStyle}
            onMouseEnter={handleSignInHover}
            onMouseLeave={handleSignInOut}
          >
            Sign In
          </Link>
          <Link
            to="/roles"
            style={getStartedStyle}
            onMouseEnter={handleGetStartedHover}
            onMouseLeave={handleGetStartedOut}
          >
            Get Started
          </Link>
        </div>
        <button style={hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">
          ☰
        </button>
      </div>

      {/* Mobile menu with Sign In and Get Started */}
      {isMobile && menuOpen && (
        <div style={mobileMenu}>
          <div style={mobileButtonRow}>
            <Link
              to="/login"
              style={{
                ...signInStyle,
                width: '100%',
                textAlign: 'left',
                padding: '0.7rem 0.5rem',
                borderRadius: '10px',
                background: 'none',
                color: '#d0f330',
              }}
              onClick={() => setMenuOpen(false)}
              onMouseEnter={handleSignInHover}
              onMouseLeave={handleSignInOut}
            >
              Sign In
            </Link>
            <Link
              to="/roles"
              style={{
                ...getStartedStyle,
                width: '100%',
                textAlign: 'left',
                padding: '0.7rem 0.5rem',
                borderRadius: '10px',
                background: '#d0f330',
                color: '#111',
              }}
              onClick={() => setMenuOpen(false)}
              onMouseEnter={handleGetStartedHover}
              onMouseLeave={handleGetStartedOut}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-16px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </nav>
  );
}

export default Navbar;