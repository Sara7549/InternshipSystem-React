import React, { useState } from "react";
import '../styles/UploadDocuments.css';

const UploadDocuments = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const updatedFiles = files.map((file) => ({
      name: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`, // Convert size to KB
      url: URL.createObjectURL(file), // Generate a temporary URL for preview
    }));
    setUploadedFiles((prevFiles) => [...prevFiles, ...updatedFiles]);
  };

  const handleFileRemove = (index) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="upload-documents-container">
      <h2>Upload Extra Documents</h2>
      <p>Upload any documents that showcase your fit for the internship (e.g., certificates, cover letter, CV).</p>

      {/* File Upload Input */}
      <input
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" // Accept specific file types
        onChange={handleFileUpload}
        className="file-input"
      />

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <h3>Uploaded Documents</h3>
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index} className="file-item">
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.name} ({file.size})
                </a>
                <button onClick={() => handleFileRemove(index)} className="remove-btn">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadDocuments;