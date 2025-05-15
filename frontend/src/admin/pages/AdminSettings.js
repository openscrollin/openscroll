import React, { useState } from 'react';

function AdminSettings() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const adminEmail = localStorage.getItem('openscroll_admin_email'); // assume stored at login

  const handleChangePassword = async () => {
    setMessage('');
    setError('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      return setError('Please fill all fields');
    }
    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match');
    }

    try {
      const res = await fetch('http://localhost:5002/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('openscroll_admin_token')}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('✅ Password updated successfully');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.message || 'Error changing password');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const logout = () => {
    localStorage.removeItem('openscroll_admin_token');
    window.location.href = '/admin/login';
  };

  const inputStyle = {
    padding: '0.6rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    width: '100%',
    marginBottom: '1rem',
    fontSize: '1rem',
  };

  const buttonStyle = {
    padding: '0.6rem 1.2rem',
    backgroundColor: '#2C9CF0',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  };

  const boxStyle = {
    maxWidth: '500px',
    marginBottom: '2rem',
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Nunito Sans' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Admin Settings</h1>

      <div style={boxStyle}>
        <h3>👤 Account Info</h3>
        <p><strong>Email:</strong> {adminEmail || 'admin@openscroll.in'}</p>
        <p><strong>Role:</strong> Super Admin</p>
      </div>

      <div style={boxStyle}>
        <h3>🔐 Change Password</h3>
        <input
          style={inputStyle}
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          style={inputStyle}
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          style={inputStyle}
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button style={buttonStyle} onClick={handleChangePassword}>Update Password</button>
        {message && <p style={{ color: 'green', marginTop: '0.5rem' }}>{message}</p>}
        {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
      </div>

      <div style={boxStyle}>
        <h3>📱 Two-Factor Authentication</h3>
        <p>Coming soon: Enable extra security for your account.</p>
      </div>

      <div style={boxStyle}>
        <button
          onClick={logout}
          style={{
            ...buttonStyle,
            backgroundColor: '#ef4444',
            marginTop: '1rem',
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminSettings;
