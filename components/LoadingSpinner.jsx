import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="flex flex-col items-center">
        <div className="flex space-x-2">
          <div className="w-5 h-5 bg-yellow-500 rounded-full animate-bounce"></div>
          <div className="w-5 h-5 bg-yellow-500 rounded-full animate-bounce200"></div>
          <div className="w-5 h-5 bg-yellow-500 rounded-full animate-bounce400"></div>
        </div>
        <p className="text-white text-lg mt-4">Loading, please wait...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
