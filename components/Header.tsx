
import React from 'react';
import type { AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const TabButton = ({ view, label }: { view: AppView; label: string }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => setView(view)}
        className={`px-4 py-2 text-sm md:text-base font-semibold rounded-md transition-colors duration-300 ${
          isActive
            ? 'bg-indigo-600 text-white'
            : 'text-gray-300 hover:bg-gray-700'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 01-1-1V6z" clipRule="evenodd" />
          </svg>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Flag Explorer
          </h1>
        </div>
        <nav className="flex space-x-2 bg-gray-900 p-1 rounded-lg">
          <TabButton view="learn" label="Learn" />
          <TabButton view="quiz" label="Quiz" />
        </nav>
      </div>
    </header>
  );
};

export default Header;
