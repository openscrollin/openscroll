import React from 'react';

function Privacy() {
  const container = {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f9fafb',
    color: '#1f2937',
    minHeight: '100vh',
    padding: '4rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const title = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: '2rem',
    textAlign: 'center'
  };

  const section = {
    maxWidth: '900px',
    marginBottom: '2rem',
    textAlign: 'left'
  };

  const heading = {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#2563eb',
  };

  const paragraph = {
    fontSize: '1rem',
    lineHeight: '1.8',
    color: '#6b7280',
    marginBottom: '1rem',
  };

  return (
    <div style={container}>
      <h1 style={title}>Privacy Policy</h1>

      <div style={section}>
        <h2 style={heading}>Introduction</h2>
        <p style={paragraph}>
          At OpenScroll, we are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and protect your data.
        </p>
      </div>

      <div style={section}>
        <h2 style={heading}>Information We Collect</h2>
        <p style={paragraph}>
          We collect personal information that you voluntarily provide to us, such as your name, email address, and any messages you send via our contact forms. 
          We may also collect usage data automatically when you access our website.
        </p>
      </div>

      <div style={section}>
        <h2 style={heading}>How We Use Your Information</h2>
        <p style={paragraph}>
          We use your information to communicate with you, provide customer support, improve our services, and send important updates. We do not sell your personal data to third parties.
        </p>
      </div>

      <div style={section}>
        <h2 style={heading}>How We Protect Your Information</h2>
        <p style={paragraph}>
          We implement industry-standard security measures to protect your data from unauthorized access, alteration, disclosure, or destruction.
        </p>
      </div>

      <div style={section}>
        <h2 style={heading}>Your Rights</h2>
        <p style={paragraph}>
          You have the right to access, update, or delete your personal information at any time. Please contact us if you wish to exercise these rights.
        </p>
      </div>

      <div style={section}>
        <h2 style={heading}>Changes to This Policy</h2>
        <p style={paragraph}>
          We may update this Privacy Policy from time to time to reflect changes to our practices or for other operational, legal, or regulatory reasons.
        </p>
      </div>

      <div style={section}>
        <h2 style={heading}>Contact Us</h2>
        <p style={paragraph}>
          If you have any questions about this Privacy Policy, you can contact us at: <strong>support@openscroll.com</strong>
        </p>
      </div>
    </div>
  );
}

export default Privacy;
