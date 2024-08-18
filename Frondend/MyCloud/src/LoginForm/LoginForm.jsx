import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginRegisterForm.css';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Не удалось получить Логин');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access);

      onLogin(data.access);

      const userResponse = await fetch('http://127.0.0.1:8000/api/ad/me/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.access}`,
        },
      });

      const userData = await userResponse.json();

      if (userData.is_superuser) {
        navigate('/admin');
      } else {
        navigate('/files');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="form-container">
    <h1>Логин</h1>
    <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label>Имя Пользователя:</label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
        </div>
        <div className="form-group">
            <label>Пароль:</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        <button type="submit">Логин</button>
        {error && <p className="error-message">{error}</p>}
    </form>
</div>

  );
};

export const LoginPage = () => {
  const [token, setToken] = useState(null);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  return (
    <div>
      <h1>Вход</h1>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};


