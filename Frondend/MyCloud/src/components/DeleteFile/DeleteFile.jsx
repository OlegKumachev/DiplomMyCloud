import React from 'react';
import axios from 'axios';

const DeleteFileButton = ({ fileId, onDelete }) => {
    const handleDelete =  () => {
        const token = localStorage.getItem('token');
        const url = `http://127.0.0.1:8000/api/file/${fileId}/`;

        try {
            const response =  axios.delete(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log('File deleted successfully', response.data);
            onDelete(); 

        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    return (
        <button onClick={handleDelete}>
            Удалить файл
        </button>
    );
};


export default DeleteFileButton
