import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_APP_API_URL;

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
                const response = await fetch(`${apiUrl}/api/ad/${userId}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to retrieve data');
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
