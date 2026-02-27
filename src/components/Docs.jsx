// DocsPage.jsx
import React, { useState } from 'react';
import '../styles/docs.css'; // we'll create this file

function Docs() {
  const [docs, setDocs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocs = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      file,
      uploadedAt: new Date().toLocaleString(),
    }));
    setDocs((prev) => [...prev, ...newDocs]);
  };

  const handleDelete = (id) => {
    setDocs((prev) => prev.filter((doc) => doc.id !== id));
  };

  const filteredDocs = docs.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="docs-page">
      <h1>My Documents</h1>

      <div className="docs-controls">
        <label className="upload-btn">
          Upload Docs
          <input type="file" multiple onChange={handleUpload} />
        </label>

        <input
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredDocs.length === 0 ? (
        <p className="no-docs">No documents uploaded yet.</p>
      ) : (
        <div className="docs-list">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="doc-item">
              <div className="doc-info">
                <p className="doc-name">{doc.name}</p>
                <p className="doc-date">{doc.uploadedAt}</p>
              </div>
              <div className="doc-actions">
                <a
                  href={URL.createObjectURL(doc.file)}
                  download={doc.name}
                  className="download-btn"
                >
                  Download
                </a>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(doc.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Docs;