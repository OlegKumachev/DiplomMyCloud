import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminPage.css'

const apiUrl = import.meta.env.VITE_APP_API_URL;

 export const AdminPage = () => {
    const [username] = useState()
    const [ setAdminData] = useState([]);
    const [ setError] = useState('');


    useEffect(() => {
        const fetchAdminData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Unauthorized');
                return;
            }

            try {
                const response = await fetch(`${apiUrl}/api/ad/`, { 
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to retrieve data');
                }

                const data = await response.json();
                setAdminData(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchAdminData();
    }, []);


    return (
        <div className="admin-container">
            <h1>Админ панель</h1>
            <ul>
                <li><Link to='/files'>Список файлов {username}</Link></li>
                <li><Link to='/users-list'>Список пользователей</Link></li>
            </ul>
        </div>
    );
};

