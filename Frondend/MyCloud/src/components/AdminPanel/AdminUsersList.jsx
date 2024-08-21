import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import humanize from 'humanize-plus';
import './AdminUserList.css'


const apiUrl = import.meta.env.VITE_APP_API_URL;

export const AdminUsersList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Unauthorized');
                navigate('/login'); 
                return;
            }

            try {
                const response = await fetch(`${apiUrl}/api/ad/`, {
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
        <div className="users-container">
    <h1>Users List</h1>
    <ul className="users-list">
        {users.map(user => (
            <li key={user.id}>
                <a onClick={() => navigate(`/user_files/${user.id}`)}>{user.username}</a>
                <div className="user-info">
                    <button onClick={() => deleteUser(user.id)}>Delete</button>
                    <button onClick={() => toggleSuperuserStatus(user.id, user.is_superuser)}>
                        {user.is_superuser ? 'Revoke Superuser & Staff' : 'Make Superuser & Staff'}
                    </button>
                    <div>Admin {user.is_superuser ? 'Yes' : 'No'}</div>
                    <div>File Size {humanize.fileSize(user.total_size)}</div>
                </div>
            </li>
        ))}
    </ul>
</div>
    );
};
