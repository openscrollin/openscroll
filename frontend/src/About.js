import React from 'react';

function About() {
  const sectionStyle = {
    padding: '6rem 2rem',
    backgroundColor: '#f9f9f7',
    textAlign: 'center',
  };

  const headingStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '3rem',
  };

  const gridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '2rem',
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    padding: '2rem',
    flex: '0 1 300px',
    textAlign: 'left',
  };

  const cardTitle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#1a1a1a',
  };

  const cardText = {
    fontSize: '1rem',
    color: '#6b7280',
    lineHeight: '1.7',
  };

  return (
    <section className="fade-in-up" style={sectionStyle}>
      <h2 style={headingStyle}>Our Mission is Unlocking Exclusive Knowledge</h2>
      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3 style={cardTitle}>Curated Insights</h3>
          <p style={cardText}>
            Access handpicked articles across industries, offering high-value insights you won't easily find elsewhere.
          </p>
        </div>
        <div style={cardStyle}>
          <h3 style={cardTitle}>Empower Growth</h3>
          <p style={cardText}>
            Unlock information that fuels personal and professional growth, with resources updated continuously.
          </p>
        </div>
        <div style={cardStyle}>
          <h3 style={cardTitle}>Accessible Knowledge</h3>
          <p style={cardText}>
            We believe curated knowledge should be available to everyone willing to learn, adapt, and innovate.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;
