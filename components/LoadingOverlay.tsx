
import React from 'react';

interface LoadingOverlayProps {
  message: string;
  description?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message, description }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#121212]/90 backdrop-blur-md px-4 text-center animate-in fade-in duration-300">
      <div className="relative mb-8">
        <div className="w-20 h-20 border-4 border-blue-600/20 rounded-full"></div>
        <div className="w-20 h-20 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        <div className="absolute inset-0 flex items-center justify-center">
           <svg className="w-8 h-8 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-3 tracking-tight text-white">{message}</h3>
      {description && (
        <p className="text-gray-500 max-w-xs mx-auto animate-in slide-in-from-bottom-2 duration-500">
          {description}
        </p>
      )}
    </div>
  );
};

export default LoadingOverlay;
