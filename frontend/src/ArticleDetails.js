import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
//import Navbar from './Navbar';

const pageStyle = (isMobile) => ({
  fontFamily: "'Nunito Sans', sans-serif",
  backgroundColor: '#f9f9f7',
  paddingTop: isMobile ? '80px' : '90px',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  paddingBottom: '4rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});


const containerStyle = {
  maxWidth: '760px',
  width: '100%',
  padding: '0 1rem',
};

const headingStyle = {
  fontSize: '2.5rem',
  fontWeight: '700',
  textAlign: 'center',
  marginTop: '0',
  marginBottom: '0.5rem',
};

const summaryStyle = {
  fontSize: '1.2rem',
  color: '#4b5563',
  marginBottom: '1rem',
  textAlign: 'center',
};

const imageContainerStyle = {
  width: '100%',
  overflow: 'hidden',
  marginBottom: '2rem',
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
};

const authorStyle = {
  fontSize: '0.9rem',
  color: '#6b7280',
  flex: 1,
};

const categoryStyle = {
  fontSize: '0.9rem',
  color: '#6b7280',
  textAlign: 'right',
  flex: 1,
};

const articleBodyStyle = {};

const dropCapStyle = {
  float: 'left',
  fontSize: '3rem',
  lineHeight: '1',
  fontWeight: '700',
  paddingRight: '0.3rem',
  color: '#111827',
};

const bodyStyle = {
  fontSize: '1.1rem',
  lineHeight: '1.8',
  color: '#111827',
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
  backgroundColor: '#f3f4f6',
  color: '#111827',
  border: 'none',
  padding: '0.4rem 1rem',
  borderRadius: '8px',
  fontSize: '0.9rem',
  margin: '0.2rem',
};

const backButtonStyle = {
  marginTop: '2rem',
  padding: '0.8rem 1.5rem',
  backgroundColor: '#2c2c2c',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
};

const moreStoriesStyle = {
  maxWidth: '100%',
  marginTop: '3rem',
  padding: '0 0.5rem',
};

const moreStoriesScrollStyle = {
  display: 'flex',
  overflowX: 'auto',
  gap: '2rem',
  paddingBottom: '1rem',
  WebkitOverflowScrolling: 'touch',
};

const cardStyle = {
  backgroundColor: '#fff',
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  overflow: 'hidden',
  transition: 'transform 0.3s ease',
  minWidth: '200px',
  maxWidth: '250px',
  flexShrink: 0,
};

const thumbStyle = {
  width: '100%',
  height: '150px',
  //aspectRatio: '16:9'
  objectFit: 'cover',
  //display: 'block',
};

const cardTitleStyle = {
  fontSize: '1rem',
  fontWeight: '600',
  margin: '0.25rem 0.25rem 0.25rem',
};

const cardCategoryStyle = {
  fontSize: '0.75rem',
  fontWeight: '600',
  color: '#6b7280',
  textTransform: 'uppercase',
  margin: '0.5rem 1rem 0 0.5rem',
};

const cardAuthorStyle = {
  fontSize: '0.8rem',
  color: '#9ca3af',
  margin: '0 0.25rem 0.5rem',
};

const glassmorphismBox = {
  background: 'transparent', // ENSURE THIS IS TRANSPARENT
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1);',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  padding: '1.5rem',
  textAlign: 'center',
  marginBottom: '1rem',
  maxWidth: '90%',
  width: 'auto',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 10,
};

const glassmorphismButton = {
  background: 'rgba(255, 255, 255, 0.3)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderRadius: '8px',
  boxShadow: '0 2px 15px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  padding: '0.7rem 1.2rem',
  cursor: 'pointer',
  fontWeight: 'bold',
  color: '#333',
  fontSize: '1rem',
  marginTop: '1rem',
};

const glassmorphismButtonHover = {
  background: 'rgba(255, 255, 255, 0.5)',
};

// Mobile-specific styles (inline)
const mobileContainerStyle = { ...containerStyle, padding: '0 0.5rem' };
const mobileHeadingStyle = { ...headingStyle, fontSize: '2rem' };
const mobileSummaryStyle = { ...summaryStyle, fontSize: '1rem' };
const mobileShareRowStyle = { ...shareRowStyle, flexDirection: 'column', alignItems: 'center' };
const mobileSmallButtonStyle = { ...smallButtonStyle, width: '100%', margin: '0.5rem 0' };
const mobileMoreStoriesStyle = { ...moreStoriesStyle, marginTop: '2rem', padding: 0 };
const mobileMoreStoriesScrollStyle = { ...moreStoriesScrollStyle, padding: '0 0.5rem 1rem' };
const mobileLockedOverlayStyle = {
  ...glassmorphismBox,
  maxWidth: 'unset',
  width: '340px',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
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
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articleRes, allRes] = await Promise.all([
          fetch(`http://localhost:5002/api/articles/public/${id}`),
          fetch('http://localhost:5002/api/articles/public'),
        ]);

        const articleData = await articleRes.json();
        const allData = await allRes.json();

        setArticle(articleData);
        setAllArticles(allData.filter((a) => a._id !== id).slice(0, 4));

        const unlocked = JSON.parse(localStorage.getItem('openscroll_unlocked_articles')) || [];
        setIsUnlocked(Number(articleData.price) === 0 || unlocked.includes(id));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBack = () => navigate('/articles');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const handleUnlock = () => {
    navigate(`/purchase/${id}`);
    // In a real application, navigate('/payment/' + id);
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
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (!article) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>❌ Article not found</div>;
  }

  return (
    <>
      
      <div style={pageStyle(isMobile)}>
        <div style={isMobile ? mobileContainerStyle : containerStyle}>
          <h1 style={isMobile ? mobileHeadingStyle : headingStyle}>{article.title}</h1>
          <p style={isMobile ? mobileSummaryStyle : summaryStyle}>{article.summary}</p>
          {article.coverImage && (
            <div style={imageContainerStyle}>
              <img src={article.coverImage} alt="cover" style={imageStyle} />
            </div>
          )}
          <div style={metaContainerStyle}>
            <p style={authorStyle}>By {article.authorFullName || article.authorEmail}</p>
            <p style={categoryStyle}>{article.category}</p>
          </div>
          <div style={articleBodyStyle}>
            {article.body && (
              <>
                {!isUnlocked ? (
                  <>
                    {renderBodyWithDropCap(previewContent)}
                    {remainingContent && (
                      <div style={{ position: 'relative' }}>
                        <div style={isMobile ? mobileLockedOverlayStyle : glassmorphismBox}>
                          <p style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>This article is locked</p>
                          <p style={{ marginBottom: '0.5rem' }}>Price: ₹{article.price}</p>
                          <button
                            onClick={handleUnlock}
                            style={glassmorphismButton}
                            onMouseOver={(e) => Object.assign(e.target.style, glassmorphismButtonHover)}
                            onMouseOut={(e) => Object.assign(e.target.style, glassmorphismButton)}
                          >
                            Unlock Now
                          </button>
                        </div>
                        <div style={{ filter: 'blur(6px)', pointerEvents: 'none' }}>
                          <p style={bodyStyle}>{remainingContent}</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  renderBodyWithDropCap(article.body)
                )}
              </>
            )}
          </div>
          <div style={isMobile ? mobileShareRowStyle : shareRowStyle}>
            <button
              style={isMobile ? mobileSmallButtonStyle : smallButtonStyle}
              onClick={() =>
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(article.title)}%0A${window.location.href}`,
                  '_blank'
                )
              }
            >
              WhatsApp
            </button>
            <button
              style={isMobile ? mobileSmallButtonStyle : smallButtonStyle}
              onClick={() =>
                window.open(
                  `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${window.location.href}`,
                  '_blank'
                )
              }
            >
              Twitter
            </button>
            <button
              style={isMobile ? mobileSmallButtonStyle : smallButtonStyle}
              onClick={() =>
                window.open(
                  `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`,
                  '_blank'
                )
              }
            >
              LinkedIn
            </button>
            <button style={isMobile ? mobileSmallButtonStyle : smallButtonStyle} onClick={handleCopyLink}>
              Copy Link
            </button>
          </div>
          <button style={backButtonStyle} onClick={handleBack}>
            ← Back to Articles
          </button>
        </div>

        <div style={isMobile ? mobileMoreStoriesStyle : moreStoriesStyle}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>More Stories</h2>
          <div className="more-stories-scroll" style={isMobile ? mobileMoreStoriesScrollStyle : moreStoriesScrollStyle}>
            {allArticles.map((art) => (
              <div key={art._id} className="card" style={cardStyle}>
                <Link to={`/articles/${art._id}`} style={{ textDecoration: 'none', color: '#111' }}>
                  <img src={art.coverImage} alt="thumb" style={thumbStyle} />
                  <p style={cardCategoryStyle}>{art.category}</p>
                  <h3 style={cardTitleStyle}>{art.title}</h3>
                  <p style={cardAuthorStyle}>By {art.authorFullName ||art.authorEmail }</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ArticleDetails;