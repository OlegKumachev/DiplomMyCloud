import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AdminUsersList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Unauthorized');
                navigate('/login'); // Перенаправляем на страницу входа
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:8000/api/ad/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUsers();
    }, [navigate]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Users List</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        <a onClick={() => navigate(`/user/${user.id}`)}>{user.username}, </a> <div>ADMin {user.is_superuser ? 'Yes' : 'No'}</div>
             
                    </li>
                ))}
            </ul>
        </div>
    );
};
