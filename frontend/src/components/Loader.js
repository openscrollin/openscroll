import React from 'react';

const Loader = ({ message = "Loading...", type = "default" }) => {
  return (
    <div style={loaderContainerStyle}>
      <div style={loaderContentStyle}>
        {type === "articles" && <ArticlesSkeleton />}
        {type === "dashboard" && <DashboardSkeleton />}
        {type === "article" && <ArticleSkeleton />}
        {type === "form" && <FormSkeleton />}
        {type === "default" && <DefaultSkeleton />}
        <p style={messageStyle}>{message}</p>
      </div>
    </div>
  );
};

// Skeleton Components
const ArticlesSkeleton = () => (
  <div style={{ width: '100%', maxWidth: '1200px' }}>
    {/* Header skeleton */}
    <div style={skeletonHeaderStyle}></div>
    <div style={{ ...skeletonLineStyle, width: '60%', marginBottom: '2rem' }}></div>
    
    {/* Filter skeleton */}
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ ...skeletonButtonStyle, width: `${60 + i * 10}px` }}></div>
      ))}
    </div>
    
    {/* Articles grid skeleton */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} style={skeletonCardStyle}>
          <div style={skeletonImageStyle}></div>
          <div style={{ padding: '1rem' }}>
            <div style={{ ...skeletonLineStyle, width: '80%', marginBottom: '0.5rem' }}></div>
            <div style={{ ...skeletonLineStyle, width: '60%', marginBottom: '1rem' }}></div>
            <div style={{ ...skeletonLineStyle, width: '40%', height: '12px' }}></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DashboardSkeleton = () => (
  <div style={{ width: '100%', maxWidth: '1200px' }}>
    {/* Header skeleton */}
    <div style={skeletonHeaderStyle}></div>
    <div style={{ ...skeletonLineStyle, width: '40%', marginBottom: '2rem' }}></div>
    
    {/* Stats cards skeleton */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={skeletonCardStyle}>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ ...skeletonLineStyle, width: '60%', marginBottom: '1rem' }}></div>
            <div style={{ ...skeletonLineStyle, width: '30%', height: '24px' }}></div>
          </div>
        </div>
      ))}
    </div>
    
    {/* Articles list skeleton */}
    <div style={skeletonCardStyle}>
      <div style={{ padding: '1.5rem' }}>
        <div style={{ ...skeletonLineStyle, width: '30%', marginBottom: '1rem' }}></div>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
            <div style={{ ...skeletonLineStyle, width: '70%', marginBottom: '0.5rem' }}></div>
            <div style={{ ...skeletonLineStyle, width: '40%', height: '12px' }}></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ArticleSkeleton = () => (
  <div style={{ width: '100%', maxWidth: '800px' }}>
    {/* Title skeleton */}
    <div style={{ ...skeletonHeaderStyle, marginBottom: '1rem' }}></div>
    <div style={{ ...skeletonLineStyle, width: '60%', marginBottom: '2rem' }}></div>
    
    {/* Image skeleton */}
    <div style={{ ...skeletonImageStyle, aspectRatio: '16/9', marginBottom: '2rem' }}></div>
    
    {/* Content skeleton */}
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i} style={{ marginBottom: '1rem' }}>
        <div style={{ ...skeletonLineStyle, width: '100%', marginBottom: '0.5rem' }}></div>
        <div style={{ ...skeletonLineStyle, width: '90%', marginBottom: '0.5rem' }}></div>
        <div style={{ ...skeletonLineStyle, width: `${70 + Math.random() * 30}%` }}></div>
      </div>
    ))}
  </div>
);

const FormSkeleton = () => (
  <div style={{ width: '100%', maxWidth: '400px' }}>
    {/* Title skeleton */}
    <div style={{ ...skeletonHeaderStyle, marginBottom: '1rem' }}></div>
    <div style={{ ...skeletonLineStyle, width: '70%', marginBottom: '2rem' }}></div>
    
    {/* Form fields skeleton */}
    {[1, 2, 3].map(i => (
      <div key={i} style={{ ...skeletonInputStyle, marginBottom: '1rem' }}></div>
    ))}
    
    {/* Button skeleton */}
    <div style={{ ...skeletonButtonStyle, width: '100%', height: '50px', marginTop: '1rem' }}></div>
  </div>
);

const DefaultSkeleton = () => (
  <div style={{ width: '100%', maxWidth: '600px' }}>
    <div style={skeletonHeaderStyle}></div>
    <div style={{ ...skeletonLineStyle, width: '70%', marginBottom: '2rem' }}></div>
    {[1, 2, 3].map(i => (
      <div key={i} style={{ ...skeletonLineStyle, width: `${60 + i * 15}%`, marginBottom: '1rem' }}></div>
    ))}
  </div>
);

// Styles
const loaderContainerStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: '#07080a',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  padding: '2rem',
  // Cyber background
  backgroundImage: `
    repeating-linear-gradient(to right, #d0f33010 0 1px, transparent 1px 80px),
    repeating-linear-gradient(to bottom, #d0f33010 0 1px, transparent 1px 80px)
  `,
  animation: 'cyberbgmove 8s linear infinite',
};

const loaderContentStyle = {
  width: '100%',
  maxWidth: '1200px',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(15px) saturate(1.2)',
  WebkitBackdropFilter: 'blur(15px) saturate(1.2)',
  borderRadius: '16px',
  padding: '2rem',
  border: '1px solid #d0f33055',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(208,243,48,0.2)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const skeletonBaseStyle = {
  background: 'linear-gradient(90deg, rgba(208,243,48,0.1) 25%, rgba(208,243,48,0.2) 50%, rgba(208,243,48,0.1) 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 2s infinite',
  borderRadius: '8px',
};

const skeletonHeaderStyle = {
  ...skeletonBaseStyle,
  width: '50%',
  height: '32px',
  marginBottom: '0.5rem',
};

const skeletonLineStyle = {
  ...skeletonBaseStyle,
  width: '80%',
  height: '16px',
  marginBottom: '0.5rem',
};

const skeletonCardStyle = {
  ...skeletonBaseStyle,
  width: '100%',
  minHeight: '200px',
  animation: 'none',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid #d0f33022',
};

const skeletonImageStyle = {
  ...skeletonBaseStyle,
  width: '100%',
  height: '150px',
};

const skeletonButtonStyle = {
  ...skeletonBaseStyle,
  width: '80px',
  height: '32px',
};

const skeletonInputStyle = {
  ...skeletonBaseStyle,
  width: '100%',
  height: '48px',
};

const messageStyle = {
  color: '#d0f330',
  fontSize: '1.2rem',
  fontWeight: '600',
  margin: '2rem 0 0 0',
  textAlign: 'center',
};

// Add keyframes for animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  @keyframes cyberbgmove {
    0% { background-position: 0 0, 0 0; }
    100% { background-position: 80px 80px, 80px 80px; }
  }
`;
document.head.appendChild(styleSheet);

export default Loader;
