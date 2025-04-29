import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function WriterLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill all fields.');
      return;
    }

    const existingWriters = JSON.parse(localStorage.getItem('openscroll_writers')) || [];

    const matchedWriter = existingWriters.find(
      (writer) => writer.email === email && writer.password === password
    );

    if (!matchedWriter) {
      setError('Invalid email or password.');
      return;
    }

    localStorage.setItem('openscroll_current_writer', JSON.stringify(matchedWriter));

    console.log('Writer Login successful', matchedWriter);

    navigate('/writer/dashboard');
  };

  const container = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    minHeight: '100vh',
    backgroundColor: '#f9f9f7',
    fontFamily: "'Nunito Sans', sans-serif",
  };

  const leftSide = {
    flex: 1,
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: isMobile ? '2rem 1.5rem' : '4rem 3rem',
  };

  const rightSide = {
    flex: 1,
    backgroundImage: `url('/hero-background.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    padding: '2rem',
    minHeight: isMobile ? '250px' : 'auto',
  };

  const formGroup = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
    marginTop: '2rem',
  };

  const inputStyle = {
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    outline: 'none',
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
  };

  const buttonStyle = {
    padding: '0.9rem',
    borderRadius: '8px',
    backgroundColor: '#2c2c2c',
    color: 'white',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    border: 'none',
    marginTop: '1rem',
    width: '100%',
    maxWidth: '400px',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  const smallText = {
    marginTop: '1.5rem',
    fontSize: '0.9rem',
    color: '#6b7280',
    textAlign: 'center',
  };

  const welcomeHeading = {
    fontSize: isMobile ? '1.8rem' : '2.2rem',
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
  };

  const welcomeSubtext = {
    marginTop: '0.5rem',
    fontSize: isMobile ? '0.95rem' : '1rem',
    color: '#6b7280',
    textAlign: 'center',
  };

  const tagline = {
    fontSize: isMobile ? '1.6rem' : '2.2rem',
    fontWeight: '700',
    maxWidth: '400px',
    lineHeight: '1.3',
    textAlign: 'center',
  };

  const errorText = {
    color: 'red',
    fontSize: '0.9rem',
    marginTop: '1rem',
    textAlign: 'center',
  };

  return (
    <div style={container}>
      
      {/* Left Side */}
      <div style={leftSide}>
        <div>
          <h1 style={welcomeHeading}>Writer Login</h1>
          <p style={welcomeSubtext}>Access your articles dashboard</p>

          <form style={formGroup} onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Forgot Password Link centered */}
            <div style={{ textAlign: 'center', marginTop: '-0.5rem', marginBottom: '1rem' }}>
              <Link to="/writer/forgot-password" style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Forgot Password?
              </Link>
            </div>

            <button type="submit" style={buttonStyle}>Log In</button>
          </form>

          {error && <div style={errorText}>{error}</div>}

          <div style={smallText}>
            New writer? <Link to="/writer/signup" style={{ color: '#2c2c2c', fontWeight: '600' }}>Sign Up</Link>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div style={rightSide}>
        <h2 style={tagline}>Write. Publish. Earn.</h2>
      </div>

    </div>
  );
}

export default WriterLogin;
