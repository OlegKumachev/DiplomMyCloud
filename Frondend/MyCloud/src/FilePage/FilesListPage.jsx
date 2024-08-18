import React, { useEffect, useState } from 'react';
import humanize from 'humanize-plus';
import { useNavigate } from 'react-router-dom';
import { DeleteFileButton } from '../components/DeleteFile/DeleteFile';
import { UpdateFile}  from '../components/UpdateFile/UpdateFile';
import { PublicLink } from '../components/PublicLink/PublicLink';
import { UpdateComment } from '../components/UpdateFile/UpdateComment';
import { FileUpload}  from '../components/FileUpload/FileUpload';
import '../AdminPanel/UserFilesList.css';

export const FilesListPage = () => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [setPublicLink] = useState('');
  

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
                throw new Error('Не удалось получить файлы');
            }

            const data = await response.json();
            setFiles(data);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

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

    const handleDelete = (fileId) => {
        setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
    };

    const handleUpdate = (fileId, newName) => {
        setFiles(prevFiles => prevFiles.map(file => 
            file.id === fileId ? { ...file, original_name: newName } : file
        ));
        fetchFiles()
    };

    const handleCommentFiles = (fileId, newComment) => {
        setFiles(prevFiles => prevFiles.map(file => 
            file.id === fileId ? { ...file, comment: newComment } : file
        ));
    };
    
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="files-container">
            <h1>Files</h1>
            <FileUpload onUploadSuccess={fetchFiles} />
            <table className="files-table">
                <thead>
                    <tr>
                        <th>Имя файла</th>
                        <th>Размер</th>
                        <th>Скачать файл</th>
                        <th>Обновить файл</th>
                        <th>Удалить</th>
                        <th>Публичная ссылка</th>
                        <th>Комментарий</th>
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
                                <UpdateComment fileId={file.id} onUpdate={handleCommentFiles}/>
                                {file.comment}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
