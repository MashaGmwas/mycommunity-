import React, { useState, useEffect }from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/Authcontext';

function Header() {  
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useAuth();

    const handleLogout = () => {
      logout();
      navigate('/auth');
    };
       
    return (
      <header style={{
        padding: '10px 20px',
        backgroundColor: '#333',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>          
      <h1> My Community </h1>
      <nav>
        <ul style={{ listStyle: 'none', margin: 0, display: 'flex'}}>
          <li style={{ margin: '0 10px'}}>
            <Link to="/home" style={{ color: 'white', textDecoration: 'none'}}>Home</Link>
          </li>
          <li style={{ margin: '0 10px'}}>
            <Link to="/clubs" style={{ color: 'white', textDEcoration: 'none'}}>Clubs</Link>
          </li>
          {isLoggedIn ? (
            <>
              <li style={{ margin: '0 10px' }}>
                <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none',}}>Dashboard</Link>
              </li>
              <li style={{ margin: '0 10px'}}>
                <button 
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1em'
                }}
                >
                  Logout
                </button>
              </li>
            </>
          ) :  (
            <li style={{ margin: '0 10px'}}>
              <Link to="/auth" style={{ color: 'white', textDecoration:'none'}}> Login/Register</Link>
            </li>
          )}
        </ul>
      </nav>      
    </header>
  );
}

export default Header;