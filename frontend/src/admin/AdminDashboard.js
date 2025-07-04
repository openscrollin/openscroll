import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Routes, Route } from 'react-router-dom';
import AdminHome from './pages/AdminHome';
import ManageArticles from './pages/ManageArticles';
import ManageUsers from './pages/ManageUsers';
import AdPromotions from './pages/AdPromotions';
import AdminSettings from './pages/AdminSettings';
import CarouselManager from './pages/CarouselManager';
import HeroImageManager from './pages/HeroImageManager'; // ✅ NEW IMPORT

function AdminDashboard() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('openscroll_admin_token');
    navigate('/admin/login');
  };

  const layout = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    minHeight: '100vh',
    fontFamily: 'Nunito Sans',
    backgroundColor: '#f9f9f9',
  };

  const sidebar = {
    width: isMobile ? '100%' : '240px',
    backgroundColor: '#2c2c2c',
    color: '#fff',
    padding: '1rem',
    display: 'flex',
    flexDirection: isMobile ? 'row' : 'column',
    alignItems: isMobile ? 'center' : 'flex-start',
    justifyContent: isMobile ? 'space-around' : 'flex-start',
    flexWrap: 'wrap',
    gap: isMobile ? '0.5rem' : '1rem',
  };

  const sidebarHeading = {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: isMobile ? '0' : '2rem',
  };

  const navItem = {
    fontSize: '1rem',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    color: '#fff',
    textDecoration: 'none',
    backgroundColor: '#3f3f3f',
  };

  const main = {
    flexGrow: 1,
    padding: '2rem',
  };

  const header = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? '1rem' : '0',
  };

  const logoutBtn = {
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1.2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  };

  return (
    <div style={layout}>
      <aside style={sidebar}>
        {!isMobile && <div style={sidebarHeading}>OpenScroll Admin</div>}
        <Link to="/admin" style={navItem}>Dashboard</Link>
        <Link to="/admin/articles" style={navItem}>Manage Articles</Link>
        <Link to="/admin/users" style={navItem}>Manage Users</Link>
        <Link to="/admin/ads" style={navItem}>Ad Promotions</Link>
        <Link to="/admin/carousel" style={navItem}>Carousel Manager</Link>
        <Link to="/admin/hero-image" style={navItem}>Hero Image</Link> {/* ✅ NEW LINK */}
        <Link to="/admin/settings" style={navItem}>Settings</Link>
      </aside>

      <main style={main}>
        <div style={header}>
          <h2>Admin Dashboard</h2>
          <button style={logoutBtn} onClick={handleLogout}>Logout</button>
        </div>

        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="articles" element={<ManageArticles />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="ads" element={<AdPromotions />} />
          <Route path="carousel" element={<CarouselManager />} />
          <Route path="hero-image" element={<HeroImageManager />} /> {/* ✅ NEW ROUTE */}
          <Route path="settings" element={<AdminSettings />} />
        </Routes>
      </main>
    </div>
  );
}

export default AdminDashboard;
