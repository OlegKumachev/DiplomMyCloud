import React, { useState } from 'react';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [comment, setComment] = useState('');
    const [original_name, setOriginal_name] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleCommentChange = (e) => {
        setOriginal_name(e.target.value);
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
            setComment('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Upload File</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input type="file" onChange={handleFileChange} />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Add a comment"
                        value={original_name}
                        onChange={handleCommentChange}
                    />
                </div>
                <button type="submit">Upload</button>
                {error && <div>{error}</div>}
                {success && <div>{success}</div>}
            </form>
        </div>
    );
};

export default FileUpload;
