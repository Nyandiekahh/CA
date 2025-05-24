import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'md', 
  className = '', 
  text = '',
  color = 'text-ca-blue',
  center = false,
  overlay = false 
}) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16',
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
    '2xl': 'text-xl',
  };

  const SpinnerContent = () => (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <Loader2 className={`animate-spin ${color} ${sizes[size]}`} />
      {text && (
        <p className={`${color} ${textSizes[size]} font-medium`}>
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl">
          <SpinnerContent />
        </div>
      </div>
    );
  }

  if (center) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-32">
        <SpinnerContent />
      </div>
    );
  }

  return <SpinnerContent />;
};

// Preset spinner components for common use cases
export const PageLoadingSpinner = () => (
  <LoadingSpinner 
    size="lg" 
    text="Loading..." 
    center 
    className="min-h-64" 
  />
);

export const ButtonLoadingSpinner = ({ size = 'sm' }) => (
  <LoadingSpinner size={size} color="text-current" />
);

export const OverlayLoadingSpinner = ({ text = "Processing..." }) => (
  <LoadingSpinner 
    size="xl" 
    text={text}
    overlay 
  />
);

export const InlineLoadingSpinner = ({ text = "Loading..." }) => (
  <LoadingSpinner 
    size="sm" 
    text={text}
    className="inline-flex"
  />
);

export default LoadingSpinner;