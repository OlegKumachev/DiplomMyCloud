import React, { useState } from 'react';
import './FileUpload.css';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [comment, setComment] = useState(''); // Состояние для комментария
    const [original_name, setOriginal_name] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleNameChange = (e) => {
        setOriginal_name(e.target.value);
    };

    const handleCommentChange = (e) => { // Исправлено имя функции
        setComment(e.target.value); // Используйте setComment для обновления комментария
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
        formData.append('comment', comment); // Добавление комментария в formData

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://127.0.0.1:8000/api/file/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }

            setSuccess('File uploaded successfully');
            setSelectedFile(null);
            setOriginal_name(''); // Очистить поле имени после успешной загрузки
            setComment(''); // Очистить поле комментария после успешной загрузки
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="upload-container">
            <h2>Upload File</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input type="file" onChange={handleFileChange} className="file-input" />
                </div>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Add a Name"
                        value={original_name}
                        onChange={handleNameChange}
                        className="text-input"
                    />
                    <input
                        type="text"
                        placeholder="Add a Comment"
                        value={comment}
                        onChange={handleCommentChange} // Исправлено имя функции
                        className="text-input"
                    />
                </div>
                <button type="submit" className="upload-button">Upload</button>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
            </form>
        </div>
    );
};

export default FileUpload;
