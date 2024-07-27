import React from 'react';

const DownloadFile = ({ publicLink }) => {
    const handleDownload = () => {
        window.open(publicLink, '_blank');
    };

    return (
        <div>
            <button onClick={handleDownload}>Download File</button>
        </div>
    );
};

export default DownloadFile;