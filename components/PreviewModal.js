// components/PreviewModal.js
'use client';
import React from 'react';
import parse from 'html-react-parser';
import '@/styles/section.css';
import "react-quill/dist/quill.core.css";

const PreviewModal = ({ title, content}) => {
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