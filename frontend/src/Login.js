import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import API_BASE_URL from './config';
import { UserContext } from './UserContext';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: setUserContext } = useContext(UserContext);

  const isMobile = window.innerWidth < 768;
  const isWriter = location.pathname.includes('/writer');

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
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
        setUserContext(data.user, data.token);
        navigate('/writer/dashboard');
      } else {
        localStorage.removeItem('writerToken');
        localStorage.removeItem('openscroll_current_writer');
        localStorage.setItem('readerToken', data.token);
        localStorage.setItem('openscroll_current_user', JSON.stringify(data.user));
        setUserContext(data.user, data.token);
        navigate('/reader/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      localStorage.setItem('readerToken', token);
      localStorage.setItem('openscroll_current_user', JSON.stringify({
        name: user.displayName,
        email: user.email,
        role: 'reader'
      }));

      setUserContext({ name: user.displayName, email: user.email, role: 'reader' }, token);
      navigate('/reader/dashboard');
    } catch (error) {
      console.error('Google login failed:', error);
      setError('Google login failed');
    }
  };

  return (
    <div style={container(isMobile)}>
      <div className="moving-grid-bg"></div>
      <div style={leftSide(isMobile)}>
        <div>
          <h1 style={heading(isMobile, isWriter)}>Welcome {isWriter ? 'Writer' : 'Reader'}!</h1>
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

            <div style={{ position: 'relative', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                style={{ ...inputStyle, paddingRight: '3rem' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '0.75rem',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'gray',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <button type="submit" style={buttonStyle}>Log In</button>
          </form>

          {!isWriter && (
            <button onClick={handleGoogleLogin} style={googleButtonStyle}>
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                style={{ height: '18px', marginRight: '10px', background: '#fff', borderRadius: '50%', padding: '2px', boxShadow: '0 0 4px #0003' }}
              />
              Continue with Google
            </button>
          )}

          {error && <div style={errorText}>{error}</div>}

          <div style={smallText}>
            Don’t have an account?{' '}
            <Link to={isWriter ? "/writer/signup" : "/signup"} style={{ color: '#d0f330', fontWeight: '600' }}>
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

      <div style={rightSide(isMobile)}>
        <h2 style={tagline(isMobile)}>Your Words Deserve an Audience. Start Writing Today.</h2>
      </div>

      <style>{`
        .moving-grid-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .moving-grid-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(to right, #d0f33010 0 1px, transparent 1px 60px),
            repeating-linear-gradient(to bottom, #d0f33010 0 1px, transparent 1px 60px);
          animation: cyberbgmove 8s linear infinite;
          z-index: 0;
        }
        @media (max-width: 900px) {
          .moving-grid-bg::before {
            background:
              repeating-linear-gradient(to right, #d0f33010 0 1px, transparent 1px 36px),
              repeating-linear-gradient(to bottom, #d0f33010 0 1px, transparent 1px 36px);
          }
        }
        @keyframes cyberbgmove {
          0%   { background-position: 0 0, 0 0; }
          100% { background-position: 60px 60px, 60px 60px; }
        }
      `}</style>
    </div>
  );
}

// --- styles (unchanged from your version) ---
const container = (mobile) => ({
  display: 'flex',
  flexDirection: mobile ? 'column' : 'row',
  minHeight: '100vh',
  backgroundColor: '#07080a',
  fontFamily: "'Nunito Sans', sans-serif",
  position: 'relative',
  zIndex: 1,
  overflow: 'hidden',
});

const leftSide = (mobile) => ({
  flex: 1,
  backgroundColor: 'rgba(20,22,16,0.96)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: mobile ? '2rem 1rem' : '4rem 3rem',
  zIndex: 1,
  borderRadius: mobile ? '0 0 2rem 2rem' : '2rem 0 0 2rem',
  boxShadow: '0 0 32px #d0f33022',
  minWidth: 0,
});

const rightSide = (mobile) => ({
  flex: 1,
  background: 'linear-gradient(135deg, #10120a 60%, #07080a 100%)',
  color: 'white',
  display: mobile ? 'none' : 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  textAlign: 'center',
  padding: '2rem',
  minHeight: mobile ? '0' : 'auto',
  zIndex: 1,
  borderRadius: mobile ? '2rem 2rem 0 0' : '0 2rem 2rem 0',
  boxShadow: '0 0 32px #d0f33022',
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
  border: '1px solid #d0f33055',
  fontSize: '1rem',
  outline: 'none',
  width: '100%',
  maxWidth: '400px',
  margin: '0 auto',
  background: '#181a13',
  color: '#fff',
  boxShadow: '0 0 8px #d0f33011',
};

const buttonStyle = {
  padding: '0.9rem',
  borderRadius: '8px',
  backgroundColor: '#d0f330',
  color: '#111',
  fontWeight: '700',
  fontSize: '1rem',
  cursor: 'pointer',
  border: 'none',
  marginTop: '1rem',
  width: '100%',
  maxWidth: '400px',
  marginLeft: 'auto',
  marginRight: 'auto',
  boxShadow: '0 0 16px #d0f33044',
  transition: 'background 0.18s, color 0.18s',
};

const googleButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '0.8rem 1rem',
  border: '1px solid #d0f33055',
  borderRadius: '6px',
  backgroundColor: '#181a13',
  color: '#fff',
  fontWeight: '500',
  fontSize: '1rem',
  cursor: 'pointer',
  marginTop: '1rem',
  width: '100%',
  maxWidth: '400px',
  marginLeft: 'auto',
  marginRight: 'auto',
  boxShadow: '0 0 8px #d0f33011',
  transition: 'background 0.18s, color 0.18s',
};

const smallText = {
  marginTop: '1.5rem',
  fontSize: '0.9rem',
  color: '#b6c2b6',
  textAlign: 'center',
};

const heading = (mobile, isWriter) => ({
  fontSize: mobile ? '1.8rem' : '2.2rem',
  fontWeight: '700',
  color: '#d0f330',
  textAlign: 'center',
  letterSpacing: '-1px',
  marginBottom: '0.5rem',
  textShadow: '0 0 12px #d0f33033',
});

const subheading = (mobile) => ({
  marginTop: '0.5rem',
  fontSize: mobile ? '0.95rem' : '1rem',
  color: '#b6c2b6',
  textAlign: 'center',
});

const tagline = (mobile) => ({
  fontSize: mobile ? '1.6rem' : '2.2rem',
  fontWeight: '700',
  maxWidth: '400px',
  lineHeight: '1.3',
  textAlign: 'center',
  color: '#fff',
  textShadow: '0 0 12px #d0f33022',
});

const errorText = {
  color: '#ff4d4f',
  fontSize: '0.9rem',
  marginTop: '1rem',
  textAlign: 'center',
  fontWeight: 600,
};

export default Login;
