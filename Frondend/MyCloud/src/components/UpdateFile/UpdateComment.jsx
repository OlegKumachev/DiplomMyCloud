import React, { useState } from 'react';
import axios from 'axios';

export const UpdateComment = ({ fileId, onUpdate }) => {
    const [newComment, setNewComment] = useState('');

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        const url = `http://127.0.0.1:8000/api/file/${fileId}/`;

        const data = {
            comment: newComment
        };

        try {
            const response = await axios.patch(url, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            console.log('File updated successfully', response.data);
            onUpdate(fileId,  newComment);
        } catch (error) {
            console.error('Error updating file:', error);
        }
    };


    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    return (
        <div>
            <div>
                <input
                    type="text"
                    placeholder="Введите новый комментарий"
                    value={newComment}
                    onChange={handleCommentChange}
                />
            </div>
            <button onClick={handleUpdate}>
                Обновить файл
            </button>
        </div>
    );
};

