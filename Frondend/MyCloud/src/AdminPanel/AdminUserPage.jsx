import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const AdminUserPage = () => {
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Unauthorized');
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/ad/${userId}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Не удалось получить файл');
                }

                const data = await response.json();
                setUserData(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUserData();
    }, [userId]);

    if (!userData) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Пользователь</h1>
            <h2>{userData.username}</h2>
        
        </div>
    );
};
