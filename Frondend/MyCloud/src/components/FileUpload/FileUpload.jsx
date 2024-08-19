import React, { useState } from 'react';
import './FileUpload.css';

const apiUrl = import.meta.env.VITE_APP_API_URL;

export const FileUpload = ({ onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [comment, setComment] = useState('');
    const [original_name, setOriginal_name] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleNameChange = (e) => {
        setOriginal_name(e.target.value);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            setError('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('original_name', original_name);
        formData.append('comment', comment);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/api/file/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка обновления файла');
            }

            setSelectedFile(null);
            setOriginal_name('');
            setComment('');

            if (onUploadSuccess) {
                onUploadSuccess();
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Upload File</h2>
            <div className="input-group">
                <input
                    type="text"
                    placeholder="Добавить имя"
                    value={original_name}
                    onChange={handleNameChange}
                    className="text-input"
                />
                <input
                    type="text"
                    placeholder="Добавить комментарий"
                    value={comment}
                    onChange={handleCommentChange}
                    className="text-input"
                />
            </div>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input type="file" onChange={handleFileChange} className="file-input" />
                </div>
                <button type="submit" className="upload-button">Загрузить</button>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
            </form>
        </div>
    );
};


