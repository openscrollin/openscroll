import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  const heroContainer = {
    width: '100%',
    minHeight: '100vh',
    backgroundImage: `url('/hero-background.jpg')`, // ✅ We will add this image shortly
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 2rem',
    color: 'white',
    textAlign: 'center',
    position: 'relative',
  };

  const overlay = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1,
  };

  const content = {
    zIndex: 2,
    maxWidth: '800px',
  };

  const heading = {
    fontSize: '3rem',
    fontWeight: '700',
    marginBottom: '1rem',
  };

  const subheading = {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    color: '#e5e7eb',
  };

  const buttonStyle = {
    padding: '0.75rem 2rem',
    backgroundColor: '#d0f330',
    color: '#1a1a1a',
    border: 'none',
    borderRadius: '9999px',
    fontWeight: '700',
    fontSize: '1rem',
    cursor: 'pointer',
    textDecoration: 'none',
  };

  return (
    <section className="fade-in-up" style={heroContainer}>
      <div style={overlay}></div>
      <div style={content}>
        <h1 style={heading}>Unlock Knowledge, One Scroll at a Time</h1>
        <p style={subheading}>
          Access exclusive articles and insights with OpenScroll — your gateway to curated knowledge.
        </p>
        <Link to="/articles" style={buttonStyle}>View Articles</Link>
      </div>
    </section>
  );
}

export default Hero;
