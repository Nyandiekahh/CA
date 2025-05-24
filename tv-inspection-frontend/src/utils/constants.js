
// src/utils/constants.js
export const STATION_TYPES = {
  RADIO_AM: 'Radio AM',
  RADIO_FM: 'Radio FM',
  TV: 'TV',
};

export const TOWER_TYPES = {
  GUYED: 'Guyed',
  SELF_SUPPORTING: 'Self-Supporting',
  OTHER: 'Other',
};

export const RUST_PROTECTION_TYPES = {
  GALVANIZED: 'Galvanized',
  PAINTED: 'Painted',
  ALUMINUM: 'Aluminum',
  NONE: 'No Rust Protection',
};

export const FILTER_TYPES = {
  BAND_PASS: 'Band Pass Filter',
  NOTCH: 'Notch Filter',
  OTHER: 'Other',
};

export const POLARIZATION_TYPES = {
  VERTICAL: 'Vertical',
  HORIZONTAL: 'Horizontal',
  CIRCULAR: 'Circular',
  ELLIPTICAL: 'Elliptical',
};

export const PATTERN_TYPES = {
  OMNI: 'Omni directional',
  DIRECTIONAL: 'Directional',
};

export const API_ENDPOINTS = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api',
  FORMS: '/forms/',
  AUTH: {
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    PROFILE: '/auth/profile/',
    TOKEN: '/auth/token/',
    REFRESH: '/auth/token/refresh/',
  },
};

export const FORM_CONFIG = {
  FORM_ID: process.env.REACT_APP_FORM_ID || 'CA/F/FSM/17',
  VERSION: process.env.REACT_APP_VERSION || 'B',
  APP_NAME: process.env.REACT_APP_NAME || 'TV Inspection System',
};