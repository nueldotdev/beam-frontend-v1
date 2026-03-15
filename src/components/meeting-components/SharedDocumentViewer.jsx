import { useState, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { MonitorOff } from "lucide-react";

// Set worker to render PDFs efficiently
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

/**
 * SharedDocumentViewer
 * Renders PDFs, images, and PPTX files in the meeting.
 * Props:
 *  - url          : string - Cloudinary URL of the file
 *  - page         : number - current page (for PDF)
 *  - fileType     : 'pdf' | 'image' | 'pptx'
 *  - isHost       : bool  - whether current user is the host
 *  - followHost   : bool  - whether participant is following host pages
 *  - onPageChange : fn(page) - called when user changes page
 *  - onToggleFollow: fn() - called to re-sync to host
 *  - onStopPresenting: fn() | null - if provided (host only), shows Stop button
 */
export function SharedDocumentViewer({ url, page, fileType = 'pdf', isHost, onPageChange, followHost, onToggleFollow, onStopPresenting }) {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleNext = () => {
    if (page < numPages) onPageChange(page + 1);
  };

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  // Strip the fl_attachment flag from the URL for inline rendering
  // (fl_attachment forces download, which breaks in-page display)
  const viewUrl = url?.replace('/fl_attachment/', '/') ?? url;

  // Memoize so react-pdf doesn't see a new object reference on every render
  const pdfOptions = useMemo(() => ({ withCredentials: false }), []);

  const renderContent = () => {
    if (fileType === 'image') {
      return (
        <img
          src={viewUrl}
          alt="Presented document"
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block', margin: '0 auto' }}
          crossOrigin="anonymous"
        />
      );
    }

    if (fileType === 'pptx') {
      // Use Microsoft Office Online Viewer for PPTX files — works with public Cloudinary URLs
      const encoded = encodeURIComponent(viewUrl);
      return (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encoded}`}
          title="PPTX Presentation"
          style={{ width: '100%', height: '100%', border: 'none' }}
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      );
    }

    // Default: PDF via react-pdf
    // Memoized options prevents unnecessary re-renders/reloads warned by react-pdf
    return (
      <Document
        file={viewUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div style={{ padding: '20px', color: '#888' }}>Loading PDF...</div>}
        error={<div style={{ padding: '20px', color: '#f87171' }}>Failed to load PDF. Check CORS settings or the file URL.</div>}
        options={pdfOptions}
      >
        <Page
          pageNumber={page}
          width={600}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
    );
  };

  return (
    <div className="shared-doc-viewer" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#1a1a2e', padding: '10px' }}>
      {/* Toolbar */}
      <div className="doc-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '8px' }}>
        
        {/* Page controls — only relevant for PDFs */}
        {fileType === 'pdf' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button onClick={handlePrev} disabled={page <= 1} className="btn">Prev</button>
            <span style={{ margin: '0 6px', color: '#ccc', fontSize: '13px' }}>
              {page} / {numPages ?? '?'}
            </span>
            <button onClick={handleNext} disabled={page >= numPages} className="btn">Next</button>
          </div>
        )}

        {/* Spacer for non-PDF types */}
        {fileType !== 'pdf' && <div />}

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Resync to host — visible to participants only */}
          {!followHost && !isHost && (
            <button onClick={onToggleFollow} className="btn btn-primary" style={{ backgroundColor: '#2563eb', color: 'white', fontSize: '12px' }}>
              Sync to Presenter
            </button>
          )}

          {/* Stop Presenting — visible to host only */}
          {isHost && onStopPresenting && (
            <button
              onClick={onStopPresenting}
              className="btn"
              style={{ backgroundColor: '#dc2626', color: 'white', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
            >
              <MonitorOff size={16} />
              Stop Presenting
            </button>
          )}
        </div>
      </div>

      {/* Document content */}
      <div className="doc-content" style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: fileType === 'image' ? 'center' : 'flex-start' }}>
        {renderContent()}
      </div>
    </div>
  );
}
