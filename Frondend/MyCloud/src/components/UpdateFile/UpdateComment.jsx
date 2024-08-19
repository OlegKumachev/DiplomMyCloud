import React, { useState } from 'react';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_APP_API_URL;

export const UpdateComment = ({ fileId, onUpdate }) => {
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState('');

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        const url = `${apiUrl}api/file/${fileId}/`;

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
            
            onUpdate(fileId,  newComment);
            setNewComment('')
            
            } catch (error) {
                setError(err.message);
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

