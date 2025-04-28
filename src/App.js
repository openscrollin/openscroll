import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import WriterNavbar from './WriterNavbar'; // ✅ NEW IMPORT

import NewArticle from './NewArticle'; // Import at top
import Home from './Home';
import About from './About';
import Contact from './Contact';
import Privacy from './Privacy';
import Articles from './Articles';
import Signup from './Signup';
import Login from './Login';
import NotFound from './NotFound';
import ForgotPassword from './ForgotPassword';
import ProtectedRoute from './ProtectedRoute';
import WriterLogin from './WriterLogin';
import WriterSignup from './WriterSignup';
import WriterForgotPassword from './WriterForgotPassword';
import WriterDashboard from './WriterDashboard';
import AddArticle from './AddArticle';
import SingleArticle from './SingleArticle';
import EditArticle from './EditArticle'; 
import ReaderProfile from './ReaderProfile';
import WriterProfile from './WriterProfile';




function AppContent() {
  const location = useLocation();

  // ✅ Detect if it's a writer page
  const isWriterRoute = location.pathname.startsWith('/writer');

  // ✅ Pages where we want to hide the navbars completely (like login, signup)
  const hideNavbarRoutes = [
    '/login',
    '/signup',
    '/forgot-password',
    '/writer/login',
    '/writer/signup',
    '/writer/forgot-password'
  ];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {/* ✅ Show correct Navbar */}
      {!shouldHideNavbar && (isWriterRoute ? <WriterNavbar /> : <Navbar />)}

      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/articles/:id" element={<SingleArticle />} />
        <Route path="/profile" element={<ReaderProfile />} />


        {/* Articles page Protected */}
        <Route path="/articles" element={
          <ProtectedRoute>
            <Articles />
          </ProtectedRoute>
        } />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Writer Pages */}
        <Route path="/writer/login" element={<WriterLogin />} />
        <Route path="/writer/signup" element={<WriterSignup />} />
        <Route path="/writer/forgot-password" element={<WriterForgotPassword />} />
        <Route path="/writer/dashboard" element={<WriterDashboard />} />
        <Route path="/writer/new-article" element={<AddArticle />} />
        <Route path="/writer/new-article" element={<NewArticle />} />
        <Route path="/writer/edit-article/:id" element={<EditArticle />} />
        <Route path="/writers/:email" element={<WriterProfile />} />


        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
