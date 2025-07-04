import React, { useState } from 'react';
import { auth, RecaptchaVerifier } from './firebase';
import { signInWithPhoneNumber } from 'firebase/auth';

function PhoneLogin() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [message, setMessage] = useState('');

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      'recaptcha-container',
      { size: 'invisible' },
      auth
    );
  };

  const handleSendOtp = async () => {
    setupRecaptcha();
    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setMessage('OTP sent!');
    } catch (err) {
      console.error(err);
      setMessage('Error sending OTP');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await confirmationResult.confirm(otp);
      setMessage('OTP verified. User signed in!');
    } catch (err) {
      console.error(err);
      setMessage('Invalid OTP');
    }
  };

  return (
    <div className="phone-login">
      <h2>Phone Login</h2>
      <input
        type="tel"
        placeholder="Enter phone number (+91XXXXXXXXXX)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={handleSendOtp}>Send OTP</button>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerifyOtp}>Verify OTP</button>

      <div id="recaptcha-container"></div>
      <p>{message}</p>
    </div>
  );
}

export default PhoneLogin;
