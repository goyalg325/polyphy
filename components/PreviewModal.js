// components/PreviewModal.js
'use client';
import React, { useEffect } from 'react';
import parse from 'html-react-parser';
import '@/styles/section.css';
import "react-quill/dist/quill.core.css";

// CSS to enforce image margins
const customImageStyle = `
  .ql-editor img {
    margin-top: 5px !important;
    margin-left: 25px !important;
    margin-right: 25px !important;
  }

  /* Center alignment fix */
  img[data-align="center"] {
    display: block !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }

  /* Improved mobile handling */
  @media (max-width: 768px) {
    /* Make content use full width */
    .dynamic-route-wrapper, 
    .preview-modal-content {
      width: 100% !important;
      max-width: 100% !important;
      padding: 0 !important;
    }
    
    /* Make sections use full width */
    .section-1, 
    .section-2, 
    .section-3 {
      width: 100% !important;
      max-width: 100% !important;
      padding: 8px !important;
      margin: 0 0 0.5em 0 !important;
    }
    
    /* Override all image styles for mobile */
    .ql-editor img,
    img[data-align],
    img[style*="float"],
    .section-1 img,
    .section-2 img,
    .section-3 img {
      float: none !important;
      display: block !important;
      margin: 5px auto !important;
      max-width: 95% !important; /* Allow slight margin */
      width: auto !important;
      height: auto !important;
      object-fit: contain !important;
    }
    
    /* Improve text spacing on mobile */
    .ql-editor p,
    .section-1 p,
    .section-2 p, 
    .section-3 p {
      overflow-wrap: break-word !important;
      word-wrap: break-word !important;
      max-width: 100% !important;
      margin: 0.5em 0 !important;
      padding: 0 !important; /* Remove paragraph padding */
    }
    
    /* Reduce spacing between sections */
    .section-1,
    .section-2,
    .section-3 {
      margin-bottom: 0.5em !important;
    }
    
    /* Adjust section padding */
    .ql-editor {
      padding: 4px !important;
    }
  }
`;

const PreviewModal = ({ title, content }) => {
  useEffect(() => {
    // Add the custom style to the document
    const style = document.createElement('style');
    style.innerHTML = customImageStyle;
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const sections = content.split('<hr>').map((sectionContent, index) => {
    const sectionIndex = (index % 3) + 1;
    const sectionKey = `section-${index}-${sectionIndex}`;
    return (
      <div key={sectionKey} className={`section-${sectionIndex} view ql-editor`}>
        {parse(sectionContent)}
      </div>
    );
  });

  return (
    <div className="preview-modal-overlay w-full">
      <div className="preview-modal-content">
        <h1>{title}</h1>
        <div className='dynamic-route-wrapper'>
          {sections}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;