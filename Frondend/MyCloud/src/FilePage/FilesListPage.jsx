import React, { useEffect, useState } from 'react';
import FileUpload from '../components/FileUpload/FileUpload';
import { useNavigate } from 'react-router-dom';
import  DeleteFileButton from '../components/DeleteFile/DeleteFile'
import humanize from 'humanize-plus';

export const FilesListPage = () => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFiles = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Unauthorized');
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:8000/api/file/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch files');
                }

                const data = await response.json();
                setFiles(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchFiles();
    }, []);

    const handleDelete = (fileId) => {
        setFiles(files.filter(file => file.id !== fileId));
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Files</h1>
            <FileUpload />
            <ul>
                {files.map(file => (
                    <li key={file.id}>
                        <a onClick={() => navigate(`/file/${file.id}`)}>{file.original_name}, {humanize.filesize(file.size_n)}</a>
                        <DeleteFileButton fileId={file.id} onDelete={handleDelete} />
                    </li>
                ))}
            </ul>
        </div>
    );
};
