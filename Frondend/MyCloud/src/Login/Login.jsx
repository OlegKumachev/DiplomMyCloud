import React, { useState } from 'react';
import { LoginForm } from '../LogiinForm/LoginForm';

const LoginPage = () => {
    const [token, setToken] = useState(null);

    const handleLogin = (token) => {
        setToken(token);
        localStorage.setItem('token', token);
        alert(`Token received: ${token}`);
        window.location.href = '/files';  // Переход на страницу с файлами
    };

    return (
        <div>
            <h1>Вход</h1>
            <LoginForm onLogin={handleLogin} />
        </div>
    );
};

export default LoginPage;
