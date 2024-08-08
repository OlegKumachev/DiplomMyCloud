import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import humanize from 'humanize-plus';
import { PublicLink } from '../components/PublicLink/PublicLink';
import UpdateFile from '../components/UpdateFile/UpdateFile';
import DeleteFileButton from '../components/DeleteFile/DeleteFile';

export const UserFilesPage = () => {
    const { userId } = useParams();
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [publicLink, setPublicLink] = useState('');

    useEffect(() => {
        const fetchFiles = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Unauthorized');
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/file/user_files/${userId}/`, {
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
    }, [userId]);

    const handleDownload = async (fileId, fileName) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Unauthorized');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/file/${fileId}/download/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to download file (status: ${response.status})`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdate = (fileId, newName) => {
        setFiles(prevFiles =>
            prevFiles.map(file =>
                file.id === fileId ? { ...file, original_name: newName } : file
            )
        );
    };

    const handleDelete = (fileId) => {
        setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!files.length) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Files for User {userId}</h1>
            <ul>
                {files.map(file => (
                    <li key={file.id}>
                        <h2>{file.original_name}</h2>
                        <button onClick={() => handleDownload(file.id, file.original_name)}>Download {file.original_name}, {humanize.fileSize(file.size_n)}</button>
                        <UpdateFile fileId={file.id} onUpdate={handleUpdate} />
                        <DeleteFileButton fileId={file.id} onDelete={() => handleDelete(file.id)} />
                        <PublicLink fileId={file.id} setPublicLink={setPublicLink} />
                        
                    </li>
                ))}
            </ul>
        </div>
    );
};
