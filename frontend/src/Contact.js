import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent successfully!');
    setFormData({ name: '', email: '', message: '' });
  };

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
    marginBottom: '1rem',
    textAlign: 'center'
  };

  const subtitle = {
    fontSize: '1.2rem',
    color: '#6b7280',
    marginBottom: '3rem',
    textAlign: 'center'
  };

  const form = {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  };

  const input = {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    outline: 'none'
  };

  const textarea = {
    ...input,
    minHeight: '150px',
    resize: 'vertical'
  };

  const button = {
    padding: '0.75rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    fontWeight: '700',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.1rem'
  };

  const info = {
    marginTop: '3rem',
    fontSize: '1rem',
    textAlign: 'center',
    color: '#6b7280'
  };

  return (
    <div style={container}>
      <h1 style={title}>Contact OpenScroll</h1>
      <p style={subtitle}>Have questions, feedback, or just want to connect? We’d love to hear from you!</p>

      <form onSubmit={handleSubmit} style={form}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={input}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={input}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
          style={textarea}
        />
        <button type="submit" style={button}>
          Send Message
        </button>
      </form>

      <div style={info}>
        Or email us directly at: <strong>support@openscroll.com</strong><br />
        {/* Later you can add address/contact number here */}
      </div>
    </div>
  );
}

export default Contact;
