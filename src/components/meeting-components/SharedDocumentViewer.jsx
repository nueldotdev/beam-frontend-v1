import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Set worker to render PDFs efficiently
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export function SharedDocumentViewer({ url, page, onPageChange, followHost, onToggleFollow }) {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleNext = () => {
    if (page < numPages) {
      onPageChange(page + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  // We add a wrapper with crossOrigin to circumvent some potential Cloudinary CORS issues
  return (
    <div className="shared-doc-viewer" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', padding: '10px' }}>
      <div className="doc-toolbar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          <button onClick={handlePrev} disabled={page <= 1} className="btn">Prev</button>
          <span style={{ margin: '0 10px' }}>Page {page} of {numPages}</span>
          <button onClick={handleNext} disabled={page >= numPages} className="btn">Next</button>
        </div>
        <div>
          {!followHost && (
            <button onClick={onToggleFollow} className="btn btn-primary" style={{ backgroundColor: '#2563eb', color: 'white' }}>
              Sync to Presenter
            </button>
          )}
        </div>
      </div>
      
      <div className="doc-content" style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
         <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div>Loading PDF...</div>}
          >
            <Page pageNumber={page} width={600} renderTextLayer={false} renderAnnotationLayer={false} />
          </Document>
      </div>
    </div>
  );
}
