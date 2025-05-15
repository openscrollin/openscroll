import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

function WriterLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [redirectReady, setRedirectReady] = useState(false);
  const navigate = useNavigate();

  const { login: setUserContext } = useContext(UserContext);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (redirectReady) {
      navigate('/writer/dashboard');
    }
  }, [redirectReady, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5002/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'writer' }),
      });

      const data = await res.json();
      console.log('🔁 Login response:', data);

      if (!res.ok) throw new Error(data.message || 'Login failed');
      if (data.user.role !== 'writer') throw new Error('This login is only for writers.');

      localStorage.removeItem('readerToken');
      localStorage.removeItem('openscroll_current_user');
      localStorage.setItem('writerToken', data.token);
      localStorage.setItem('openscroll_current_user', JSON.stringify(data.user));

      setUserContext(data.user, data.token);
      setRedirectReady(true); // Trigger useEffect redirect

    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div style={container(isMobile)}>
      <div style={leftSide(isMobile)}>
        <div>
          <h1 style={heading(isMobile)}>Welcome Writer!</h1>
          <p style={subheading(isMobile)}>Log in to your writer dashboard</p>

          <form style={formGroup} onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
            <button type="submit" style={buttonStyle}>Log In</button>
          </form>

          {error && <div style={errorText}>{error}</div>}

          <div style={smallText}>
            Don’t have a writer account?{' '}
            <Link to="/writer/signup" style={{ color: '#2c2c2c', fontWeight: '600' }}>
              Sign Up
            </Link>
          </div>

          <div style={{ ...smallText, marginTop: '0.5rem' }}>
            <Link to="/writer/forgot-password" style={{ color: '#6b7280', textDecoration: 'underline' }}>
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>

      <div style={rightSide(isMobile)}>
        <h2 style={tagline(isMobile)}>Your Words Deserve an Audience. Start Writing Today.</h2>
      </div>
    </div>
  );
}

// ======= Styles =======
const container = (mobile) => ({
  display: 'flex',
  flexDirection: mobile ? 'column' : 'row',
  minHeight: '100vh',
  backgroundColor: '#f9f9f7',
  fontFamily: "'Nunito Sans', sans-serif",
});

const leftSide = (mobile) => ({
  flex: 1,
  backgroundColor: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: mobile ? '2rem 1.5rem' : '4rem 3rem',
});

const rightSide = (mobile) => ({
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
  minHeight: mobile ? '250px' : 'auto',
});

const formGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginTop: '2rem',
};

const inputStyle = {
  padding: '0.8rem',
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

const heading = (mobile) => ({
  fontSize: mobile ? '1.8rem' : '2.2rem',
  fontWeight: '700',
  color: '#1a1a1a',
  textAlign: 'center',
});

const subheading = (mobile) => ({
  marginTop: '0.5rem',
  fontSize: mobile ? '0.95rem' : '1rem',
  color: '#6b7280',
  textAlign: 'center',
});

const tagline = (mobile) => ({
  fontSize: mobile ? '1.6rem' : '2.2rem',
  fontWeight: '700',
  maxWidth: '400px',
  lineHeight: '1.3',
  textAlign: 'center',
});

const errorText = {
  color: 'red',
  fontSize: '0.9rem',
  marginTop: '1rem',
  textAlign: 'center',
};

export default WriterLogin;
