import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DeleteFileButton from '../components/DeleteFile/DeleteFile';
import UpdateFile from '../components/UpdateFile/UpdateFile';
import { PublicLink } from '../components/PublicLink/PublicLink';


export const FilePage = () => {
    const { fileId } = useParams();
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [ setPublicLink] = useState('');

    useEffect(() => {
        const fetchFile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Unauthorized');
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/file/${fileId}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch file');
                }

                const data = await response.json();
                setFile(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchFile();
    }, [fileId]);

    const handleDownload = async () => {
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
            a.download = file.original_name; // Имя файла
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdate = (fileId, newName) => {
        setFile(prevFile => {
            if (prevFile.id === fileId) {
                return { ...prevFile, original_name: newName };
            }
            return prevFile;
        });
    };

    const handleDelete = () => {
        setFile(null);
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!file) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{file.original_name}</h1>
            <button onClick={handleDownload}>Download {file.original_name}, {file.size_n}, {file.id}</button>
            <UpdateFile fileId={file.id} onUpdate={handleUpdate} />
            <DeleteFileButton fileId={file.id} onDelete={handleDelete} />
            <PublicLink fileId={file.id} setPublicLink={setPublicLink} />
   
        </div>
    );
};
