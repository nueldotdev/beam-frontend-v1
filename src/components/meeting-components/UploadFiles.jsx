import React, { useState, useRef } from "react";
import { uploadMeetingFile } from "../../utils/apicalls";
import Button from "../Button";
import { ArrowUp } from "lucide-react";

function UploadFiles({ meetingId }) {
  const [file, setFile] = useState(null);
  const [customFilename, setCustomFilename] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setCustomFilename(f.name);
      setStatus("");
      setProgress(0);
    }
    // Clear input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const determineFileType = (f) => {
    if (!f) return "pdf";
    if (f.type.startsWith("image/")) return "image";
    if (f.name.toLowerCase().endsWith(".pptx")) return "pptx";
    if (f.name.toLowerCase().endsWith(".png")) return "image";
    if (f.name.toLowerCase().endsWith(".jpg") || f.name.toLowerCase().endsWith(".jpeg")) return "image";
    return "pdf"; 
  };

  const handleUpload = () => {
    if (!file) return;

    setLoading(true);
    setStatus("Uploading...");

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !preset) {
      setStatus("Error: Cloudinary config missing");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    // Use 'image' resource_type for actual images, 'raw' for PDFs and PPTX.
    // Uploading a PDF to /image/upload generates a broken image URL; /raw/upload keeps the file as-is.
    const isImage = file.type.startsWith("image/");
    const resourceType = isImage ? "image" : "raw";

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        setProgress(pct);
      }
    });

    xhr.onreadystatechange = async () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            // Store the clean Cloudinary URL — no fl_attachment flag.
            // fl_attachment is an image transformation and breaks raw resource URLs.
            const fileUrl = data.secure_url;

            setStatus("Notifying server...");
            
            const fileType = determineFileType(file);
            const finalFilename = customFilename.trim() || file.name;

            await uploadMeetingFile({
              meetingId,
              filename: finalFilename,
              fileType,
              fileUrl,
              size: file.size,
            });
            setStatus("Upload successful");
          } catch (err) {
            console.error(err);
            setStatus("Error: " + err.message);
          }
        } else {
          console.error("Upload failed", xhr.responseText);
          setStatus("Error uploading file");
        }
        setLoading(false);
      }
    };

    xhr.send(formData);
  };

  const handleClick = () => {
    if (file && !loading && progress === 0) {
      handleUpload();
    } else {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="upload-box" onClick={handleClick}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf, .png, .jpg, .jpeg, .pptx"
        style={{ display: "none" }}
      />

      <div className="upload-info">
        {file ? (
          <>
            <input
              className="file-name"
              value={customFilename}
              onChange={(e) => setCustomFilename(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="File name"
              style={{ background: 'transparent', border: '1px solid #d1d5db', borderRadius: '4px', padding: '2px 6px', width: '100%', cursor: 'text' }}
            />
            <span className="file-size">{formatSize(file.size)}</span>
            {status && <p className="upload-status">{status}</p>}
          </>
        ) : (
          <span className="file-placeholder">Click to select a file (PDF, Image, PPTX)</span>
        )}
      </div>

      <div className="upload-progress">
        {loading && (
          <>
            <svg className="progress-circle" viewBox="0 0 36 36">
              <path
                className="progress-bg"
                d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0-31.831"
              />
              <path
                className="progress-bar"
                strokeDasharray={`${progress}, 100"`}
                d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0-31.831"
              />
            </svg>
            <span className="progress-text">{progress}%</span>
          </>
        )}
        {!loading && file && progress === 0 && (
          <button onClick={handleUpload} className="upload-btn">
            <ArrowUp />
          </button>
        )}
      </div>
    </div>
  );
}

export default UploadFiles;
