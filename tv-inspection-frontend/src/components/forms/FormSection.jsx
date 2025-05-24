// src/components/forms/FormSection.jsx
import React from 'react';
import Card from '../ui/Card';

const FormSection = ({ title, children, className = '' }) => {
  return (
    <Card className={`form-section ${className}`}>
      {title && (
        <div className="form-section-header">
          {title}
        </div>
      )}
      {children}
    </Card>
  );
};

export default FormSection;