import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Insights from './Insights';
import CTASection from './CTASection';  // ✅ New
import Footer from './Footer';          // ✅ New

function Home() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#f9f9f7' }}>
      <Navbar />
      <Hero />
      <About />
      <Insights />
      <CTASection />
      <Footer />
    </div>
  );
}

export default Home;
