import React, { useState, useRef } from "react";
import { uploadMeetingFile } from "../../utils/apicalls";
import { pdfjs } from "react-pdf";
import Button from "../Button";
import { ArrowUp } from "lucide-react";

// Set worker for extraction
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function UploadFiles({ meetingId }) {
  // ... (keep state)
  const [file, setFile] = useState(null);
  const [customFilename, setCustomFilename] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const extractTextFromPdf = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(" ");
        fullText += `\n--- [PAGE ${i}] ---\n${pageText}\n`;
      }
      return fullText;
    } catch (err) {
      console.warn("Failed to extract PDF text:", err);
      return "";
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setStatus("Processing...");

    let extractedText = "";
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      setStatus("Extracting text for AI...");
      extractedText = await extractTextFromPdf(file);
    }

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
              extractedText: extractedText // Send to backend
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
