import React from 'react';
import { Link } from 'react-router-dom';

function Insights() {
  const sectionStyle = {
    padding: '6rem 2rem',
    backgroundColor: '#ffffff',
    textAlign: 'center',
  };

  const headingStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '1rem',
  };

  const subtitleStyle = {
    fontSize: '1.2rem',
    color: '#6b7280',
    marginBottom: '3rem',
  };

  const gridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
    justifyContent: 'center',
  };

  const cardStyle = {
    backgroundColor: '#f9f9f7',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    flex: '0 1 300px',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
  };

  const imageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  };

  const contentStyle = {
    padding: '1.5rem',
    flexGrow: 1,
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#1a1a1a',
  };

  const textStyle = {
    fontSize: '1rem',
    color: '#6b7280',
    marginBottom: '1.5rem',
    lineHeight: '1.6',
  };

  const buttonStyle = {
    display: 'inline-block',
    padding: '0.5rem 1.5rem',
    backgroundColor: '#2c2c2c',
    color: 'white',
    borderRadius: '9999px',
    fontWeight: '600',
    fontSize: '1rem',
    textDecoration: 'none',
    transition: 'background-color 0.3s',
  };

  return (
    <section className="fade-in-up" style={sectionStyle}>
      <h2 style={headingStyle}>Insights for Excellence</h2>
      <p style={subtitleStyle}>Curated articles to fuel your knowledge journey.</p>
      
      <div style={gridStyle}>
        {/* Card 1 */}
        <div style={cardStyle}>
          <img src="/blog1.jpg" alt="Blog 1" style={imageStyle} />
          <div style={contentStyle}>
            <h3 style={titleStyle}>Unlocking the Future of AI</h3>
            <p style={textStyle}>
              Dive into how artificial intelligence is transforming industries and reshaping the future.
            </p>
            <Link to="/articles/1" style={buttonStyle}>Read More</Link>
          </div>
        </div>

        {/* Card 2 */}
        <div style={cardStyle}>
          <img src="/blog2.jpg" alt="Blog 2" style={imageStyle} />
          <div style={contentStyle}>
            <h3 style={titleStyle}>Sustainable Innovation Trends</h3>
            <p style={textStyle}>
              Explore the latest sustainable tech innovations and how they impact the global economy.
            </p>
            <Link to="/articles/2" style={buttonStyle}>Read More</Link>
          </div>
        </div>

        {/* Card 3 */}
        <div style={cardStyle}>
          <img src="/blog3.jpg" alt="Blog 3" style={imageStyle} />
          <div style={contentStyle}>
            <h3 style={titleStyle}>Mastering Personal Growth</h3>
            <p style={textStyle}>
              Strategies and mindsets that can empower you to achieve personal and professional excellence.
            </p>
            <Link to="/articles/3" style={buttonStyle}>Read More</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Insights;
