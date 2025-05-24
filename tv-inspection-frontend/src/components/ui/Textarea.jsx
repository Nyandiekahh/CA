import React, { forwardRef, useState } from 'react';

const Textarea = forwardRef(({ 
  label, 
  error, 
  helperText, 
  required = false, 
  rows = 3,
  minRows = 2,
  maxRows = 10,
  autoResize = false,
  maxLength,
  showCharCount = false,
  placeholder = '',
  className = '',
  disabled = false,
  ...props 
}, ref) => {
  const [charCount, setCharCount] = useState(props.value?.length || 0);
  
  const baseClasses = 'w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ca-blue focus:border-ca-blue transition-colors duration-200 resize-y';
  const errorClasses = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white';
  
  const handleChange = (e) => {
    const value = e.target.value;
    
    // Handle character count
    if (maxLength || showCharCount) {
      setCharCount(value.length);
    }
    
    // Handle auto-resize
    if (autoResize) {
      const target = e.target;
      target.style.height = 'auto';
      const scrollHeight = target.scrollHeight;
      const maxHeight = (maxRows || 10) * 24; // Approximate line height
      const minHeight = (minRows || 2) * 24;
      
      target.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
    }
    
    // Call original onChange if provided
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <textarea
          ref={ref}
          rows={autoResize ? minRows : rows}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          className={`${baseClasses} ${errorClasses} ${disabledClasses} ${className}`}
          onChange={handleChange}
          {...props}
        />
        
        {/* Character count */}
        {(showCharCount || maxLength) && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white px-1 rounded">
            {charCount}
            {maxLength && `/${maxLength}`}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
      
      {maxLength && charCount > maxLength * 0.9 && !error && (
        <p className={`text-xs ${charCount >= maxLength ? 'text-red-500' : 'text-amber-500'}`}>
          {maxLength - charCount} characters remaining
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;