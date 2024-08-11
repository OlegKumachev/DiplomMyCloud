import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Хук для перенаправления
import './AdminPage.css'

const AdminPage = () => {
    const [username, setUsername] = useState()
    const [adminData, setAdminData] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Unauthorized');
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:8000/api/ad/', { // Используйте ваш API для админских данных
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch admin data');
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
            <h1>Admin Page</h1>
            <ul>
                <li><Link to='/files'>List Files</Link></li>
                <li><Link to='/users-list'>List Users</Link></li>
            </ul>
        </div>
    );
};

export default AdminPage;
