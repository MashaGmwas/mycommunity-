import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/navigation'; // Import the navigation component

function HomePage() {
  return (
    <div style={{ textAlign: 'center', padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h2>Welcome to Your Dashboard!</h2>
      <Navigation /> {/* Include the navigation component here */}
      <p>From here, you can navigate to different sections of the community hub.</p>
      {/* Add more dashboard content here later */}
    </div>
  );
}

export default HomePage;