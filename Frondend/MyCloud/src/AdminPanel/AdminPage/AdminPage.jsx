import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Хук для перенаправления
import { FilesListPage } from '../../FilePage/FilesListPage';
import { AdminUsersList } from '../AdminUsersList';

const AdminPage = () => {
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

    const handleDelete = (itemId) => {
        setAdminData(adminData.filter(item => item.id !== itemId));
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Admin Page</h1>
            <ul>
                <li><Link to='/files'>list file</Link></li>
                <li><Link to='/users-list'>list users</Link></li>
            </ul>
            
            



        </div>
    );
};

export default AdminPage;
