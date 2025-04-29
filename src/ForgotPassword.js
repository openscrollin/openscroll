import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      console.log('Password reset email sent to:', email);
      setSubmitted(true);
    }
  };

  const container = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f9f9f7',
    fontFamily: "'Nunito Sans', sans-serif",
    padding: isMobile ? '2rem' : '4rem',
  };

  const formStyle = {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  };

  const inputStyle = {
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    outline: 'none',
  };

  const buttonStyle = {
    padding: '1rem',
    borderRadius: '8px',
    backgroundColor: '#2c2c2c',
    color: 'white',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    border: 'none',
  };

  const heading = {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: '1rem',
  };

  const subText = {
    fontSize: '1rem',
    color: '#6b7280',
    textAlign: 'center',
  };

  const successMessage = {
    color: 'green',
    fontSize: '1rem',
    textAlign: 'center',
    marginTop: '1rem',
  };

  return (
    <div style={container}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <h1 style={heading}>Reset Your Password</h1>
        <p style={subText}>Enter your registered email address. We'll send you password reset instructions.</p>
        
        <input
          type="email"
          placeholder="Email Address"
          style={inputStyle}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" style={buttonStyle}>Send Reset Link</button>

        {submitted && <p style={successMessage}>If your email is registered, instructions have been sent!</p>}

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Link to="/login" style={{ color: '#2c2c2c', fontWeight: '600' }}>
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
