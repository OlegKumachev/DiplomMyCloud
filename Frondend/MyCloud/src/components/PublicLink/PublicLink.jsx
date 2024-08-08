import React, { useState } from 'react';

 export const PublicLink = ({ fileId }) => {
  const [copied, setCopied] = useState(false);
  const url = `http://127.0.0.1:8000/api/download/${fileId}/liberty_link/`;

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