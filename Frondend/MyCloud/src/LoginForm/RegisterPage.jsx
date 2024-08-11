import React, { useState } from 'react';
import './LoginRegisterForm.css';

export const RegisterPage = ({ onRegister }) => {
    const [username, setUsername] = useState('');
    const [first_name, setFirstname] = useState('');
    const [last_name, setLastname] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://127.0.0.1:8000/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, first_name, last_name,  email, password }),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const data = await response.json();
            console.log('Registration successful:', data);

            // Save tokens in localStorage
            localStorage.setItem('token', data.access);
            localStorage.setItem('refreshToken', data.refresh);

            // Optionally call onRegister if needed
            if (onRegister) {
                onRegister(data.access); // Handle token if passed to parent
            }

            // Redirect to the files page
            window.location.href = '/files'; 

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="form-container">
    <h1>Register</h1>
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
            <label>First Name:</label>
            <input
                type="text"
                value={first_name}
                onChange={(e) => setFirstname(e.target.value)}
                required
            />
        </div>
        <div className="form-group">
            <label>Last Name:</label>
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
            <label>Password:</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
        </div>
        <button type="submit">Register</button>
        {error && <div className="error-message">{error}</div>}
    </form>
</div>

    );
};

