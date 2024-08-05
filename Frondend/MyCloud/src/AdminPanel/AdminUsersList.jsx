import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import humanize from 'humanize-plus';

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

    const deleteUser = async (userId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Unauthorized');
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/ad/${userId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            // Обновляем список пользователей после удаления
            const updatedUsers = users.filter(user => user.id !== userId);
            setUsers(updatedUsers);
        } catch (err) {
            setError(err.message);
        }
    };

    const toggleSuperuserStatus = async (userId, isSuperuser) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Unauthorized');
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/ad/${userId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ is_superuser: !isSuperuser, is_staff: !isSuperuser }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user status');
            }

            // Обновляем статус пользователя в списке
            const updatedUsers = users.map(user =>
                user.id === userId ? { ...user, is_superuser: !isSuperuser, is_staff: !isSuperuser } : user
            );
            setUsers(updatedUsers);
        } catch (err) {
            setError(err.message);
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Users List</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        <a onClick={() => navigate(`/user_files/${user.id}`)}>{user.username}</a>
                        <button onClick={() => deleteUser(user.id)}>Delete</button>
                        <button onClick={() => toggleSuperuserStatus(user.id, user.is_superuser)}>
                            {user.is_superuser ? 'Revoke Superuser & Staff' : 'Make Superuser & Staff'}
                        </button>
                        <div>ADMin {user.is_superuser ? 'Yes' : 'No'}</div>
                        <div>Размер файлов {humanize.fileSize(user.total_size)}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
