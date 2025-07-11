import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#f0f8ff', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h2>Welcome to Nakuru Community Hub!</h2>
      <p>Connect with your local community and discover amazing clubs and events.</p>
      <div style={{ marginTop: '30px' }}>
        <Link to="/auth" style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '5px', 
            fontSize: '1.1em',
            marginRight: '15px'
        }}>
          Sign In / Sign Up
        </Link>
        {}
      </div>
    </div>
  );
}

export default LandingPage;