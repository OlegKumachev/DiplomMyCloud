import React, { useState } from 'react';
import axios from 'axios';

const UpdateFile = ({ fileId, onUpdate }) => {
    const [newName, setNewName] = useState('');


    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        const url = `http://127.0.0.1:8000/api/file/${fileId}/`;

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
            
            console.log('File updated successfully', response.data);
            onUpdate(fileId, newName); // Передача новых данных обратно в родительский компонент
        } catch (error) {
            console.error('Error updating file:', error);
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

export default UpdateFile;
