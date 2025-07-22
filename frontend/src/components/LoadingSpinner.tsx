import type React from 'react';

const LoadingSpinner = ({ className = '' }: { className?: string }): React.ReactElement => (
  <div className={`flex justify-center items-center ${className}`} data-testid="loading-spinner">
    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600"></div>
  </div>
);

export default LoadingSpinner;