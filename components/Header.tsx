
import React from 'react';

export const Header: React.FC = () => (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    <svg className="h-8 w-8 text-cyan-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h1 className="text-2xl font-bold text-white">Energy Price Tracker</h1>
                </div>
            </div>
        </div>
    </header>
);
