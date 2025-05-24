import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = 'p-6',
  shadow = 'shadow-xl',
  rounded = 'rounded-lg',
  border = 'border border-gray-100',
  background = 'bg-white',
  ...props 
}) => {
  const baseClasses = `${background} ${rounded} ${border} ${shadow} ${padding}`;
  
  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;