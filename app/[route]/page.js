'use client';
import React, { useEffect, useState } from 'react';
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

  /* Center alignment only for screens wider than 768px */
  @media (min-width: 769px) {
    img[data-align="center"] {
      display: block !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }
  }

  /* Improved mobile handling */
  @media (max-width: 768px) {
    /* Make content use full width */
    .dynamic-route-wrapper {
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

const Page = ({ params }) => {
  const { route } = params;
  const [pageData, setPageData] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set up for the custom style
    const style = document.createElement('style');
    style.innerHTML = customImageStyle;
    document.head.appendChild(style);
    
    // Fetch data and handle redirects
    const fetchPageData = async () => {
      try {
        const response = await fetch(`/api/pages/${route}`);
        const data = await response.json();
        
        if (data.success) {
          // Handle external link redirect
          if (data.data.isLink) {
            setIsRedirecting(true);
            const url = data.data.content;
            
            // Make sure the URL starts with http:// or https://
            const fullUrl = url.startsWith('http://') || url.startsWith('https://') 
              ? url 
              : `https://${url}`;
            
            // Redirect after a very brief timeout
            setTimeout(() => {
              window.location.href = fullUrl;
            }, 50);
            return;
          }
          
          // Only set page data if it's not a link
          setPageData(data.data);
        } else {
          // Handle unsuccessful responses
          setError(data.message || 'Page not found');
        }
      } catch (error) {
        console.error('Failed to fetch page data:', error);
        setError('An error occurred while loading this page');
      }
    };

    fetchPageData();

    // Cleanup function
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [route]);
  // Show error message if page doesn't exist or there was an error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <div className="text-white text-xl mb-2">{error}</div>
        <p className="text-gray-400 text-center max-w-md">
          The page you're looking for might have been removed, renamed, or doesn't exist.
        </p>
        <a href="/" className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
          Return to Home
        </a>
      </div>
    );
  }

  // Show a single loading/redirecting screen for both cases
  if (isRedirecting || !pageData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-4"></div>
        <div className="text-white text-xl">
          {isRedirecting ? "Opening external site..." : "Loading..."}
        </div>
      </div>
    );
  }

  // Parse content with <hr> tags and dynamically assign section classes
  const sections = pageData.content.split('<hr>').map((content, index) => {
    // Calculate section index as 1, 2, or 3
    const sectionIndex = (index % 3) + 1;
    // Use a unique key format combining "section-" and sectionIndex
    const sectionKey = `section-${index}-${sectionIndex}`;
    return (
      <div key={sectionKey} className={`section-${sectionIndex} view ql-editor`}>
        {parse(content)}
      </div>
    );
  });

  return (
    // here adding design that should be evenly applied to complete page in outer div /*make sure to remove it*/
    <div className='bg-black'> 
      {/* <h1>{pageData.title}</h1> */}
     <div className='dynamic-route-wrapper'> {sections}  </div>
    </div>
  );
};

export default Page;