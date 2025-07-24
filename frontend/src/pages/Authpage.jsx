import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/Authcontext';

function Authpage() {
    const [isLogin, setIsLogin] = useState(true); 
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); 
    const navigate = useNavigate(); 
    const { login } = useAuth();

    const handleLoginSubmit = async (e) => {
        e.preventDefault(); 

        setMessage('Logging in...');
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.msg || 'Login successful!');
                login(data.access_token);
               
                navigate('/home') 
            } else {
                setMessage(data.msg || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage('Network error. Please try again.');
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault(); 

        setMessage('Registering...');
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.msg || 'Registration successful! Please log in.');
                setIsLogin(true); 
                setEmail(''); 
            } else {
                setMessage(data.msg || 'Registration failed. User might already exist or invalid data.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setMessage('Network error. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            {message && <p className="message">{message}</p>}

            {isLogin ? (
                <form onSubmit={handleLoginSubmit}>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
            ) : (
                <form onSubmit={handleRegisterSubmit}>
                    <div>
                        <label htmlFor="regUsername">Username:</label>
                        <input
                            type="text"
                            id="regUsername"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="regEmail">Email:</label>
                        <input
                            type="email"
                            id="regEmail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="regPassword">Password:</label>
                        <input
                            type="password"
                            id="regPassword"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Register</button>
                </form>
            )}

            <p>
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button type="button" onClick={() => {
                    setIsLogin(!isLogin);
                    setMessage(''); 
                    setUsername('');
                    setEmail('');
                    setPassword('');
                }}>
                    {isLogin ? 'Register here.' : 'Login here.'}
                </button>
            </p>
        </div>
    );
}

export default Authpage;