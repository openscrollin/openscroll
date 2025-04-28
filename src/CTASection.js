import React from 'react';
import { Link } from 'react-router-dom';

function CTASection() {
  const sectionStyle = {
    padding: '6rem 2rem',
    backgroundColor: '#f3f4f6',
    textAlign: 'center',
  };

  const headingStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '2rem',
  };

  const buttonStyle = {
    padding: '1rem 2rem',
    backgroundColor: '#2c2c2c',
    color: 'white',
    fontSize: '1.2rem',
    fontWeight: '700',
    borderRadius: '9999px',
    textDecoration: 'none',
    transition: 'background-color 0.3s',
  };

  return (
    <section className="fade-in-up" style={sectionStyle}>
      <h2 style={headingStyle}>
        Ready to Unlock Your Knowledge Journey?
      </h2>
      <Link to="/signup" style={buttonStyle}>
        Get Started Now
      </Link>
    </section>
  );
}

export default CTASection;
