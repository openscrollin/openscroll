import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  const heroContainer = {
    width: '100%',
    minHeight: '100vh',
    //background: 'radial-gradient(ellipse at 60% 40%, #10120a 60%, #07080a 100%)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 2rem',
    color: '#fff',
    textAlign: 'center',
    paddingTop: '8rem',
    position: 'relative',
    overflow: 'hidden',
  };

  const content = {
    zIndex: 2,
    maxWidth: '900px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const badge = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(208,243,48,0.08)',
    border: '1.5px solid #d0f33055',
    color: '#d0f330',
    fontFamily: 'Fira Mono, monospace',
    fontWeight: 600,
    fontSize: '1rem',
    borderRadius: '2rem',
    padding: '0.4rem 1.3rem',
    marginBottom: '2.5rem',
    boxShadow: '0 0 12px #d0f33022',
    letterSpacing: '1px',
    userSelect: 'none',
  };

  const heading = {
    fontSize: '3.2rem',
    fontWeight: '800',
    marginBottom: '1.2rem',
    lineHeight: 1.1,
    color: '#fff',
    textShadow: '0 0 32px #d0f33033, 0 2px 12px #000a',
  };

  const highlightBox = {
    display: 'inline-block',
    background: 'rgba(208,243,48,0.08)',
    border: '2.5px solid #d0f330',
    borderRadius: '0.5rem',
    padding: '0.2em 0.7em',
    margin: '0.2em 0',
    color: '#d0f330',
    fontWeight: 900,
    fontSize: '3.2rem',
    boxShadow: '0 0 32px #d0f33077',
    textShadow: '0 0 16px #d0f33099',
    position: 'relative',
    zIndex: 2,
  };

  const subheading = {
    fontSize: '1.35rem',
    margin: '2.2rem 0 2.8rem 0',
    color: '#eaeaea',
    textShadow: '0 2px 12px #000a',
    fontWeight: 400,
    maxWidth: '700px',
  };

  const buttonRow = {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    marginTop: '1.5rem',
    flexWrap: 'wrap',
  };

  const startBtn = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
    padding: '1.1rem 2.8rem',
    background: 'rgba(0,0,0,0.7)',
    border: '2px solid #d0f330',
    color: '#d0f330',
    fontWeight: 700,
    fontSize: '1.2rem',
    borderRadius: '1rem',
    boxShadow: '0 0 24px #d0f33044',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
    position: 'relative',
    zIndex: 2,
  };

  const matrixBtn = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
    padding: '1.1rem 2.8rem',
    background: 'rgba(208,243,48,0.08)',
    border: '2px solid #d0f33044',
    color: '#fff',
    fontWeight: 700,
    fontSize: '1.2rem',
    borderRadius: '1rem',
    boxShadow: '0 0 12px #d0f33022',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
    position: 'relative',
    zIndex: 2,
  };

  // Add hover handlers for buttons
  const handleStartHover = e => {
    e.target.style.background = '#d0f330';
    e.target.style.color = '#111';
    e.target.style.boxShadow = '0 0 32px #d0f33099';
    e.target.style.transition = 'all 0.18s';
    e.target.style.borderColor = '#d0f330';
  };
  const handleStartOut = e => {
    e.target.style.background = 'rgba(0,0,0,0.7)';
    e.target.style.color = '#d0f330';
    e.target.style.boxShadow = '0 0 24px #d0f33044';
    e.target.style.borderColor = '#d0f330';
  };

  const handleMatrixHover = e => {
    e.target.style.background = '#d0f330';
    e.target.style.color = '#111';
    e.target.style.boxShadow = '0 0 32px #d0f33099';
    e.target.style.transition = 'all 0.18s';
    e.target.style.borderColor = '#d0f330';
  };
  const handleMatrixOut = e => {
    e.target.style.background = 'rgba(208,243,48,0.08)';
    e.target.style.color = '#fff';
    e.target.style.boxShadow = '0 0 12px #d0f33022';
    e.target.style.borderColor = '#d0f33044';
  };

  return (
    <section className="fade-in-up" style={heroContainer}>
      <div style={content}>
        <div style={badge}>
          <span role="img" aria-label="AI"></span>
          AI-POWERED STORYTELLING
          <span role="img" aria-label="Zap">⚡</span>
        </div>
        <h1 style={heading}>
          Future of <br />
          <span style={highlightBox}>Digital Stories</span>
        </h1>
        <p style={subheading}>
          Enter the next generation of storytelling. Create, share, and monetize your stories with AI-enhanced tools in a cyberpunk-inspired digital universe.
        </p>
        <div style={buttonRow}>
          <Link
            to="/writer/login" // updated link to writer login page
            style={startBtn}
            onMouseEnter={handleStartHover}
            onMouseLeave={handleStartOut}
          >
            <span role="img" aria-label="Zap"></span>
            Start Creating
            <span style={{ marginLeft: 8, fontWeight: 400, fontSize: '1.3em' }}>&rarr;</span>
          </Link>
          <Link
            to="/articles"
            style={matrixBtn}
            onMouseEnter={handleMatrixHover}
            onMouseLeave={handleMatrixOut}
          >
            <span role="img" aria-label="Shield"></span>
            Explore Matrix
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
