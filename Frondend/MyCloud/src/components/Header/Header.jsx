import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const apiUrl = import.meta.env.VITE_APP_API_URL;

export const Header = () => {
    const [username, setUsername] = useState(''); 
    const [error, setError] = useState('');       
    const navigate = useNavigate();
    const location = useLocation();

    const isAuthenticated = !!localStorage.getItem('token');

    useEffect(() => {
        const fetchUsername = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Unauthorized');
                return;
            }

            try {
                const response = await fetch(`${apiUrl}/api/ad/me/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                setUsername(data.username); 
            } catch (err) {
                setError(err.message);
            }
        };

        if (isAuthenticated) {
            fetchUsername();
        }
    }, [isAuthenticated]);

    const handleLogin = () => {
        navigate('/login/');
    };

    const handleRegister = () => {
        navigate('/register/');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login/');
    };

    return ( 
        <div className="header-container">
            <h1 className="headed-cloud">My Cloud</h1>

            {!isAuthenticated && (
                <div className='header-button-group'>
                    {location.pathname !== '/login/' && (
                        <button className="login-button" onClick={handleLogin}>Login</button>
                    )}
                    {location.pathname !== '/register/' && (
                        <button className="register-button" onClick={handleRegister}>Register</button>
                    )}
                </div>
            )}

            {isAuthenticated && (
                <div className="user-info">
                    {username ? (
                        <span className="username">Привет, {username}!</span>
                    ) : (
                        <span>Загрузка...</span>
                    )}
                    <div className='header-button-group'>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            )}

            {error && <div className="error">{error}</div>}
        </div>
    );
};
