import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // <-- Add this import

const backdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(20, 20, 40, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999,
};

const modalStyle = {
  background: 'rgba(15, 15, 30, 0.55)',
  borderRadius: '24px',
  maxWidth: '920px',
  width: '96vw',
  fontFamily: "'Nunito Sans', sans-serif",
  paddingBottom: '2rem',
  border: '1px solid #d0f33055',
  boxShadow: '0 0 18px #d0f33066',
  backdropFilter: 'blur(24px) saturate(1.5)',
  WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
  overflow: 'hidden',
  color: '#fff',
};

const carouselWrapper = {
  position: 'relative',
  width: '100%',
  height: '360px',
  borderTopLeftRadius: '24px',
  borderTopRightRadius: '24px',
  overflow: 'hidden',
};

const carouselImg = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const overlayContent = {
  position: 'absolute',
  top: '50%',
  left: '5%',
  transform: 'translateY(-50%)',
  zIndex: 2,
  maxWidth: '45%',
};

const heading = {
  fontSize: '1.8rem',
  fontWeight: '800',
  marginBottom: '0.6rem',
};

const subheading = {
  fontSize: '1.2rem',
  color: '#d0f330',
  marginBottom: '0.6rem',
};

const description = {
  fontSize: '1rem',
  color: '#ddd',
  marginBottom: '1.2rem',
};

const actionBtn = {
  padding: '0.9rem 1.6rem',
  fontWeight: 700,
  fontSize: '1rem',
  background: 'transparent',
  color: '#d0f330',
  border: '2px solid #d0f330',
  borderRadius: '14px',
  boxShadow: '0 0 12px #d0f33066',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const actionBtnHover = {
  transform: 'scale(1.03)',
  boxShadow: '0 0 18px #d0f330aa',
};

const dotContainer = {
  display: 'flex',
  justifyContent: 'center',
  gap: '0.5rem',
  marginTop: '1rem',
  marginBottom: '1.5rem',
};

const dotStyle = (active) => ({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  backgroundColor: active ? '#d0f330' : '#888',
  opacity: active ? 1 : 0.4,
});

const adBox = {
  background: 'rgba(34,37,50,0.35)',
  border: '1px solid #d0f33066',
  borderRadius: '16px',
  padding: '1rem',
  maxWidth: '720px',
  margin: '0 auto 1.5rem',
  boxShadow: '0 0 8px rgba(208,243,48,0.08)',
};

const adTitle = {
  fontSize: '1.1rem',
  fontWeight: 700,
  color: '#f5ffae',
  marginBottom: '0.3rem',
};

const adSummary = {
  fontSize: '0.95rem',
  color: '#e2e8f0',
  marginBottom: '0.4rem',
};

const adPrice = {
  fontSize: '0.92rem',
  fontWeight: 700,
  color: '#d0f330',
};

const buttonRow = {
  display: 'flex',
  justifyContent: 'center',
  gap: '1.2rem',
  flexWrap: 'wrap',
};

const googleBtn = {
  padding: '0.9rem 1.6rem',
  fontWeight: 700,
  fontSize: '1rem',
  background: 'transparent',
  color: '#d0f330',
  border: '2px solid #d0f330',
  borderRadius: '14px',
  boxShadow: '0 0 12px #d0f33066',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const loginBtn = {
  padding: '0.9rem 1.6rem',
  fontWeight: 600,
  fontSize: '1rem',
  background: 'rgba(220,255,220,0.05)',
  color: '#fff',
  border: '1px solid #cddcaa22',
  borderRadius: '14px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const slides = [
  {
    title: 'Welcome to OpenScroll!!',
    subtitle: 'Discover Amazing Stories',
    desc: 'Join thousands of readers exploring the future of digital storytelling',
    button: 'Start Reading',
  },
  {
    title: 'Level Up Your Mind',
    subtitle: 'Curated Learning',
    desc: 'Explore expert-written content across tech, business, and design.',
    button: 'Explore Now',
  },
  {
    title: 'Exclusive Content Inside',
    subtitle: 'Only for Members',
    desc: 'Unlock paywalled stories and save your favorites forever.',
    button: 'Get Access',
  },
];

function LoginPromoModal({ onClose, adArticle }) {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5002/api/admin/carousel-images')
      .then((res) => res.json())
      .then((data) => setImages(data.images || []));
  }, []);

  useEffect(() => {
    if (!images.length) return;
    const interval = setInterval(() => {
      setCarouselIdx((idx) => (idx + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={carouselWrapper}>
          {images[carouselIdx] && (
            <>
              <img src={images[carouselIdx].url} alt="carousel" style={carouselImg} />
              <div style={overlayContent}>
                <div style={heading}>{slides[carouselIdx]?.title}</div>
                <div style={subheading}>{slides[carouselIdx]?.subtitle}</div>
                <div style={description}>{slides[carouselIdx]?.desc}</div>
                <motion.button
                  style={hovered ? { ...actionBtn, ...actionBtnHover } : actionBtn}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  whileHover={{ scale: 1.07, boxShadow: "0 0 24px #d0f330" }}
                  whileTap={{ scale: 0.96 }}
                >
                  {slides[carouselIdx]?.button}
                </motion.button>
              </div>
            </>
          )}
        </div>

        {/* Dots */}
        <div style={dotContainer}>
          {images.map((_, idx) => (
            <div key={idx} style={dotStyle(idx === carouselIdx)} />
          ))}
        </div>

        {/* Join message */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Join OpenScroll Today
          </h2>
          <p style={{ color: '#ccc', fontSize: '1rem' }}>
            Sign up to access exclusive content, save your reading progress, and get personalized recommendations.
          </p>
        </div>

        {/* Featured Article */}
        {adArticle && (
          <div style={adBox}>
            <div style={adTitle}>{adArticle.title}</div>
            <div style={adSummary}>{adArticle.summary}</div>
            <div style={adPrice}>₹{adArticle.price}</div>
          </div>
        )}

        {/* Login / Signup Buttons */}
        <div style={buttonRow}>
          <motion.button
            style={googleBtn}
            onClick={() => navigate('/signup')}
            whileHover={{ scale: 1.07, boxShadow: "0 0 24px #d0f330" }}
            whileTap={{ scale: 0.96 }}
          >
            Sign Up with Google
          </motion.button>
          <motion.button
            style={loginBtn}
            onClick={() => navigate('/login')}
            whileHover={{ scale: 1.07, boxShadow: "0 0 24px #fff" }}
            whileTap={{ scale: 0.96 }}
          >
            Already have an account? Sign In
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default LoginPromoModal;
