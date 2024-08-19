import React from 'react';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_APP_API_URL;

export const DeleteFileButton = ({ fileId, onDelete }) => {
    const handleDelete =  () => {
        const token = localStorage.getItem('token');

        try {
            const response =  axios.delete(`${apiUrl}/api/file/${fileId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            onDelete(); 

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <button onClick={handleDelete}>
            Удалить файл
        </button>
    );
};



