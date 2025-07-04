// src/ReaderOtpLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, RecaptchaVerifier } from './firebase';
import { signInWithPhoneNumber } from 'firebase/auth';

function ReaderOtpLogin() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [message, setMessage] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigate = useNavigate();

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        { size: 'invisible' },
        auth
      );
    }
  };

  const sendOtp = async () => {
    const fullPhone = `+91${phone}`;
    setupRecaptcha();
    try {
      const result = await signInWithPhoneNumber(auth, fullPhone, window.recaptchaVerifier);
      setConfirmationResult(result);
      setStep('otp');
      setMessage('OTP sent to your phone');
    } catch (error) {
      console.error(error);
      setMessage('Failed to send OTP. Try again.');
    }
  };

  const verifyOtp = async () => {
    try {
      await confirmationResult.confirm(otp);
      setMessage('Login successful!');
      localStorage.setItem('readerToken', 'firebase-token');
      localStorage.setItem('openscroll_current_user', JSON.stringify({ phone, role: 'reader' }));
      navigate('/reader/dashboard');
    } catch (error) {
      console.error(error);
      setMessage('Invalid OTP');
    }
  };

  return (
    <div style={container}>
      <h2>Reader Login via Mobile</h2>

      {step === 'phone' && (
        <>
          <div style={phoneInputContainer}>
            <span style={prefix}>🇮🇳 +91</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9226773937"
              style={input}
              required
            />
          </div>
          <button onClick={sendOtp} style={button}>Send OTP</button>
        </>
      )}

      {step === 'otp' && (
        <>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            style={input}
            required
          />
          <button onClick={verifyOtp} style={button}>Verify OTP</button>
        </>
      )}

      <div id="recaptcha-container"></div>
      {message && <p style={{ marginTop: '1rem', color: '#333' }}>{message}</p>}
    </div>
  );
}

// ===== Styles =====
const container = {
  maxWidth: '400px',
  margin: '5rem auto',
  padding: '2rem',
  border: '1px solid #ddd',
  borderRadius: '8px',
  textAlign: 'center',
  backgroundColor: '#fff',
  fontFamily: 'sans-serif',
};

const phoneInputContainer = {
  display: 'flex',
  alignItems: 'center',
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '0.5rem',
  marginBottom: '1rem',
};

const prefix = {
  padding: '0 0.5rem',
  fontSize: '1rem',
  fontWeight: '500',
};

const input = {
  flex: 1,
  padding: '0.6rem',
  border: 'none',
  outline: 'none',
  fontSize: '1rem',
};

const button = {
  padding: '0.8rem 1.2rem',
  backgroundColor: '#2c2c2c',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1rem',
  marginTop: '1rem',
  cursor: 'pointer',
};

export default ReaderOtpLogin;
