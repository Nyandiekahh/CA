// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

console.log('🌐 API Base URL:', API_BASE_URL);

// Create axios instance with enhanced configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor with detailed logging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    
    console.log('📡 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      hasData: !!config.data,
      dataSize: config.data ? JSON.stringify(config.data).length : 0,
      headers: config.headers
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header added');
    } else {
      console.log('❌ No token found in localStorage');
    }
    
    // Log request data for debugging (truncated for large payloads)
    if (config.data) {
      const dataStr = JSON.stringify(config.data);
      if (dataStr.length > 1000) {
        console.log('📤 Request data (truncated):', dataStr.substring(0, 1000) + '...');
      } else {
        console.log('📤 Request data:', config.data);
      }
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      dataReceived: !!response.data,
      responseSize: response.data ? JSON.stringify(response.data).length : 0
    });
    
    // Log response data for debugging (truncated for large payloads)
    if (response.data) {
      const dataStr = JSON.stringify(response.data);
      if (dataStr.length > 1000) {
        console.log('📥 Response data (truncated):', dataStr.substring(0, 1000) + '...');
      } else {
        console.log('📥 Response data:', response.data);
      }
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.error('❌ API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      message: error.message,
      responseData: error.response?.data
    });

    // Handle different types of errors
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout');
      return Promise.reject(new Error('Request timeout. Please try again.'));
    }

    if (!error.response) {
      console.error('🌐 Network error - no response received');
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Token refresh logic
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('🔄 Attempting token refresh...');

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          console.log('📡 Refreshing token...');
          
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          }, {
            timeout: 10000 // 10 seconds for token refresh
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          console.log('✅ Token refreshed successfully');
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } else {
          console.log('❌ No refresh token available');
          throw new Error('No refresh token');
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        
        // Clear all auth data and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        // Redirect to login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(new Error('Session expired. Please login again.'));
      }
    }

    return Promise.reject(error);
  }
);

// API endpoints with proper URL construction
export const apiEndpoints = {
  // Authentication
  login: '/auth/login/',
  register: '/auth/register/',
  profile: '/auth/profile/',
  token: '/auth/token/',
  tokenRefresh: '/auth/token/refresh/',
  
  // Forms
  forms: '/forms/',
  submitForm: '/forms/', // POST to same endpoint
  updateForm: (id) => `/forms/${id}/`,
  downloadPdf: (id) => `/forms/${id}/download-pdf/`,
  downloadExcel: (id) => `/forms/${id}/download-excel/`,
};

// Enhanced Auth API with better error handling
export const authAPI = {
  login: async (credentials) => {
    try {
      console.log('🔐 Attempting login for:', credentials.username);
      
      const response = await api.post(apiEndpoints.login, {
        username: credentials.username,
        password: credentials.password
      });
      
      console.log('✅ Login successful');
      return response.data;
    } catch (error) {
      console.error('❌ Login failed:', error.response?.data);
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      console.log('📝 Attempting registration for:', userData.username);
      const response = await api.post(apiEndpoints.register, userData);
      console.log('✅ Registration successful');
      return response.data;
    } catch (error) {
      console.error('❌ Registration failed:', error.response?.data);
      throw error;
    }
  },
  
  getProfile: async () => {
    try {
      const response = await api.get(apiEndpoints.profile);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to get profile:', error.response?.data);
      throw error;
    }
  },
  
  updateProfile: async (userData) => {
    try {
      const response = await api.put(`${apiEndpoints.profile}update/`, userData);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to update profile:', error.response?.data);
      throw error;
    }
  },
};

// Enhanced Form API with comprehensive error handling and data validation
export const formAPI = {
  getAllForms: async (params = {}) => {
    try {
      console.log('📋 Fetching all forms with params:', params);
      
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const url = queryParams.toString() 
        ? `${apiEndpoints.forms}?${queryParams.toString()}`
        : apiEndpoints.forms;
        
      const response = await api.get(url);
      console.log('✅ Forms fetched successfully, count:', response.data?.length || 0);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch forms:', error.response?.data);
      throw error;
    }
  },
  
  getForm: async (id) => {
    try {
      if (!id) {
        throw new Error('Form ID is required');
      }
      
      console.log('📋 Fetching form with ID:', id);
      const response = await api.get(`${apiEndpoints.forms}${id}/`);
      console.log('✅ Form fetched successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch form:', error.response?.data);
      throw error;
    }
  },
  
  createForm: async (formData) => {
    try {
      console.log('➕ Creating new form...');
      
      // Validate required data before sending
      if (!formData) {
        throw new Error('Form data is required');
      }
      
      // Clean and validate the data
      const cleanedData = validateAndCleanFormData(formData);
      console.log('🧹 Data cleaned and validated');
      
      const response = await api.post(apiEndpoints.submitForm, cleanedData);
      console.log('✅ Form created successfully with ID:', response.data?.id);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create form:', error.response?.data);
      
      // Provide more specific error messages
      if (error.response?.status === 400) {
        const validationErrors = error.response.data?.validation_errors || error.response.data?.errors;
        if (validationErrors) {
          console.error('📋 Validation errors:', validationErrors);
          error.validation_errors = validationErrors;
        }
      }
      
      throw error;
    }
  },
  
  updateForm: async (id, formData) => {
    try {
      if (!id) {
        throw new Error('Form ID is required');
      }
      
      if (!formData) {
        throw new Error('Form data is required');
      }
      
      console.log('📝 Updating form with ID:', id);
      
      // Clean and validate the data
      const cleanedData = validateAndCleanFormData(formData);
      console.log('🧹 Data cleaned and validated for update');
      
      const response = await api.put(apiEndpoints.updateForm(id), cleanedData);
      console.log('✅ Form updated successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to update form:', error.response?.data);
      
      // Provide more specific error messages
      if (error.response?.status === 400) {
        const validationErrors = error.response.data?.validation_errors || error.response.data?.errors;
        if (validationErrors) {
          console.error('📋 Validation errors:', validationErrors);
          error.validation_errors = validationErrors;
        }
      }
      
      throw error;
    }
  },
  
  deleteForm: async (id) => {
    try {
      if (!id) {
        throw new Error('Form ID is required');
      }
      
      console.log('🗑️ Deleting form with ID:', id);
      const response = await api.delete(`${apiEndpoints.forms}${id}/`);
      console.log('✅ Form deleted successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to delete form:', error.response?.data);
      throw error;
    }
  },
  
  downloadPdf: async (id) => {
    try {
      if (!id) {
        throw new Error('Form ID is required');
      }
      
      console.log('📄 Downloading PDF for form ID:', id);
      const response = await api.get(apiEndpoints.downloadPdf(id), {
        responseType: 'blob',
        timeout: 60000, // 60 seconds for file downloads
      });
      console.log('✅ PDF downloaded successfully');
      return response;
    } catch (error) {
      console.error('❌ Failed to download PDF:', error.response?.data);
      throw error;
    }
  },
  
  downloadExcel: async (id) => {
    try {
      if (!id) {
        throw new Error('Form ID is required');
      }
      
      console.log('📊 Downloading Excel for form ID:', id);
      const response = await api.get(apiEndpoints.downloadExcel(id), {
        responseType: 'blob',
        timeout: 60000, // 60 seconds for file downloads
      });
      console.log('✅ Excel downloaded successfully');
      return response;
    } catch (error) {
      console.error('❌ Failed to download Excel:', error.response?.data);
      throw error;
    }
  },
};

// Data validation and cleaning utility
const validateAndCleanFormData = (formData) => {
  console.log('🔍 Validating and cleaning form data...');
  
  const cleaned = JSON.parse(JSON.stringify(formData)); // Deep clone
  
  // Remove undefined and empty string values, replace with null
  const cleanObject = (obj) => {
    for (const key in obj) {
      if (obj[key] === undefined || obj[key] === '') {
        obj[key] = null;
      } else if (obj[key] === 'true') {
        obj[key] = true;
      } else if (obj[key] === 'false') {
        obj[key] = false;
      } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        cleanObject(obj[key]);
      } else if (Array.isArray(obj[key])) {
        obj[key] = obj[key].filter(item => item !== undefined && item !== '');
        obj[key].forEach(item => {
          if (typeof item === 'object' && item !== null) {
            cleanObject(item);
          }
        });
      }
    }
  };
  
  cleanObject(cleaned);
  
  // Convert numeric strings to numbers for specific fields
  const numericFields = [
    'altitude', 'tower_height', 'building_height', 'installation_year',
    'max_wind_load', 'max_load_charge', 'height', 'exciter_nominal_power',
    'exciter_actual_reading', 'amplifier_nominal_power', 'amplifier_actual_reading',
    'harmonics_suppression_level', 'spurious_emission_level', 'estimated_antenna_losses',
    'estimated_feeder_losses', 'estimated_multiplexer_losses', 'effective_radiated_power',
    'frequency'
  ];
  
  const convertNumbers = (obj) => {
    for (const key in obj) {
      if (numericFields.includes(key) && obj[key] !== null && !isNaN(obj[key])) {
        obj[key] = parseFloat(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        convertNumbers(obj[key]);
      }
    }
  };
  
  convertNumbers(cleaned);
  
  // Validate required fields
  const requiredFields = [
    'administrative_info.name_of_broadcaster',
    'administrative_info.station_type',
    'tower_info.tower_owner',
    'transmitter_info.exciter_manufacturer'
  ];
  
  const missingFields = [];
  requiredFields.forEach(fieldPath => {
    const pathParts = fieldPath.split('.');
    let current = cleaned;
    
    for (const part of pathParts) {
      if (!current || current[part] === null || current[part] === undefined) {
        missingFields.push(fieldPath);
        break;
      }
      current = current[part];
    }
  });
  
  if (missingFields.length > 0) {
    console.warn('⚠️ Missing required fields:', missingFields);
  }
  
  console.log('✅ Data validation and cleaning completed');
  return cleaned;
};

// Enhanced file download utility
export const downloadFile = (response, filename) => {
  try {
    console.log('💾 Starting file download:', filename);
    
    // Validate response
    if (!response || !response.data) {
      throw new Error('Invalid response data for download');
    }
    
    // Create blob URL
    const blob = new Blob([response.data], {
      type: response.headers['content-type'] || 'application/octet-stream'
    });
    
    const url = window.URL.createObjectURL(blob);
    
    // Create temporary download link
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.style.display = 'none';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
    
    console.log('✅ File download initiated successfully');
    
  } catch (error) {
    console.error('❌ File download failed:', error);
    throw new Error(`Failed to download file: ${error.message}`);
  }
};

// Enhanced error handler with specific error types
export const handleApiError = (error) => {
  console.error('🚨 Handling API error:', error);
  
  // Network errors
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }
    if (error.message === 'Network Error') {
      return 'Network error. Please check your internet connection.';
    }
    return error.message || 'Network error occurred. Please try again.';
  }
  
  const { status, data } = error.response;
  console.log(`❌ HTTP ${status} Error:`, data);
  
  // Handle specific HTTP status codes
  switch (status) {
    case 400:
      // Bad Request - validation errors
      if (data.validation_errors) {
        const errorMessages = [];
        Object.entries(data.validation_errors).forEach(([field, errors]) => {
          if (Array.isArray(errors)) {
            errorMessages.push(`${field}: ${errors.join(', ')}`);
          } else {
            errorMessages.push(`${field}: ${errors}`);
          }
        });
        return `Validation errors: ${errorMessages.join('; ')}`;
      }
      return data.detail || data.error || data.message || 'Invalid data provided. Please check your input.';
      
    case 401:
      return 'Authentication required. Please login again.';
      
    case 403:
      return 'You do not have permission to perform this action.';
      
    case 404:
      return 'The requested resource was not found.';
      
    case 409:
      return data.detail || 'A conflict occurred. The resource may already exist.';
      
    case 422:
      return 'Invalid data format. Please check your input.';
      
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
      
    case 500:
      return 'Server error occurred. Please try again later.';
      
    case 502:
      return 'Service temporarily unavailable. Please try again later.';
      
    case 503:
      return 'Service maintenance in progress. Please try again later.';
      
    default:
      return data.detail || data.error || data.message || `Server error (${status}). Please try again.`;
  }
};

// Health check utility
export const healthCheck = async () => {
  try {
    console.log('🏥 Performing health check...');
    const response = await api.get('/health/', { timeout: 5000 });
    console.log('✅ Health check passed');
    return { healthy: true, data: response.data };
  } catch (error) {
    console.error('❌ Health check failed:', error);
    return { healthy: false, error: handleApiError(error) };
  }
};

// Export the configured axios instance
export default api;