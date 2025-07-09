import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';
import { UserContext } from './UserContext';
import Loader from './components/Loader';

function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  const { login: setUserContext } = useContext(UserContext);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill all fields.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('https://openscroll-backend.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, role: 'reader' })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      localStorage.setItem('openscroll_current_user', JSON.stringify(data.user));
      setUserContext(data.user, data.token);
      navigate('/reader/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      const userData = { name: user.displayName, email: user.email, role: 'reader' };
      localStorage.setItem('readerToken', token);
      localStorage.setItem('openscroll_current_user', JSON.stringify(userData));
      setUserContext(userData, token);
      navigate('/reader/dashboard');
    } catch (error) {
      setError('Google signup failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Creating account..." type="form" />;
  }

  return (
    <div style={container(isMobile)}>
      <div className="moving-grid-bg"></div>
      <div style={leftSide(isMobile)}>
        <div>
          <h1 style={welcomeHeading(isMobile)}>Get Started!</h1>
          <p style={welcomeSubtext(isMobile)}>Create your OpenScroll account</p>

          <form style={formGroup} onSubmit={handleSignup}>
            <input type="text" placeholder="Full Name" style={inputStyle} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            <input type="email" placeholder="Email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} required />

            <div style={{ position: 'relative', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <div style={{ position: 'relative', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: '3rem' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <button type="submit" style={buttonStyle}>Sign Up</button>
          </form>

          <button onClick={handleGoogleSignup} style={googleButtonStyle}>
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              style={{
                height: '22px',
                marginRight: '10px',
                background: '#fff',
                borderRadius: '50%',
                padding: '2px',
                boxShadow: '0 0 4px #0003'
              }}
            />
            Sign up with Google
          </button>

          {error && <div style={errorText}>{error}</div>}

          <div style={smallText}>
            Already have an account? <Link to="/login" style={{ color: '#d0f330', fontWeight: '600' }}>Log In</Link>
          </div>
        </div>
      </div>

      <div style={rightSide(isMobile)}>
        <h2 style={tagline(isMobile)}>Join the Exclusive World of Curated Insights</h2>
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

const welcomeHeading = (mobile) => ({
  fontSize: mobile ? '1.8rem' : '2.2rem',
  fontWeight: '700',
  color: '#d0f330',
  textAlign: 'center',
  letterSpacing: '-1px',
  marginBottom: '0.5rem',
  textShadow: '0 0 12px #d0f33033',
});

const welcomeSubtext = (mobile) => ({
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

export default Signup;
