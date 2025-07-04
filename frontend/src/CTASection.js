import React from 'react';
import { Link } from 'react-router-dom';

function CTASection() {
  const sectionStyle = {
    padding: '6rem 2rem',
    textAlign: 'center',
  };

  const headingStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '2rem',
  };

  // Glassmorphism/neon button style (matching other pages)
  const buttonStyle = {
    padding: '1rem 2.5rem',
    background: 'rgba(255,255,255,0.08)',
    color: '#d0f330',
    fontSize: '1.2rem',
    fontWeight: '700',
    borderRadius: '12px',
    border: '1.5px solid #d0f33055',
    boxShadow: '0 4px 24px 0 rgba(208,243,48,0.10), 0 2px 8px 0 #0006',
    textDecoration: 'none',
    backdropFilter: 'blur(10px) saturate(1.2)',
    WebkitBackdropFilter: 'blur(10px) saturate(1.2)',
    transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
    display: 'inline-block',
    cursor: 'pointer',
    marginTop: '1rem',
  };

  return (
    <section className="fade-in-up" style={sectionStyle}>
      <h2 style={headingStyle}>
        Ready to Unlock Your Knowledge Journey?
      </h2>
      <Link
        to="/signup"
        style={buttonStyle}
        onMouseOver={e => {
          e.target.style.background = '#d0f330';
          e.target.style.color = '#111';
          e.target.style.boxShadow = '0 0 32px 0 #d0f33080, 0 4px 32px 0 #000a';
          e.target.style.borderColor = '#d0f330';
        }}
        onMouseOut={e => {
          e.target.style.background = 'rgba(255,255,255,0.08)';
          e.target.style.color = '#d0f330';
          e.target.style.boxShadow = '0 4px 24px 0 rgba(208,243,48,0.10), 0 2px 8px 0 #0006';
          e.target.style.borderColor = '#d0f33055';
        }}
      >
        Get Started Now
      </Link>
    </section>
  );
}

export default CTASection;
