import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#e0e0e0', borderRadius: '5px' }}>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', justifyContent: 'center' }}>
        <li style={{ margin: '0 15px' }}>
          <Link to="/home" style={{ textDecoration: 'none', color: '#0056b3', fontWeight: 'bold' }}>Home</Link>
        </li>
        <li style={{ margin: '0 15px' }}>
          <Link to="/clubs" style={{ textDecoration: 'none', color: '#0056b3', fontWeight: 'bold' }}>Clubs</Link>
        </li>
        {/* Add more links for other pages here later */}
      </ul>
    </nav>
  );
}

export default Navigation;