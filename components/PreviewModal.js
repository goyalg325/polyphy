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

 
  @media (max-width: 768px) {
    .ql-editor img {
      display: block;
      margin-left: auto !important;
      margin-right: auto !important;
      width: 100% !important;
      height: auto !important;
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