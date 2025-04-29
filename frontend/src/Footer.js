import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const footerStyle = {
    backgroundColor: '#0b0b0b',
    color: '#d1d5db',
    padding: '3rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    fontFamily: "'Nunito Sans', sans-serif",
  };

  const linksStyle = {
    display: 'flex',
    gap: '1.5rem',
    marginTop: '1rem',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  };

  const linkStyle = {
    color: '#d1d5db',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '1rem',
    transition: 'color 0.3s ease',
  };

  const linkHoverStyle = {
    color: '#ffffff',
  };

  const copyright = {
    fontSize: '0.9rem',
    color: '#9ca3af',
    marginTop: '1rem',
  };

  return (
    <footer style={footerStyle}>
      <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>OpenScroll</div>

      <div style={linksStyle}>
        <HoverLink to="/about" style={linkStyle} hoverStyle={linkHoverStyle}>About</HoverLink>
        <HoverLink to="/articles" style={linkStyle} hoverStyle={linkHoverStyle}>Articles</HoverLink>
        <HoverLink to="/privacy" style={linkStyle} hoverStyle={linkHoverStyle}>Privacy</HoverLink>
        <HoverLink to="/writer/login" style={linkStyle} hoverStyle={linkHoverStyle}>Creators Login</HoverLink>
      </div>

      <div style={copyright}>
        © {new Date().getFullYear()} OpenScroll. All rights reserved.
      </div>
    </footer>
  );
}

// Custom HoverLink component
function HoverLink({ to, style, hoverStyle, children }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Link
      to={to}
      style={hovered ? { ...style, ...hoverStyle } : style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </Link>
  );
}

export default Footer;
