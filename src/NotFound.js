import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    padding: '2rem',
    backgroundColor: '#f7f7f7'
  };

  const titleStyle = {
    fontSize: '3rem',
    fontWeight: '700',
    color: '#007BFF',
    marginBottom: '1rem'
  };

  const textStyle = {
    fontSize: '1.2rem',
    color: '#555',
    marginBottom: '2rem'
  };

  const linkStyle = {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>404</h1>
      <p style={textStyle}>Oops! The page you're looking for does not exist.</p>
      <Link to="/" style={linkStyle}>
        Go to Home
      </Link>
    </div>
  );
}

export default NotFound;
