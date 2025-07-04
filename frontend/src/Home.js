import React from 'react';
// import Navbar from './Navbar'; // Uncomment if needed
import Hero from './Hero';
import About from './About';
import Insights from './Insights';
import CTASection from './CTASection';
import Footer from './Footer';

function Home() {
  return (
    <div className="cyber-bg-home font-sans text-gray-900" style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      {/* If you want a dark theme, use: bg-cyber-black text-white */}
      <Hero />
      <About />
      <Insights />
      <CTASection />
      <Footer />
      <style>{`
        .cyber-bg-home {
          position: relative;
          min-height: 100vh;
          background: #07080a;
          overflow-x: hidden;
        }
        .cyber-bg-home h1,
        .cyber-bg-home h2,
        .cyber-bg-home h3,
        .cyber-bg-home h4,
        .cyber-bg-home h5,
        .cyber-bg-home h6 {
          color: #fff !important;
        }
        .cyber-bg-home::before {
          content: '';
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background:
            repeating-linear-gradient(to right, #d0f33010 0 1px, transparent 1px 80px),
            repeating-linear-gradient(to bottom, #d0f33010 0 1px, transparent 1px 80px);
          z-index: 0;
          pointer-events: none;
          animation: cyberbgmove 8s linear infinite;
        }
        @keyframes cyberbgmove {
          0%   { background-position: 0 0, 0 0; }
          100% { background-position: 80px 80px, 80px 80px; }
        }
      `}</style>
    </div>
  );
}

export default Home;
