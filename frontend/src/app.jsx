import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header.jsx'; 
import LandingPage from './pages/Landingpage.jsx';
import AuthPage from './pages/Authpage.jsx';
import HomePage from './pages/Homepage.jsx';
import ClubsPage from './pages/Clubspage.jsx'; 
import Clubdashboard from './pages/Clubdashboard.jsx';
import ProtectedRoute from './utils/ProtectedRoute.jsx';
import { AuthProvider } from './context/Authcontext.jsx';
import SocietiesPage from './pages/Societiespage.jsx';
import Societydashboard from './pages/Societydashboard.jsx';
import CommunityProjects from './pages/cp.jsx';
import Cpdashboard from './pages/Cpdashboard.jsx';
import './app.css';

function App() {
  return (
    <Router>
      <AuthProvider>
      <Header /> 
      <div className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />      
          
          <Route path="/home" 
          element={
            <ProtectedRoute>
            <HomePage />
            </ProtectedRoute>
            } />
          <Route path="/clubs" 
          element={
            <ProtectedRoute>
          <ClubsPage />
          </ProtectedRoute>
          } />
          <Route path="/societies"
          element={
            <ProtectedRoute>
            <SocietiesPage/>
            </ProtectedRoute>
          } />
          
          <Route path ="clubs/:id" element={<Clubdashboard />} />
          <Route path ="societies/:id" element={<Societydashboard />} />

          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <h2>404 - Page Not Found</h2>
              <p>The page you are looking for does not exist.</p>
              <p><Link to="/">Go to Home</Link></p>
            </div>
          } />
        </Routes>
      </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
