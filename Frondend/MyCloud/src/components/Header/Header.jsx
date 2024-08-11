import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';  // Импорт CSS файла

export const Header = () => {
    const [username, setUsername] = useState(''); // Состояние для имени пользователя
    const [error, setError] = useState('');       // Состояние для ошибок
    const navigate = useNavigate();
    const location = useLocation();

    // Проверка, авторизован ли пользователь
    const isAuthenticated = !!localStorage.getItem('token');

    useEffect(() => {
        const fetchUsername = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Unauthorized');
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:8000/api/ad/me/', { // Замените на правильный URL вашего API
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUsername(data.username); // Устанавливаем имя пользователя
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
