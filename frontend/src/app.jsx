import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header.jsx'; 
import LandingPage from './pages/Landingpage.jsx';
import AuthPage from './pages/Authpage.jsx';
import HomePage from './pages/Homepage.jsx';
import ClubsPage from './pages/Clubspage.jsx'; 
import Clubdashboard from './pages/Clubdashboard.jsx';


import './app.css'; 
function App() {
  return (
    <Router>
      <Header /> {/* Your global header */}
      <div className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Protected/Authenticated Routes (for now, just accessible) */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/clubs" element={<ClubsPage />} />
          
          <Route path ="clubs/:id" element={<Clubdashboard />} />
          {/* Add more routes here as your application grows */}
          {/* Optional: A catch-all route for 404 Not Found pages */}
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <h2>404 - Page Not Found</h2>
              <p>The page you are looking for does not exist.</p>
              <p><Link to="/">Go to Home</Link></p>
            </div>
          } />
        </Routes>
      </div>
      {/* You can add a global Footer component here too */}
    </Router>
  );
}

export default App;
