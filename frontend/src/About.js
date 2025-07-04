import React from 'react';

function About() {
  const sectionStyle = {
    padding: '6rem 2rem',
    textAlign: 'center',
    minHeight: '70vh',
    position: 'relative',
    zIndex: 1,
    //background: '#07080a',
  };

  const headingStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#171717',
    marginBottom: '3rem',
    letterSpacing: '-1px',
  };

  const gridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '2rem',
  };

  // Glassmorphism card style (matching ArticleDetails/Insights cards)
  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(15px) saturate(1.2)',
    WebkitBackdropFilter: 'blur(15px) saturate(1.2)',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(208,243,48,0.2)',
    border: '1px solid #d0f33055',
    padding: '2rem',
    flex: '0 1 320px',
    textAlign: 'left',
    color: '#e0e0e0',
    transition: 'transform 0.3s, box-shadow 0.22s, border-color 0.22s',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
  };

  const cardTitle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#d0f330',
    letterSpacing: '-.5px',
  };

  const cardText = {
    fontSize: '1.08rem',
    color: '#e0e0e0',
    lineHeight: '1.7',
    opacity: 0.95,
  };

  const iconStyle = {
    width: '32px',
    height: '32px',
    color: '#d0f330',
    margin: '0 auto 1rem auto',
    display: 'block',
  };

  return (
    <section className="about-section fade-in-up" style={sectionStyle}>
      <h2 style={headingStyle}>Our Mission is Unlocking Exclusive Knowledge</h2>
      <div style={gridStyle}>
        <div className="glass-card hover" style={cardStyle}>
          {/* Neon icon only, no solid circle */}
          <svg style={iconStyle} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="#d0f330" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 19.5V6.75A2.25 2.25 0 016.25 4.5h11.5A2.25 2.25 0 0120 6.75v12.75M4 19.5h16M4 19.5v-1.5a2.25 2.25 0 012.25-2.25h11.5A2.25 2.25 0 0120 18v1.5" />
          </svg>
          <h3 style={cardTitle}>Curated Insights</h3>
          <p style={cardText}>
            Access handpicked articles across industries, offering high-value insights you won't easily find elsewhere.
          </p>
        </div>
        <div className="glass-card hover" style={cardStyle}>
          <svg style={iconStyle} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="#d0f330" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18m9-9H3" />
          </svg>
          <h3 style={cardTitle}>Empower Growth</h3>
          <p style={cardText}>
            Unlock information that fuels personal and professional growth, with resources updated continuously.
          </p>
        </div>
        <div className="glass-card hover" style={cardStyle}>
          <svg style={iconStyle} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="#d0f330" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-7.07l-1.41 1.41M6.34 17.66l-1.41 1.41m12.02 0l1.41-1.41M6.34 6.34L4.93 4.93" />
          </svg>
          <h3 style={cardTitle}>Accessible Knowledge</h3>
          <p style={cardText}>
            We believe curated knowledge should be available to everyone willing to learn, adapt, and innovate.
          </p>
        </div>
      </div>
      <style>{`
        .glass-card.hover:hover {
          transform: scale(1.03);
          box-shadow: 0 0 32px 0 #d0f33080, 0 4px 32px 0 #000a;
          border-color: #d0f330;
          transition: all 0.2s cubic-bezier(.4,0,.2,1);
        }
      `}</style>
    </section>
  );
}

export default About;
