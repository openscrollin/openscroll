import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion for animations
import TextToSpeechButton from './components/TextToSpeechButton';

// --- CYBER BACKGROUND STYLES ---
const pageWrapperStyle = {
  position: 'relative',
  minHeight: '100vh',
  background: '#07080a', // Base background color
  overflowX: 'hidden',
};

const cyberBgBeforeStyle = {
  content: '""', // Essential for pseudo-elements
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  background: `
    repeating-linear-gradient(to right, #d0f33010 0 1px, transparent 1px 80px),
    repeating-linear-gradient(to bottom, #d0f33010 0 1px, transparent 1px 80px)
  `,
  zIndex: 0, // Ensure it's behind content
  pointerEvents: 'none',
  animation: 'cyberbgmove 8s linear infinite',
};

// Keyframes for background animation
const keyframesCss = `
  @keyframes cyberbgmove {
    0%   { background-position: 0 0, 0 0; }
    100% { background-position: 80px 80px, 80px 80px; }
  }
`;

// --- MAIN PAGE CONTENT STYLES (OVER CYBER BACKGROUND) ---
const pageBodyStyle = (isMobile) => ({
  fontFamily: "'Nunito Sans', sans-serif",
  paddingTop: isMobile ? '80px' : '90px',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  paddingBottom: '4rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative', // To ensure it sits above the fixed background
  zIndex: 2, // Higher z-index than the cyber background
  color: '#d0f330', // Default text color for elements directly on cyber background
});

const containerStyle = {
  maxWidth: '760px',
  width: '100%',
  padding: '0 1rem',
  background: 'rgba(255, 255, 255, 0.05)', // Semi-transparent white for article content box
  backdropFilter: 'blur(15px) saturate(1.2)', // Glassmorphism blur for article box
  WebkitBackdropFilter: 'blur(15px) saturate(1.2)',
  borderRadius: '16px',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(208,243,48,0.2)', // Darker shadow + neon glow
  marginTop: '-rem', // This seems like a typo, should it be a value like '1rem'? Leaving as is to match original.
  marginBottom: '2rem',
  paddingTop: '2rem',
  paddingBottom: '2rem',
  border: '1px solid #d0f33055', // Neon border
  color: '#e0e0e0', // Light text for article content
};

const headingStyle = {
  fontSize: '2.5rem',
  fontWeight: '700',
  textAlign: 'center',
  marginTop: '0',
  marginBottom: '0.5rem',
  color: '#d0f330', // Neon color for heading
};

const summaryStyle = {
  fontSize: '1.2rem',
  color: '#b0b7b3', // Lighter color for summary on dark background
  marginBottom: '1rem',
  textAlign: 'center',
};

const imageContainerStyle = {
  width: '100%',
  overflow: 'hidden',
  marginBottom: '2rem',
  borderRadius: '8px',
  border: '1px solid #d0f33044', // Subtle neon border for image
  boxShadow: '0 0 10px #d0f33022',
};

const imageStyle = {
  width: '100%',
  height: 'auto',
  objectFit: 'cover',
  aspectRatio: '16 / 9',
};

const metaContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '2rem',
  flexWrap: 'wrap',
  color: '#b0b7b3', // Adjust color for readability
  fontSize: '0.9rem',
};

const authorStyle = {
  flex: 1,
};

const categoryStyle = {
  textAlign: 'right',
  flex: 1,
};

const articleBodyStyle = {
  color: '#e0e0e0', // Text color for article body
};

const dropCapStyle = {
  float: 'left',
  fontSize: '3.5rem',
  lineHeight: '1',
  fontWeight: '700',
  paddingRight: '0.3rem',
  color: '#d0f330',
};

const bodyStyle = {
  fontSize: '1.1rem',
  lineHeight: '1.8',
  color: '#e0e0e0',
  whiteSpace: 'pre-wrap',
  marginBottom: '1rem',
};

const shareRowStyle = {
  marginTop: '2rem',
  display: 'flex',
  gap: '0.75rem',
  flexWrap: 'wrap',
  justifyContent: 'center',
};

const smallButtonStyle = {
  backgroundColor: 'rgba(208,243,48,0.09)', // Subtle neon background
  color: '#d0f330', // Neon text
  border: '2px solid #d0f33099',
  padding: '0.4rem 1rem',
  borderRadius: '8px',
  fontSize: '0.9rem',
  margin: '0.2rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  boxShadow: '0 0 10px #d0f33033',
};

const smallButtonHoverProps = {
  scale: 1.05,
  boxShadow: '0 0 18px #fff70088',
  background: '#d0f3301a',
  color: '#fff700',
  borderColor: '#fff700',
};

const moreStoriesHeaderStyle = {
  fontSize: '1.8rem',
  marginBottom: '1rem',
  color: '#d0f330',
  textAlign: 'center', // Center the more stories heading
};

const moreStoriesScrollStyle = {
  display: 'flex',
  overflowX: 'auto',
  gap: '1.5rem', // Slightly reduced gap for more cards on screen
  paddingBottom: '1rem',
  WebkitOverflowScrolling: 'touch',
  justifyContent: 'center', // Center items when there are few
};

const cardStyle = {
  backgroundColor: 'rgba(15, 15, 30, 0.55)', // Darker glassmorphism card
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.4), 0 0 10px #d0f33033', // Darker shadow + neon glow
  overflow: 'hidden',
  transition: 'transform 0.3s ease',
  minWidth: '220px', // Adjusted minimum width for cards
  maxWidth: '280px', // Adjusted maximum width
  flexShrink: 0,
  border: '1px solid #d0f33044', // Subtle neon border
  color: '#e0e0e0', // Default text color for card
};

const cardHoverProps = {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 15px rgba(0,0,0,0.6), 0 0 25px #d0f33077',
    borderColor: '#d0f330aa',
};

const thumbStyle = {
  width: '100%',
  height: '150px',
  objectFit: 'cover',
};

const cardTitleStyle = {
  fontSize: '1rem',
  fontWeight: '600',
  margin: '0.75rem 0.75rem 0.25rem', // Adjusted margins
  color: '#d0f330', // Neon color for titles
};

const cardCategoryStyle = {
  fontSize: '0.75rem',
  fontWeight: '600',
  color: '#888',
  textTransform: 'uppercase',
  margin: '0.5rem 0.75rem 0 0.75rem', // Adjusted margins
};

const cardAuthorStyle = {
  fontSize: '0.8rem',
  color: '#666',
  margin: '0 0.75rem 0.75rem', // Adjusted margins
};

// Glassmorphism Overlay for Locked Content
const glassmorphismBox = {
  background: 'rgba(15, 15, 30, 0.7)', // More opaque for overlay
  backdropFilter: 'blur(20px) saturate(1.8)', // Stronger blur for lock screen
  WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
  borderRadius: '16px',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4), 0 0 30px #d0f33088', // Darker shadow + strong neon glow
  border: '2px solid #d0f330aa', // Strong neon border
  padding: '1.5rem',
  textAlign: 'center',
  maxWidth: '90%',
  width: 'auto',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 10, // Ensure it's on top of blurred content
  color: '#d0f330',
  fontSize: '1.2rem',
  fontWeight: '600',
};

const glassmorphismButton = {
  background: 'rgba(208, 243, 48, 0.2)', // Neon-tinted button
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderRadius: '8px',
  boxShadow: '0 2px 15px rgba(208, 243, 48, 0.2)',
  border: '1px solid rgba(208, 243, 48, 0.6)',
  padding: '0.7rem 1.2rem',
  cursor: 'pointer',
  fontWeight: 'bold',
  color: '#d0f330', // Neon text
  fontSize: '1rem',
  marginTop: '1rem',
  transition: 'all 0.2s ease-in-out',
};

const glassmorphismButtonHoverProps = {
  background: 'rgba(208, 243, 48, 0.4)',
  boxShadow: '0 0 25px rgba(208, 243, 48, 0.8)',
  color: '#fff',
  borderColor: '#d0f330',
};

// Mobile-specific styles (inline)
const mobileContainerStyle = { ...containerStyle, padding: '0 0.5rem' };
const mobileHeadingStyle = { ...headingStyle, fontSize: '2rem' };
const mobileSummaryStyle = { ...summaryStyle, fontSize: '1rem' };
const mobileShareRowStyle = { ...shareRowStyle, flexDirection: 'column', alignItems: 'center' };
const mobileSmallButtonStyle = { ...smallButtonStyle, width: '100%', margin: '0.5rem 0' };
const mobileMoreStoriesStyle = {
  marginTop: '2rem',
  padding: 0,
  maxWidth: '100%', // Ensure it takes full width
};
const mobileMoreStoriesScrollStyle = { ...moreStoriesScrollStyle, padding: '0 0.5rem 1rem', justifyContent: 'flex-start' }; // Align left for mobile scroll
const mobileLockedOverlayStyle = {
  ...glassmorphismBox,
  maxWidth: 'unset',
  width: 'calc(100% - 40px)', // Make it wider on mobile
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: '1.1rem',
};


function ArticleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [allArticles, setAllArticles] = useState([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articleRes, allRes] = await Promise.all([
          // CORRECTED: Using template literal for dynamic ID
          fetch(`https://openscroll-backend.onrender.com/api/articles/public/${id}`),
          fetch('https://openscroll-backend.onrender.com/api/articles/public'),
        ]);

        const articleData = await articleRes.json();
        const allData = await allRes.json();

        setArticle(articleData);
        // Filter out the current article and take up to 4 other articles
        setAllArticles(allData.filter((a) => a._id !== id).slice(0, 4));

        const user = JSON.parse(localStorage.getItem('openscroll_current_user'));
        const unlocked = JSON.parse(localStorage.getItem('openscroll_unlocked_articles')) || [];
        
        // An article is unlocked if its price is 0, OR the current user is its author, OR it's in the unlocked list
        // Using authorEmail for consistency as per File B's isAuthor check
        const isAuthor = user && articleData.authorEmail === user.email;
        setIsUnlocked(Number(articleData.price) === 0 || unlocked.includes(id) || isAuthor);

      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]); // Re-fetch when ID changes

  const handleBack = () => navigate('/articles');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const handleUnlock = () => {
    navigate(`/purchase/${id}`);
  };

  const renderBodyWithDropCap = (text) => {
    if (!text || typeof text !== 'string') return null;
  
    return (
      <p style={bodyStyle}>
        <span style={dropCapStyle}>{text[0]}</span>
        {text.slice(1)}
      </p>
    );
  };  

  const previewLength = 300;
  const previewContent = article?.body?.slice(0, previewLength);
  const remainingContent = article?.body?.slice(previewLength);

  if (loading) {
    return (
        <div style={{...pageWrapperStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={cyberBgBeforeStyle}></div>
            <div style={{ color: '#d0f330', fontSize: '1.5rem', zIndex: 2 }}>Loading article...</div>
        </div>
    );
  }

  if (!article) {
    return (
        <div style={{...pageWrapperStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={cyberBgBeforeStyle}></div>
            <div style={{ color: '#ff6666', fontSize: '1.5rem', zIndex: 2 }}>❌ Article not found</div>
        </div>
    );
  }

  return (
    // Apply the cyber background to the outermost div
    <div style={pageWrapperStyle}>
      {/* This pseudo-element is what creates the moving grid. It must be inside the element it styles */}
      <div style={cyberBgBeforeStyle}></div> 
      
      {/* Main content container, sitting on top of the cyber background */}
      <div style={pageBodyStyle(isMobile)}>
        <div style={isMobile ? mobileContainerStyle : containerStyle}>
          <h1 style={isMobile ? mobileHeadingStyle : headingStyle}>{article.title}</h1>
          <p style={isMobile ? mobileSummaryStyle : summaryStyle}>{article.summary}</p>
          {article.coverImage && (
            <div style={imageContainerStyle}>
              <img src={article.coverImage} alt="cover" style={imageStyle} />
            </div>
          )}
          <div style={metaContainerStyle}>
            {/* Enhanced author name fallback as per File B */}
            <p style={authorStyle}>By {article.authorName || article.authorEmail || 'Unknown Author'}</p>
            <p style={categoryStyle}>{article.category}</p>
          </div>
          <div style={articleBodyStyle}>
            {article.body && (
              <>
                {!isUnlocked && Number(article.price) > 0 ? ( // Only lock if price > 0
                  <>
                    {renderBodyWithDropCap(previewContent)}
                    {remainingContent && (
                      <div style={{ position: 'relative' }}>
                        {/* Glassmorphism lock overlay */}
                        <motion.div
                          style={isMobile ? mobileLockedOverlayStyle : glassmorphismBox}
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          {/* Specific styles for locked message text as per File A */}
                          <p style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem', color: '#d0f330' }}>This article is locked</p>
                          <p style={{ marginBottom: '0.5rem', color: '#ccc' }}>Price: ₹{article.price}</p>
                          <motion.button
                            onClick={handleUnlock}
                            style={glassmorphismButton}
                            whileHover={glassmorphismButtonHoverProps}
                            whileTap={{ scale: 0.95 }}
                          >
                            Unlock Now
                          </motion.button>
                        </motion.div>
                        {/* Blurred content beneath overlay with more complete styling from File A */}
                        <div style={{ filter: 'blur(6px)', pointerEvents: 'none', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', color: '#e0e0e0' }}>
                          <p style={bodyStyle}>{remainingContent}</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <TextToSpeechButton text={article.body} />
                    {renderBodyWithDropCap(article.body)}
                  </>
                )}
              </>
            )}
          </div>
          <div style={isMobile ? mobileShareRowStyle : shareRowStyle}>
            {['WhatsApp', 'Twitter', 'LinkedIn', 'Copy Link'].map((platform) => (
                <motion.button
                    key={platform}
                    style={isMobile ? mobileSmallButtonStyle : smallButtonStyle}
                    whileHover={smallButtonHoverProps}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        const url = window.location.href;
                        const text = encodeURIComponent(article.title);
                        if (platform === 'WhatsApp') {
                            window.open(`https://wa.me/?text=${text}%0A${url}`, '_blank');
                        } else if (platform === 'Twitter') {
                            window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
                        } else if (platform === 'LinkedIn') {
                            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
                        } else if (platform === 'Copy Link') {
                            handleCopyLink();
                        }
                    }}
                >
                    {platform}
                </motion.button>
            ))}
          </div>

          <motion.button
            onClick={handleBack}
            style={{
              padding: '10px 24px',
              background: '#bde32c',
              backdropFilter: 'blur(12px)', // Re-added from File A
              WebkitBackdropFilter: 'blur(12px)', // Re-added from File A
              color: '#111',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background 0.3s ease, transform 0.2s ease, box-shadow 0.2s',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              marginTop: '2rem',
            }}
            whileHover={{
             background: '#fff',
              //transform: 'scale(1.03)',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2), 0 0 10px #d0f33066',
            }}
            whileTap={{ scale: 0.98 }}
          >
           ← Back to Articles
          </motion.button>

        </div>

        <div style={isMobile ? mobileMoreStoriesStyle : { maxWidth: '100%', marginTop: '3rem', padding: '0 0.5rem' }}>
          <h2 style={moreStoriesHeaderStyle}>More Stories</h2>
          <div className="more-stories-scroll" style={isMobile ? mobileMoreStoriesScrollStyle : moreStoriesScrollStyle}>
            {allArticles.map((art) => (
              <motion.div
                key={art._id}
                style={cardStyle}
                whileHover={cardHoverProps}
                whileTap={{ scale: 0.98 }}
              >
                <Link to={`/articles/${art._id}`} style={{ textDecoration: 'none', color: 'inherit' }}> {/* Inherit color from cardStyle */}
                  <img src={art.coverImage} alt="thumb" style={thumbStyle} />
                  <p style={cardCategoryStyle}>{art.category}</p>
                  <h3 style={cardTitleStyle}>{art.title}</h3>
                  {/* Enhanced author name fallback as per File B */}
                  <p style={cardAuthorStyle}>By {art.authorName || art.authorEmail || 'Unknown'}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {/* This style block injects the Fira Mono font and keyframes into the head */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fira+Mono:wght@400;700&family=Nunito+Sans:wght@700&display=swap');
        body, html { font-family: 'Nunito Sans', 'Fira Mono', monospace, sans-serif; margin: 0; background: #07080a; } /* Set body bg for smooth transition */
        ${keyframesCss} /* Inject keyframes here */

        /* Custom scrollbar for cyber theme */
        .more-stories-scroll::-webkit-scrollbar {
          height: 8px;
        }
        .more-stories-scroll::-webkit-scrollbar-track {
          background: rgba(208,243,48,0.05);
          border-radius: 10px;
        }
        .more-stories-scroll::-webkit-scrollbar-thumb {
          background: rgba(208,243,48,0.3);
          border-radius: 10px;
          border: 1px solid rgba(208,243,48,0.5);
        }
        .more-stories-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(208,243,48,0.5);
        }
      `}</style>
    </div>
  );
}

export default ArticleDetails;