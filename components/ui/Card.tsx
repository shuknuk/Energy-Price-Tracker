
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-lg rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
    icon: React.ReactNode;
    title: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ icon, title }) => {
    return (
        <div className="flex items-center mb-4">
            <div className="mr-3 text-cyan-400">{icon}</div>
            <h2 className="text-xl font-bold text-gray-100">{title}</h2>
        </div>
    );
};
