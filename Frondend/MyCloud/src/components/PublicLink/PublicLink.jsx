import React, { useState } from 'react';4

const apiUrl = import.meta.env.VITE_APP_API_URL;

 export const PublicLink = ({ fileId }) => {
  const [copied, setCopied] = useState(false);
  const url = `${apiUrl}api/download/${fileId}/liberty_link/`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
  };

  return (
    <div>
  
      <button onClick={handleCopy}>Копировать</button>
      {copied && <span>Ссылка скопирована!</span>}
    </div>
  );
};