// src/utils/formValidation.js

// Comprehensive validation schema for the inspection form
export const validationSchema = {
  administrative_info: {
    name_of_broadcaster: {
      required: { value: true, message: "Broadcaster name is required" },
      minLength: { value: 2, message: "Broadcaster name must be at least 2 characters" },
      maxLength: { value: 100, message: "Broadcaster name must not exceed 100 characters" }
    },
    po_box: {
      pattern: { 
        value: /^[0-9]*$/, 
        message: "P.O. Box must contain only numbers" 
      }
    },
    postal_code: {
      pattern: { 
        value: /^[0-9]{5}$/, 
        message: "Postal code must be exactly 5 digits" 
      }
    },
    phone_number: {
      pattern: { 
        value: /^(\+254|0)[0-9]{9}$/, 
        message: "Phone number must be in format +254XXXXXXXXX or 0XXXXXXXXX" 
      }
    },
    station_type: {
      required: { value: true, message: "Station type is required" }
    },
    transmitting_site: {
      required: { value: true, message: "Transmitting site name is required" },
      minLength: { value: 2, message: "Transmitting site name must be at least 2 characters" }
    },
    longitude: {
      required: { value: true, message: "Longitude is required" },
      pattern: { 
        value: /^[0-9]{1,3}\s[0-9]{1,2}\s[0-9]{1,2}\s[EW]$/, 
        message: "Longitude format: dd mm ss E/W (e.g., 36 49 12 E)" 
      }
    },
    latitude: {
      required: { value: true, message: "Latitude is required" },
      pattern: { 
        value: /^[0-9]{1,2}\s[0-9]{1,2}\s[0-9]{1,2}\s[NS]$/, 
        message: "Latitude format: dd mm ss N/S (e.g., 01 17 30 S)" 
      }
    },
    altitude: {
      min: { value: -500, message: "Altitude must be above -500m" },
      max: { value: 10000, message: "Altitude must be below 10,000m" }
    }
  },
  
  tower_info: {
    tower_owner: {
      required: { value: true, message: "Tower owner name is required" },
      minLength: { value: 2, message: "Tower owner name must be at least 2 characters" }
    },
    tower_height: {
      required: { value: true, message: "Tower height is required" },
      min: { value: 1, message: "Tower height must be greater than 0" },
      max: { value: 1000, message: "Tower height must be less than 1000m" }
    },
    building_height: {
      min: { value: 0, message: "Building height cannot be negative" },
      max: { value: 500, message: "Building height must be less than 500m" }
    },
    installation_year: {
      min: { value: 1950, message: "Installation year must be after 1950" },
      max: { value: new Date().getFullYear() + 1, message: "Installation year cannot be in the future" }
    },
    max_wind_load: {
      min: { value: 0, message: "Wind load cannot be negative" }
    },
    max_load_charge: {
      min: { value: 0, message: "Load charge cannot be negative" }
    }
  },
  
  transmitter_info: {
    exciter_manufacturer: {
      required: { value: true, message: "Exciter manufacturer is required" }
    },
    exciter_nominal_power: {
      min: { value: 0, message: "Power cannot be negative" },
      max: { value: 100000, message: "Power seems too high, please verify" }
    },
    exciter_actual_reading: {
      min: { value: 0, message: "Reading cannot be negative" }
    },
    amplifier_nominal_power: {
      min: { value: 0, message: "Power cannot be negative" },
      max: { value: 1000000, message: "Power seems too high, please verify" }
    },
    amplifier_actual_reading: {
      min: { value: 0, message: "Reading cannot be negative" }
    },
    transmit_frequency: {
      required: { value: true, message: "Transmit frequency is required" }
    },
    frequency_stability: {
      pattern: { 
        value: /^[±]?[0-9]+(\.[0-9]+)?\s?(ppm|PPM)$/, 
        message: "Format: ±10 ppm or ±10.5 ppm" 
      }
    },
    harmonics_suppression_level: {
      min: { value: 0, message: "Suppression level cannot be negative" },
      max: { value: 200, message: "Suppression level seems too high" }
    },
    spurious_emission_level: {
      min: { value: 0, message: "Emission level cannot be negative" },
      max: { value: 200, message: "Emission level seems too high" }
    }
  },
  
  antenna_system: {
    height: {
      required: { value: true, message: "Antenna height is required" },
      min: { value: 0.1, message: "Antenna height must be greater than 0" },
      max: { value: 1000, message: "Antenna height must be less than 1000m" }
    },
    antenna_type: {
      required: { value: true, message: "Antenna type is required" }
    },
    beam_width_3db: {
      min: { value: 0, message: "Beam width cannot be negative" },
      max: { value: 360, message: "Beam width cannot exceed 360 degrees" }
    },
    degrees_azimuth: {
      min: { value: 0, message: "Azimuth cannot be negative" },
      max: { value: 360, message: "Azimuth cannot exceed 360 degrees" }
    },
    mechanical_tilt_degree: {
      min: { value: -90, message: "Mechanical tilt cannot be less than -90°" },
      max: { value: 90, message: "Mechanical tilt cannot exceed 90°" }
    },
    electrical_tilt_degree: {
      min: { value: -90, message: "Electrical tilt cannot be less than -90°" },
      max: { value: 90, message: "Electrical tilt cannot exceed 90°" }
    },
    null_fill_percentage: {
      min: { value: 0, message: "Null fill percentage cannot be negative" },
      max: { value: 100, message: "Null fill percentage cannot exceed 100%" }
    },
    estimated_antenna_losses: {
      min: { value: 0, message: "Antenna losses cannot be negative" },
      max: { value: 50, message: "Antenna losses seem too high" }
    },
    estimated_feeder_losses: {
      min: { value: 0, message: "Feeder losses cannot be negative" },
      max: { value: 50, message: "Feeder losses seem too high" }
    },
    estimated_multiplexer_losses: {
      min: { value: 0, message: "Multiplexer losses cannot be negative" },
      max: { value: 50, message: "Multiplexer losses seem too high" }
    },
    effective_radiated_power: {
      min: { value: 0, message: "ERP cannot be negative" },
      max: { value: 1000, message: "ERP seems too high, please verify" }
    }
  },
  
  stl: {
    frequency: {
      min: { value: 0.1, message: "Frequency must be greater than 0.1 MHz" },
      max: { value: 30000, message: "Frequency must be less than 30,000 MHz" }
    }
  },
  
  other_information: {
    contact_email: {
      pattern: { 
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
        message: "Please enter a valid email address" 
      }
    },
    contact_tel: {
      pattern: { 
        value: /^(\+254|0)[0-9]{9}$/, 
        message: "Phone number must be in format +254XXXXXXXXX or 0XXXXXXXXX" 
      }
    },
    contact_date: {
      validate: {
        notFuture: (value) => {
          if (!value) return true;
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return selectedDate <= today || "Contact date cannot be in the future";
        }
      }
    }
  },
  
  ca_personnel: {
    name: {
      required: { value: true, message: "Personnel name is required" },
      minLength: { value: 2, message: "Name must be at least 2 characters" }
    },
    date: {
      required: { value: true, message: "Date is required" },
      validate: {
        notFuture: (value) => {
          if (!value) return true;
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return selectedDate <= today || "Date cannot be in the future";
        }
      }
    }
  }
};

// Validation utility functions
export const validateField = (value, rules, fieldName) => {
  if (!rules) return null;
  
  // Required validation
  if (rules.required && rules.required.value) {
    if (!value || value === '' || (Array.isArray(value) && value.length === 0)) {
      return rules.required.message || `${fieldName} is required`;
    }
  }
  
  // Skip other validations if value is empty and not required
  if (!value || value === '') return null;
  
  // String length validations
  if (rules.minLength && typeof value === 'string' && value.length < rules.minLength.value) {
    return rules.minLength.message;
  }
  
  if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength.value) {
    return rules.maxLength.message;
  }
  
  // Numeric validations
  const numericValue = parseFloat(value);
  if (!isNaN(numericValue)) {
    if (rules.min && numericValue < rules.min.value) {
      return rules.min.message;
    }
    
    if (rules.max && numericValue > rules.max.value) {
      return rules.max.message;
    }
  }
  
  // Pattern validation
  if (rules.pattern && typeof value === 'string') {
    if (!rules.pattern.value.test(value)) {
      return rules.pattern.message;
    }
  }
  
  // Custom validation
  if (rules.validate) {
    for (const [key, validator] of Object.entries(rules.validate)) {
      const result = validator(value);
      if (result !== true) {
        return result;
      }
    }
  }
  
  return null;
};

// Validate entire form
export const validateForm = (formData) => {
  const errors = {};
  
  const validateSection = (sectionData, sectionRules, sectionName) => {
    const sectionErrors = {};
    
    for (const [fieldName, fieldRules] of Object.entries(sectionRules)) {
      const fieldValue = sectionData?.[fieldName];
      const error = validateField(fieldValue, fieldRules, fieldName);
      
      if (error) {
        sectionErrors[fieldName] = { message: error };
      }
    }
    
    if (Object.keys(sectionErrors).length > 0) {
      errors[sectionName] = sectionErrors;
    }
  };
  
  // Validate each section
  for (const [sectionName, sectionRules] of Object.entries(validationSchema)) {
    if (sectionName === 'ca_personnel') {
      // Special handling for array of personnel
      const personnelArray = formData.ca_personnel || [];
      const personnelErrors = [];
      
      personnelArray.forEach((personnel, index) => {
        const personErrors = {};
        
        for (const [fieldName, fieldRules] of Object.entries(sectionRules)) {
          const fieldValue = personnel[fieldName];
          const error = validateField(fieldValue, fieldRules, fieldName);
          
          if (error) {
            personErrors[fieldName] = { message: error };
          }
        }
        
        if (Object.keys(personErrors).length > 0) {
          personnelErrors[index] = personErrors;
        }
      });
      
      if (personnelErrors.length > 0) {
        errors.ca_personnel = personnelErrors;
      }
    } else {
      validateSection(formData[sectionName], sectionRules, sectionName);
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors: errors
  };
};

// Get validation rules for react-hook-form
export const getReactHookFormRules = (sectionName, fieldName) => {
  const fieldRules = validationSchema[sectionName]?.[fieldName];
  if (!fieldRules) return {};
  
  const rules = {};
  
  if (fieldRules.required) {
    rules.required = fieldRules.required.message;
  }
  
  if (fieldRules.minLength) {
    rules.minLength = {
      value: fieldRules.minLength.value,
      message: fieldRules.minLength.message
    };
  }
  
  if (fieldRules.maxLength) {
    rules.maxLength = {
      value: fieldRules.maxLength.value,
      message: fieldRules.maxLength.message
    };
  }
  
  if (fieldRules.min) {
    rules.min = {
      value: fieldRules.min.value,
      message: fieldRules.min.message
    };
  }
  
  if (fieldRules.max) {
    rules.max = {
      value: fieldRules.max.value,
      message: fieldRules.max.message
    };
  }
  
  if (fieldRules.pattern) {
    rules.pattern = {
      value: fieldRules.pattern.value,
      message: fieldRules.pattern.message
    };
  }
  
  if (fieldRules.validate) {
    rules.validate = fieldRules.validate;
  }
  
  return rules;
};

// Helper to format validation errors for display
export const formatValidationErrors = (errors) => {
  const formatted = [];
  
  const processSection = (sectionErrors, sectionName) => {
    for (const [fieldName, error] of Object.entries(sectionErrors)) {
      const sectionLabel = sectionName.replace('_', ' ').toUpperCase();
      const fieldLabel = fieldName.replace('_', ' ').toLowerCase();
      formatted.push(`${sectionLabel} - ${fieldLabel}: ${error.message}`);
    }
  };
  
  for (const [sectionName, sectionErrors] of Object.entries(errors)) {
    if (sectionName === 'ca_personnel' && Array.isArray(sectionErrors)) {
      sectionErrors.forEach((personErrors, index) => {
        for (const [fieldName, error] of Object.entries(personErrors)) {
          const fieldLabel = fieldName.replace('_', ' ').toLowerCase();
          formatted.push(`CA Personnel #${index + 1} - ${fieldLabel}: ${error.message}`);
        }
      });
    } else {
      processSection(sectionErrors, sectionName);
    }
  }
  
  return formatted;
};

// Data transformation utilities
export const transformDataTypes = (formData) => {
  const transformed = JSON.parse(JSON.stringify(formData)); // Deep clone
  
  // Convert string numbers to actual numbers
  const numericFields = [
    'altitude', 'tower_height', 'building_height', 'installation_year',
    'max_wind_load', 'max_load_charge', 'height', 'exciter_nominal_power',
    'exciter_actual_reading', 'amplifier_nominal_power', 'amplifier_actual_reading',
    'harmonics_suppression_level', 'spurious_emission_level', 'estimated_antenna_losses',
    'estimated_feeder_losses', 'estimated_multiplexer_losses', 'effective_radiated_power',
    'frequency', 'beam_width_3db', 'degrees_azimuth', 'mechanical_tilt_degree',
    'electrical_tilt_degree', 'null_fill_percentage'
  ];
  
  const convertNumbers = (obj, path = '') => {
    for (const key in obj) {
      if (obj[key] === null || obj[key] === undefined) continue;
      
      const currentPath = path ? `${path}.${key}` : key;
      
      if (numericFields.includes(key) && obj[key] !== '') {
        const numValue = parseFloat(obj[key]);
        if (!isNaN(numValue)) {
          obj[key] = numValue;
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        convertNumbers(obj[key], currentPath);
      } else if (Array.isArray(obj[key])) {
        obj[key].forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            convertNumbers(item, `${currentPath}[${index}]`);
          }
        });
      }
    }
  };
  
  convertNumbers(transformed);
  
  // Convert string booleans to actual booleans
  const booleanFields = [
    'tower_above_building', 'is_insured', 'concrete_base', 'lightning_protection',
    'electrically_grounded', 'aviation_warning_light', 'other_antennas',
    'other_telecoms_operator', 'mechanical_tilt', 'electrical_tilt', 'null_fill',
    'internal_audio_limiter', 'internal_stereo_coder'
  ];
  
  const convertBooleans = (obj) => {
    for (const key in obj) {
      if (obj[key] === null || obj[key] === undefined) continue;
      
      if (booleanFields.includes(key)) {
        if (obj[key] === 'true' || obj[key] === true) {
          obj[key] = true;
        } else if (obj[key] === 'false' || obj[key] === false) {
          obj[key] = false;
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        convertBooleans(obj[key]);
      } else if (Array.isArray(obj[key])) {
        obj[key].forEach(item => {
          if (typeof item === 'object' && item !== null) {
            convertBooleans(item);
          }
        });
      }
    }
  };
  
  convertBooleans(transformed);
  
  // Clean empty strings and convert to null
  const cleanEmptyValues = (obj) => {
    for (const key in obj) {
      if (obj[key] === '') {
        obj[key] = null;
      } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        cleanEmptyValues(obj[key]);
      } else if (Array.isArray(obj[key])) {
        // Filter out empty objects/strings from arrays
        obj[key] = obj[key].filter(item => {
          if (typeof item === 'string') return item !== '';
          if (typeof item === 'object' && item !== null) {
            cleanEmptyValues(item);
            return Object.values(item).some(val => val !== null && val !== '');
          }
          return true;
        });
      }
    }
  };
  
  cleanEmptyValues(transformed);
  
  return transformed;
};

// Sanitize input data
export const sanitizeFormData = (formData) => {
  const sanitized = JSON.parse(JSON.stringify(formData)); // Deep clone
  
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    
    // Remove potentially dangerous characters
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  };
  
  const sanitizeObject = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = sanitizeString(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        sanitizeObject(obj[key]);
      } else if (Array.isArray(obj[key])) {
        obj[key].forEach(item => {
          if (typeof item === 'object' && item !== null) {
            sanitizeObject(item);
          }
        });
      }
    }
  };
  
  sanitizeObject(sanitized);
  return sanitized;
};

// Validate file uploads (if any)
export const validateFileUpload = (file, maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']) => {
  const errors = [];
  
  if (!file) {
    return { isValid: true, errors: [] };
  }
  
  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${maxSize / 1024 / 1024}MB`);
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
  }
  
  // Check file name
  if (file.name.length > 100) {
    errors.push('File name must be less than 100 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

// Form completion checker
export const calculateFormCompletion = (formData) => {
  const requiredFields = [
    'administrative_info.name_of_broadcaster',
    'administrative_info.station_type',
    'administrative_info.transmitting_site',
    'administrative_info.longitude',
    'administrative_info.latitude',
    'tower_info.tower_owner',
    'tower_info.tower_height',
    'transmitter_info.exciter_manufacturer',
    'transmitter_info.transmit_frequency',
    'antenna_system.height',
    'antenna_system.antenna_type'
  ];
  
  const optionalFields = [
    'administrative_info.po_box',
    'administrative_info.postal_code',
    'administrative_info.town',
    'administrative_info.phone_number',
    'tower_info.tower_type',
    'tower_info.manufacturer',
    'transmitter_info.exciter_model_number',
    'transmitter_info.amplifier_manufacturer',
    'antenna_system.manufacturer',
    'antenna_system.polarization',
    'stl.manufacturer',
    'other_information.observations',
    'other_information.contact_name'
  ];
  
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };
  
  const filledRequired = requiredFields.filter(field => {
    const value = getNestedValue(formData, field);
    return value !== null && value !== undefined && value !== '';
  });
  
  const filledOptional = optionalFields.filter(field => {
    const value = getNestedValue(formData, field);
    return value !== null && value !== undefined && value !== '';
  });
  
  const totalFields = requiredFields.length + optionalFields.length;
  const filledFields = filledRequired.length + filledOptional.length;
  
  const completionPercentage = Math.round((filledFields / totalFields) * 100);
  
  return {
    completionPercentage,
    requiredFieldsCompleted: filledRequired.length,
    totalRequiredFields: requiredFields.length,
    optionalFieldsCompleted: filledOptional.length,
    totalOptionalFields: optionalFields.length,
    isMinimumComplete: filledRequired.length === requiredFields.length,
    missingRequiredFields: requiredFields.filter(field => {
      const value = getNestedValue(formData, field);
      return value === null || value === undefined || value === '';
    })
  };
};

// Export validation hooks for React components
export const useFormValidation = (formData) => {
  const [validationErrors, setValidationErrors] = React.useState({});
  const [isValid, setIsValid] = React.useState(false);
  
  React.useEffect(() => {
    const validation = validateForm(formData);
    setValidationErrors(validation.errors);
    setIsValid(validation.isValid);
  }, [formData]);
  
  return {
    validationErrors,
    isValid,
    validateField: (sectionName, fieldName, value) => {
      const fieldRules = validationSchema[sectionName]?.[fieldName];
      return validateField(value, fieldRules, fieldName);
    }
  };
};

// Default export
export default {
  validationSchema,
  validateField,
  validateForm,
  getReactHookFormRules,
  formatValidationErrors,
  transformDataTypes,
  sanitizeFormData,
  validateFileUpload,
  calculateFormCompletion,
  useFormValidation
};