import React, { useState } from 'react';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_APP_API_URL;

 export const UpdateFile = ({ fileId, onUpdate }) => {
    const [newName, setNewName] = useState('');
    const [error, setError] = useState('');

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        const url = `${apiUrl}/api/file/${fileId}/`;

        const data = {
            original_name: newName
        };

        try {
            const response = await axios.patch(url, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
          
            onUpdate(fileId, newName); 
        } catch (error) {
            setError(err.message);
        }
    };

    const handleNameChange = (e) => {
        setNewName(e.target.value);
    };

    return (
        <div>        
                <input
                    type="text"
                    placeholder="Введите новое имя файла"
                    value={newName}
                    onChange={handleNameChange}
                    
                />
                <button onClick={handleUpdate}>
                Обновить файл
            </button>
        </div>
    );
};


