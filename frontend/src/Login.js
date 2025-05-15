import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import API_BASE_URL from './config';
import { UserContext } from './UserContext'; // ✅ Added

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: setUserContext } = useContext(UserContext); // ✅ Added

  const isMobile = window.innerWidth < 768;
  const isWriter = location.pathname.includes('/writer');

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: isWriter ? 'writer' : 'reader' })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      if (data.user.role === 'writer') {
        localStorage.removeItem('readerToken');
        localStorage.removeItem('openscroll_current_user');
        localStorage.setItem('writerToken', data.token);
        localStorage.setItem('openscroll_current_user', JSON.stringify(data.user));
        setUserContext(data.user, data.token); // ✅ Sync context
        navigate('/writer/dashboard');
      } else {
        localStorage.removeItem('writerToken');
        localStorage.removeItem('openscroll_current_writer');
        localStorage.setItem('readerToken', data.token);
        localStorage.setItem('openscroll_current_user', JSON.stringify(data.user));
        setUserContext(data.user, data.token); // ✅ Sync context
        navigate('/reader/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div style={container(isMobile)}>
      {/* Left Side */}
      <div style={leftSide(isMobile)}>
        <div>
          <h1 style={heading(isMobile)}>Welcome {isWriter ? 'Writer' : 'Reader'}!</h1>
          <p style={subheading(isMobile)}>Log in to your {isWriter ? 'writer' : 'reader'} dashboard</p>

          <form style={formGroup} onSubmit={handleSubmit}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
              required
            />
            <button type="submit" style={buttonStyle}>Log In</button>
          </form>

          {error && <div style={errorText}>{error}</div>}

          <div style={smallText}>
            Don’t have an account?{' '}
            <Link to={isWriter ? "/writer/signup" : "/signup"} style={{ color: '#2c2c2c', fontWeight: '600' }}>
              Sign Up
            </Link>
          </div>

          <div style={{ ...smallText, marginTop: '0.5rem' }}>
            <Link to={isWriter ? "/writer/forgot-password" : "/forgot-password"} style={{ color: '#6b7280', textDecoration: 'underline' }}>
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side */}
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

export default Login;
