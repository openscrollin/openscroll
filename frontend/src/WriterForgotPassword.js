import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function WriterForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      console.log('Password reset link sent to:', email);
      setSubmitted(true);
    }
  };

  const container = {
    minHeight: '100vh',
    backgroundColor: '#f9f9f7',
    fontFamily: "'Nunito Sans', sans-serif",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  };

  const formStyle = {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: '400px',
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    marginBottom: '1.5rem',
    fontSize: '1rem',
  };

  const buttonStyle = {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#2c2c2c',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '1rem',
  };

  const heading = {
    fontSize: '1.8rem',
    fontWeight: '700',
    marginBottom: '1rem',
    textAlign: 'center',
    color: '#1a1a1a',
  };

  const text = {
    color: '#6b7280',
    fontSize: '1rem',
    marginBottom: '2rem',
    textAlign: 'center',
  };

  const successText = {
    color: 'green',
    textAlign: 'center',
    fontSize: '1rem',
  };

  return (
    <div style={container}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <h1 style={heading}>Reset Your Password</h1>
        <p style={text}>Enter your registered writer email to receive a reset link.</p>

        <input
          type="email"
          placeholder="Email Address"
          style={inputStyle}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" style={buttonStyle}>Send Reset Link</button>

        {submitted && <p style={successText}>If your email exists, reset instructions have been sent!</p>}

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/writer/login" style={{ color: '#2c2c2c', fontWeight: '600' }}>
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default WriterForgotPassword;
