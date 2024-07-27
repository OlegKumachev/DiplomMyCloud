// GeneratePublicLink.jsx
import React from 'react';
import axios from 'axios';

const GeneratePublicLink = ({ fileId, setPublicLink }) => {
    const [error, setError] = React.useState('');

    const generateLink = async () => {
        const token = localStorage.getItem('token');
        const url = `http://127.0.0.1:8000/api/file/${fileId}/generate-public-link/`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const special_url = response.data.special_url;
            setPublicLink(publicLink);

            // Copy the public link to clipboard
            await navigator.clipboard.writeText(special_url);
            alert('special_url link copied to clipboard!');
        } catch (err) {
            setError('Error generating public link');
            console.error(err);
        }
    };

    return (
        <div>
            <button onClick={generateLink}>Generate Public Link</button>
            {error && <div>{error}</div>}
        </div>
    );
};

export default GeneratePublicLink;
