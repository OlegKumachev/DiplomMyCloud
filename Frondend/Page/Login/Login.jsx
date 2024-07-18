import React, { useState } from 'react';
import LoginForm from '../../MyCloud/src/LogiinForm/LoginForm';

const LoginPage = () => {
    const [token, setToken] = useState(null);

    const handleLogin = (token) => {
        setToken(token);
        // Дополнительные действия после успешного входа, например, перенаправление пользователя
        window.location.href = '/dashboard';
    };

    return (
        <div>
            <h1>Вход</h1>
            <LoginForm onLogin={handleLogin} />
        </div>
    );
};

export default LoginPage;
