import React from 'react';
import axios from 'axios';

export const DeleteFileButton = ({ fileId, onDelete }) => {
    const handleDelete =  () => {
        const token = localStorage.getItem('token');
        const url = `http://127.0.0.1:8000/api/file/${fileId}/`;

        try {
            const response =  axios.delete(url, {
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



