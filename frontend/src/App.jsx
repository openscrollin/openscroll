import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* Reader Signup/Login */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Writer Signup/Login */}
        <Route path="/writer/signup" element={<Signup />} />
        <Route path="/writer/login" element={<Login />} />

        {/* Reader and Creator Dashboards */}
        {/* These pages we will build next */}
        {/* <Route path="/read" element={<ReaderDashboard />} /> */}
        {/* <Route path="/write" element={<CreatorDashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
