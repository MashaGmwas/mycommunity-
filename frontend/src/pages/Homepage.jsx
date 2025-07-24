import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/navigation'; 

function HomePage() {
  return (
    <div style={{ textAlign: 'center', padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <Navigation /> {}
      <p>From here, you can navigate to different sections of the community hub.</p>
      {}
    </div>
  );
}

export default HomePage;