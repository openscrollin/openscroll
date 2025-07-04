import React from 'react';
import { Link } from 'react-router-dom';

function RoleSelection() {
  const container = {
    minHeight: '100vh',
    width: '100%',
    position: 'relative',
    zIndex: 1, // Add this line
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    color: '#fff',
    textAlign: 'center',
    overflow: 'hidden',
    background: '#07080a',
  };

  const heading = {
    fontSize: '2.8rem',
    fontWeight: 800,
    marginBottom: '0.5rem',
    color: '#fff',
    letterSpacing: '-1px',
  };

  const subheading = {
    fontSize: '1.35rem',
    color: '#cfd8dc',
    marginBottom: '2.5rem',
    fontWeight: 400,
  };

  const cardsRow = {
    display: 'flex',
    gap: '3rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: '2rem',
    width: '100%',
    maxWidth: '1200px',
  };

  const card = {
    background: 'rgba(208,243,48,0.08)',
    border: '1.5px solid #d0f33044',
    borderRadius: '2rem',
    boxShadow: '0 0 32px #d0f33022',
    padding: '3rem 2.5rem 2.5rem 2.5rem',
    minWidth: '320px',
    maxWidth: '420px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '2rem',
    position: 'relative',
    transition: 'box-shadow 0.2s, border 0.2s',
  };

  const iconBox = {
    background: '#d0f330',
    borderRadius: '1.2rem',
    width: '70px',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    boxShadow: '0 0 32px #d0f33055',
  };

  const cardTitle = {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '1.2rem',
    color: '#fff',
  };

  const cardDesc = {
    fontSize: '1.15rem',
    color: '#eaeaea',
    marginBottom: '1.5rem',
    fontWeight: 400,
    minHeight: '72px',
  };

  const featureList = {
    textAlign: 'left',
    color: '#d0f330',
    fontSize: '1rem',
    marginBottom: '2rem',
    lineHeight: 1.7,
    fontFamily: 'Nunito Sans, sans-serif',
  };

  const btnRow = {
    display: 'flex',
    gap: '1.2rem',
    justifyContent: 'center',
    marginTop: '1rem',
    flexWrap: 'wrap',
  };

  const btn = {
    padding: '0.8rem 2.2rem',
    borderRadius: '1rem',
    border: '2px solid #d0f330',
    background: 'rgba(0,0,0,0.7)',
    color: '#d0f330',
    fontWeight: 700,
    fontSize: '1.1rem',
    cursor: 'pointer',
    textDecoration: 'none',
    boxShadow: '0 0 18px #d0f33044',
    transition: 'background 0.18s, color 0.18s, box-shadow 0.18s, border 0.18s',
    marginBottom: '0.5rem',
  };

  const btnAlt = {
    ...btn,
    background: '#d0f330',
    color: '#111',
    border: '2px solid #d0f330',
  };

  return (
    <div style={container}>
      {/* Moving grid and neon lines */}
      <div className="moving-lines-bg"></div>
      <h1 style={heading}>Join OpenScroll</h1>
      <div style={subheading}>Choose your path in the world of digital storytelling</div>
      <div style={cardsRow}>
        {/* Writer Card */}
        <div style={card}>
          <div style={iconBox}>
            {/* Book Icon */}
            <svg width="38" height="38" fill="none" viewBox="0 0 24 24" stroke="#07080a">
              <rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="#07080a" strokeWidth="2"/>
              <path d="M8 8h8M8 12h8M8 16h4" stroke="#07080a" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={cardTitle}>Writer</div>
          <div style={cardDesc}>
            Create, publish, and monetize your stories with AI-powered tools. Earn from premium content and build your audience.
          </div>
          <ul style={featureList}>
            <li>• AI-enhanced writing editor</li>
            <li>• Premium content monetization</li>
            <li>• Analytics and earnings tracking</li>
            <li>• Community engagement tools</li>
          </ul>
          <div style={btnRow}>
            <Link to="/writer/login" style={btn}>Login</Link>
            <Link to="/writer/signup" style={btnAlt}>Sign Up</Link>
          </div>
        </div>
        {/* Reader Card */}
        <div style={card}>
          <div style={iconBox}>
            {/* User Icon */}
            <svg width="38" height="38" fill="none" viewBox="0 0 24 24" stroke="#07080a">
              <circle cx="12" cy="9" r="4" stroke="#07080a" strokeWidth="2" />
              <rect x="5" y="17" width="14" height="4" rx="2" stroke="#07080a" strokeWidth="2" />
            </svg>
          </div>
          <div style={cardTitle}>Reader</div>
          <div style={cardDesc}>
            Discover amazing stories, support your favorite writers, and access exclusive premium content tailored to your interests.
          </div>
          <ul style={featureList}>
            <li>• Personalized recommendations</li>
            <li>• Reading history and bookmarks</li>
            <li>• Premium content access</li>
            <li>• Community discussions</li>
          </ul>
          <div style={btnRow}>
            <Link to="/login" style={btn}>Login</Link>
            <Link to="/signup" style={btnAlt}>Sign Up</Link>
          </div>
        </div>
      </div>
      {/* Moving grid CSS only */}
      <style>{`
        .moving-lines-bg {
          position: absolute;  /* changed from fixed */
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .moving-lines-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(to right, #d0f33010 0 1px, transparent 1px 80px),
            repeating-linear-gradient(to bottom, #d0f33010 0 1px, transparent 1px 80px);
          animation: cyberbgmove 8s linear infinite;
          z-index: 0;
        }
        @keyframes cyberbgmove {
          0%   { background-position: 0 0, 0 0; }
          100% { background-position: 80px 80px, 80px 80px; }
        }
      `}</style>
    </div>
  );
}

export default RoleSelection;