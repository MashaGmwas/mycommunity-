import React from 'react';
import { Link } from 'react-router-dom'; // Will be used for navigation if you put links here

function Header() {
  return (
    <header style={{ 
      textAlign: 'center', 
      padding: '20px', 
      backgroundColor: '#282c34', 
      color: 'white', 
      borderRadius: '8px 8px 0 0',
      marginBottom: '20px'
    }}>
      <h1>Nakuru Community Hub</h1>
      {/* You can add global navigation links here later */}
    </header>
  );
}

export default Header;