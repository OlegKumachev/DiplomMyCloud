import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import humanize from 'humanize-plus';
import { PublicLink } from '../components/PublicLink/PublicLink';
import { UpdateFile } from '../components/UpdateFile/UpdateFile';
import { DeleteFileButton } from '../components/DeleteFile/DeleteFile';
import { UpdateComment } from '../components/UpdateFile/UpdateComment'
import "./UserFilesList.css";

export const UserFilesPage = () => {
    const { userId } = useParams();
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [setPublicLink] = useState('');

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
                    throw new Error('Не удалось получить файлы');
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
                throw new Error(`Не удалось скачать  (status: ${response.status})`);
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
        return <div>Загрузка...</div>;
    }

    return (
    <div className="files-container">
        <h1>Files for User {userId}</h1>
        <table className="files-table">
            <thead>
                <tr>
                    <th>Имя Файла</th>
                    <th>Размер</th>
                    <th>Скачить</th>
                    <th>Обновить</th>
                    <th>Удалить</th>
                    <th>Поделиться</th>
                    <th>Коментарий</th>
                </tr>
            </thead>
            <tbody>
                {files.map(file => (
                    <tr key={file.id}>
                        <td>{file.original_name}</td>
                        <td>{humanize.fileSize(file.size_n)}</td>
                        <td className="Download">
                            <button onClick={() => handleDownload(file.id, file.original_name)}>Download</button>
                        </td>
                        <td className="Upload">
                            <UpdateFile fileId={file.id} onUpdate={handleUpdate} />
                        </td>
                        <td className="Delete">
                            <DeleteFileButton fileId={file.id} onDelete={() => handleDelete(file.id)} />
                        </td>
                        <td className="PublicLink">
                            <PublicLink fileId={file.id} setPublicLink={setPublicLink} />   
                        </td>
                        <td>
                            <UpdateComment/> 
                            {file.comment}
                        </td>                                  
                    </tr>
                ))}
            </tbody>
        </table>
    </div>

    );
};
