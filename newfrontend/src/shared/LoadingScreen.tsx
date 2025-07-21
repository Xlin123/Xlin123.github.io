import React from 'react';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative">
                {/* Modern spinner with monochrome design */}
                <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white border-r-gray-300 animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-gray-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>

                {/* Sleek loading text with subtle animation */}
                <div className="mt-6 text-center">
                    <div className="flex items-center justify-center space-x-1">
                        <span className="text-white text-sm font-light tracking-wider">Loading</span>
                        <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1 h-1 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1 h-1 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;