import React, { useState } from 'react';
import './LoginRegisterForm.css';

const apiUrl = import.meta.env.VITE_APP_API_URL;

export const RegisterPage = ({ onRegister }) => {
    const [username, setUsername] = useState('');
    const [first_name, setFirstname] = useState('');
    const [last_name, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePassword(password)) {
            setError('Пароль должен содержать не менее 6 символов, включая как минимум одну заглавную букву, одну цифру и один специальный символ.');
            return;
        }
        
        try {
            const response = await fetch(`${apiUrl}/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, first_name, last_name, email, password }),
            });

            if (!response.ok) {
                throw new Error('Error');
            }

            const data = await response.json();
          
            localStorage.setItem('token', data.access);
            localStorage.setItem('refreshToken', data.refresh);

            if (onRegister) {
                onRegister(data.access);
            }

            window.location.href = '/files'; 

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="form-container">
            <h1>Регистрация</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Login:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Имя:</label>
                    <input
                        type="text"
                        value={first_name}
                        onChange={(e) => setFirstname(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Фамилия:</label>
                    <input
                        type="text"
                        value={last_name}
                        onChange={(e) => setLastname(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Пароль:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Регистрация</button>
                {error && <div className="error-message">{error}</div>}
            </form>
        </div>
    );
};
