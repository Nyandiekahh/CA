// src/utils/formUtils.js
export const formatFieldName = (fieldName) => {
  return fieldName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${formatFieldName(fieldName)} is required`;
  }
  return null;
};

export const validateEmail = (email) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (email && !emailRegex.test(email)) {
    return 'Invalid email address';
  }
  return null;
};

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;
  if (phone && !phoneRegex.test(phone)) {
    return 'Invalid phone number format';
  }
  return null;
};

export const validateNumber = (value, fieldName, min, max) => {
  if (value !== null && value !== undefined && value !== '') {
    const num = parseFloat(value);
    if (isNaN(num)) {
      return `${formatFieldName(fieldName)} must be a valid number`;
    }
    if (min !== undefined && num < min) {
      return `${formatFieldName(fieldName)} must be greater than or equal to ${min}`;
    }
    if (max !== undefined && num > max) {
      return `${formatFieldName(fieldName)} must be less than or equal to ${max}`;
    }
  }
  return null;
};

export const validateYear = (year) => {
  const currentYear = new Date().getFullYear();
  const minYear = 1950;
  const maxYear = currentYear + 10;
  
  if (year && (year < minYear || year > maxYear)) {
    return `Year must be between ${minYear} and ${maxYear}`;
  }
  return null;
};

export const formatDate = (date) => {
  if (!date) return '';
  try {
    return new Date(date).toLocaleDateString();
  } catch (error) {
    return '';
  }
};

export const formatDateTime = (dateTime) => {
  if (!dateTime) return '';
  try {
    return new Date(dateTime).toLocaleString();
  } catch (error) {
    return '';
  }
};

export const generateFormSummary = (formData) => {
  const summary = {
    broadcaster: formData.administrative_info?.name_of_broadcaster || 'Unknown',
    stationType: formData.administrative_info?.station_type || 'Unknown',
    location: formData.administrative_info?.location || 'Unknown',
    frequency: formData.transmitter_info?.transmit_frequency || 'Unknown',
    towerHeight: formData.tower_info?.tower_height || 'Unknown',
    erp: formData.antenna_system?.effective_radiated_power || 'Unknown',
  };
  return summary;
};

export const exportFormData = (formData, format = 'json') => {
  if (format === 'json') {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inspection_form_${formData.id || 'new'}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
};