import React from 'react';
import { Link } from 'react-router-dom';
import clubsimage from '../assets/images/clubsimage.jpg';
import eventsimage from '../assets/images/eventsimage.jpg'; 
import cpimage from '../assets/images/cpimage.jpg'; 
import newsimage from '../assets/images/newsimage.jpg';
import societiesimage from '../assets/images/societiesimage.jpg';
import './navigation.css';

const navItems =[
  { name: 'Clubs', path:'/clubs',image: clubsimage},
  { name: 'Societies', path:'/societies',image: societiesimage},
  { name: 'Community projects', path:'/communityprojects',image: cpimage},
  { name: 'Events', path:'/events',image: eventsimage},
  { name: 'News', path:'/news',image: newsimage},
]

function Navigation() {
  return (
    <nav className="navigation-container">
      <div className="navigation-grid">
        {navItems.map((item) => (
          <Link to={item.path} key={item.name} className="nav-item-link">
            <div className="nav-item-card">
              <img src={item.image} alt={item.name} className="nav-item-image" />
              <div className="nav-item-overlay">
                <span className="nav-item-name">{item.name}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navigation;