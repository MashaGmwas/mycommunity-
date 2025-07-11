import React from 'react';
import { Link } from 'react-router-dom'; // To redirect to Home after hypothetical auth

function AuthPage() {
  return (
    <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#e6f7ff', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h2>Sign In / Sign Up</h2>
      <p>This is where your authentication forms will go.</p>
      <div style={{ marginTop: '30px' }}>
        {/* For now, a simple link to simulate successful login */}
        <p>Pretend you just signed in:</p>
        <Link to="/home" style={{ 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '5px', 
            fontSize: '1.1em'
        }}>
          Go to Home Page
        </Link>
      </div>
    </div>
  );
}

export default AuthPage;