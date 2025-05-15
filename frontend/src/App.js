import React, { useContext, useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { UserProvider, UserContext } from './UserContext';
import { debounce } from 'lodash'; // Import debounce

// Navbars
import ReaderNavbar from './ReaderNavbar';
import WriterNavbar from './WriterNavbar';
import Navbar from './Navbar';

// Pages
import Home from './Home';
import About from './About';
import Contact from './Contact';
import Privacy from './Privacy';
import Articles from './Articles';
import Signup from './Signup';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import NotFound from './NotFound';
import ProtectedRoute from './ProtectedRoute';
import PurchasePage from './pages/PurchasePage';
import PaymentSuccess from './pages/PaymentSuccess';
import ReaderDashboard from './pages/ReaderDashboard';
import Favorites from './pages/Favorites';

// Writer Pages
import WriterLogin from './WriterLogin';
import WriterSignup from './WriterSignup';
import WriterForgotPassword from './WriterForgotPassword';
import WriterDashboard from './WriterDashboard';
import AddArticle from './AddArticle';
import EditArticle from './EditArticle';
import WriterProfile from './WriterProfile';

// Reader
import ReaderProfile from './ReaderProfile';
import ReaderPurchases from './pages/ReaderPurchases';

// Admin
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminProtectedRoute from './admin/AdminProtectedRoute';

// Article Details
import ArticleDetails from './ArticleDetails';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Determine user role
  const isWriter = user?.role === 'writer';
  const isReader = user && !isWriter;

  // Routes where navbar should be hidden
  const hideNavbarRoutes = [
    '/login', '/signup', '/forgot-password',
    '/writer/login', '/writer/signup', '/writer/forgot-password',
    '/admin/login'
  ];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname) || location.pathname.startsWith('/admin');

    // Use lodash.debounce for better debouncing
    const handleScroll = useCallback(
      debounce(() => {
        if (window.scrollY > lastScrollY && window.scrollY > 100) { // added scrollY > 100
          setShowNavbar(false);
        } else {
          setShowNavbar(true);
        }
        setLastScrollY(window.scrollY);
      }, 100),
      [lastScrollY]
    );

  // Scroll-based navbar visibility toggle (debounced)
  useEffect(() => {
    const handleRealScroll = () => {
      handleScroll();
    };
    window.addEventListener('scroll', handleRealScroll);
    return () => {
        window.removeEventListener('scroll', handleRealScroll);
    };
}, [handleScroll]);

  // Route-based redirection protection
  useEffect(() => {
    if (isWriter && location.pathname.startsWith('/reader')) {
      navigate('/writer/dashboard');
    } else if (isReader && location.pathname.startsWith('/writer')) {
      navigate('/reader/dashboard');
    }
  }, [user, location.pathname, isWriter, isReader, navigate]);

  return (
    <>
      {!shouldHideNavbar && showNavbar && (
        isWriter ? <WriterNavbar />
        : isReader ? <ReaderNavbar />
        : <Navbar />
      )}

      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/articles/:id" element={<ArticleDetails />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/reader/purchases" element={<ReaderPurchases />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ReaderProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/articles" element={<Articles />} />

        {/* Payment */}
        <Route path="/purchase/:id" element={<PurchasePage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* Reader Auth */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/reader/dashboard"
          element={
            <ProtectedRoute>
              <ReaderDashboard />
            </ProtectedRoute>
          }
        />

        {/* Writer Auth */}
        <Route path="/writer/login" element={<WriterLogin />} />
        <Route path="/writer/signup" element={<WriterSignup />} />
        <Route path="/writer/forgot-password" element={<WriterForgotPassword />} />
        <Route
          path="/writer/dashboard"
          element={
            <ProtectedRoute>
              <WriterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/writer/new-article"
          element={
            <ProtectedRoute>
              <AddArticle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/writer/edit-article/:id"
          element={
            <ProtectedRoute>
              <EditArticle />
            </ProtectedRoute>
          }
        />
        <Route path="/writers/:email" element={<WriterProfile />} />

        {/* Admin Pages */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </Router>
  );
}

export default App;

