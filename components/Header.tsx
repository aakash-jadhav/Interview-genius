
import React from 'react';

interface HeaderProps {
  score?: number;
}

const Header: React.FC<HeaderProps> = ({ score }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 glass-panel z-50 px-6 flex items-center justify-between border-b border-white/5">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          InterviewGenius
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        {score !== undefined && (
          <div className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm font-semibold border border-blue-500/30">
            Score: {score}
          </div>
        )}
        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-gray-800">
           <img src="https://picsum.photos/seed/user/100/100" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>
    </header>
  );
};

export default Header;
