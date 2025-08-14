
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ children, size = 'md', ...props }) => {
  const sizeClasses = {
    md: 'px-4 py-2 text-sm',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button
      {...props}
      className={`
        bg-indigo-600 text-white font-bold rounded-lg 
        hover:bg-indigo-700 focus:outline-none focus:ring-2 
        focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900
        transition-all duration-300 transform hover:scale-105
        ${sizeClasses[size]}
        ${props.className || ''}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
