// src/components/forms/InspectionForm.jsx
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Send, FileText, ArrowLeft, Download, FileSpreadsheet } from 'lucide-react';
import { formAPI, handleApiError, downloadFile } from '../../services/api';
import Layout from '../layout/Layout';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import AdministrativeInfoForm from './AdministrativeInfoForm';
import TowerInfoForm from './TowerInfoForm';
import TransmitterInfoForm from './TransmitterInfoForm';
import FilterInfoForm from './FilterInfoForm';
import AntennaSystemForm from './AntennaSystemForm';
import StudioLinkForm from './StudioLinkForm';
import OtherInfoForm from './OtherInfoForm';

// Form validation schema
const getFormValidation = () => ({
  administrative_info: {
    name_of_broadcaster: { required: "Broadcaster name is required" },
    station_type: { required: "Station type is required" },
    transmitting_site: { required: "Transmitting site is required" },
    longitude: { required: "Longitude is required" },
    latitude: { required: "Latitude is required" }
  },
  tower_info: {
    tower_owner: { required: "Tower owner is required" },
    tower_height: { 
      required: "Tower height is required",
      min: { value: 0, message: "Height must be positive" }
    }
  },
  transmitter_info: {
    exciter_manufacturer: { required: "Exciter manufacturer is required" },
    transmit_frequency: { required: "Transmit frequency is required" }
  },
  antenna_system: {
    height: { 
      required: "Antenna height is required",
      min: { value: 0, message: "Height must be positive" }
    },
    antenna_type: { required: "Antenna type is required" }
  }
});

// Default form structure
const getDefaultFormValues = () => ({
  administrative_info: {
    name_of_broadcaster: '',
    po_box: '',
    postal_code: '',
    town: '',
    location: '',
    street: '',
    phone_number: '',
    station_type: '',
    transmitting_site: '',
    longitude: '',
    latitude: '',
    physical_location: '',
    physical_street: '',
    physical_area: '',
    altitude: '',
    land_owner: '',
    other_telecoms_operator: false,
    other_telecoms_details: ''
  },
  tower_info: {
    tower_owner: '',
    tower_height: '',
    tower_above_building: false,
    building_height: '',
    tower_type: '',
    tower_type_other: '',
    rust_protection: '',
    installation_year: '',
    manufacturer: '',
    model_number: '',
    max_wind_load: '',
    max_load_charge: '',
    is_insured: false,
    insurer_name: '',
    concrete_base: false,
    lightning_protection: false,
    electrically_grounded: false,
    aviation_warning_light: false,
    other_antennas: false,
    other_antennas_details: ''
  },
  transmitter_info: {
    exciter_manufacturer: '',
    exciter_model_number: '',
    exciter_serial_number: '',
    exciter_nominal_power: '',
    exciter_actual_reading: '',
    amplifier_manufacturer: '',
    amplifier_model_number: '',
    amplifier_serial_number: '',
    amplifier_nominal_power: '',
    amplifier_actual_reading: '',
    rf_output_type: '',
    frequency_range: '',
    transmit_frequency: '',
    frequency_stability: '',
    harmonics_suppression_level: '',
    spurious_emission_level: '',
    transmit_bandwidth: '',
    internal_audio_limiter: false,
    internal_stereo_coder: false,
    transmitter_catalog: ''
  },
  filter_info: {
    filter_type: '',
    manufacturer: '',
    model_number: '',
    serial_number: '',
    frequency: ''
  },
  antenna_system: {
    height: '',
    antenna_type: '',
    manufacturer: '',
    model_number: '',
    polarization: '',
    horizontal_pattern: '',
    beam_width_3db: '',
    degrees_azimuth: '',
    table_azimuth_horizontal: '',
    mechanical_tilt: false,
    electrical_tilt: false,
    null_fill: false,
    mechanical_tilt_degree: '',
    electrical_tilt_degree: '',
    null_fill_percentage: '',
    table_azimuth_vertical: '',
    antenna_system_gain: '',
    estimated_antenna_losses: '',
    estimated_feeder_losses: '',
    estimated_multiplexer_losses: '',
    effective_radiated_power: '',
    antenna_catalog: ''
  },
  stl: {
    manufacturer: '',
    model_number: '',
    serial_number: '',
    frequency: '',
    polarization: '',
    signal_description: ''
  },
  other_information: {
    observations: '',
    technical_personnel_name: '',
    contact_name: '',
    contact_address: '',
    contact_tel: '',
    contact_email: '',
    contact_date: '',
    contact_signature: ''
  },
  ca_personnel: []
});

// Data transformation utilities
const transformFormDataForSubmission = (formData) => {
  const transformed = { ...formData };
  
  // Convert string booleans to actual booleans
  const convertBooleans = (obj) => {
    for (const key in obj) {
      if (obj[key] === 'true') obj[key] = true;
      else if (obj[key] === 'false') obj[key] = false;
      else if (typeof obj[key] === 'object' && obj[key] !== null) {
        convertBooleans(obj[key]);
      }
    }
  };
  
  convertBooleans(transformed);
  
  // Convert numeric strings to numbers where appropriate
  const numericFields = [
    'altitude', 'tower_height', 'building_height', 'installation_year',
    'max_wind_load', 'max_load_charge', 'height', 'exciter_nominal_power',
    'exciter_actual_reading', 'amplifier_nominal_power', 'amplifier_actual_reading',
    'harmonics_suppression_level', 'spurious_emission_level', 'estimated_antenna_losses',
    'estimated_feeder_losses', 'estimated_multiplexer_losses', 'effective_radiated_power',
    'frequency'
  ];
  
  const convertNumbers = (obj, prefix = '') => {
    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (numericFields.includes(key) && obj[key] !== '' && !isNaN(obj[key])) {
        obj[key] = parseFloat(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        convertNumbers(obj[key], fullKey);
      }
    }
  };
  
  convertNumbers(transformed);
  
  // Remove empty strings and replace with null
  const cleanEmptyValues = (obj) => {
    for (const key in obj) {
      if (obj[key] === '') {
        obj[key] = null;
      } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        cleanEmptyValues(obj[key]);
      }
    }
  };
  
  cleanEmptyValues(transformed);
  
  return transformed;
};

const InspectionForm = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);

  const methods = useForm({
    defaultValues: getDefaultFormValues(),
    mode: 'onChange', // Validate on change for better UX
    resolver: async (data) => {
      const errors = {};
      const validation = getFormValidation();
      
      // Basic validation logic
      for (const section in validation) {
        for (const field in validation[section]) {
          const rules = validation[section][field];
          const value = data[section]?.[field];
          
          if (rules.required && (!value || value === '')) {
            if (!errors[section]) errors[section] = {};
            errors[section][field] = { message: rules.required };
          }
          
          if (rules.min && value !== '' && parseFloat(value) < rules.min.value) {
            if (!errors[section]) errors[section] = {};
            errors[section][field] = { message: rules.min.message };
          }
        }
      }
      
      return {
        values: Object.keys(errors).length === 0 ? data : {},
        errors: errors
      };
    }
  });

  const { handleSubmit, reset, formState: { isDirty, isValid, errors: formErrors } } = methods;

  // Load existing form data for edit mode
  useEffect(() => {
    if (mode === 'edit' && id) {
      loadFormData();
    }
  }, [mode, id]);

  const loadFormData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📋 Loading form data for ID:', id);
      const formData = await formAPI.getForm(id);
      console.log('📥 Loaded form data:', formData);
      
      // Merge with default values to ensure all fields exist
      const mergedData = {
        ...getDefaultFormValues(),
        ...formData,
        // Ensure nested objects are properly merged
        administrative_info: { ...getDefaultFormValues().administrative_info, ...formData.administrative_info },
        tower_info: { ...getDefaultFormValues().tower_info, ...formData.tower_info },
        transmitter_info: { ...getDefaultFormValues().transmitter_info, ...formData.transmitter_info },
        filter_info: { ...getDefaultFormValues().filter_info, ...formData.filter_info },
        antenna_system: { ...getDefaultFormValues().antenna_system, ...formData.antenna_system },
        stl: { ...getDefaultFormValues().stl, ...formData.stl },
        other_information: { ...getDefaultFormValues().other_information, ...formData.other_information },
        ca_personnel: formData.ca_personnel || []
      };
      
      reset(mergedData);
      console.log('✅ Form reset with merged data');
      
    } catch (err) {
      console.error('❌ Error loading form data:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setError(null);
      setSubmitAttempts(prev => prev + 1);
      
      console.log('🚀 Starting form submission...');
      console.log('📤 Raw form data:', data);
      
      // Transform data for backend
      const transformedData = transformFormDataForSubmission(data);
      console.log('🔄 Transformed data:', transformedData);
      
      // Add metadata
      const submissionData = {
        ...transformedData,
        form_version: process.env.REACT_APP_VERSION || '1.0',
        form_id: process.env.REACT_APP_FORM_ID || 'CA-INSPECT',
        submission_timestamp: new Date().toISOString(),
        submission_attempt: submitAttempts
      };
      
      console.log('📋 Final submission data:', submissionData);
      
      let result;
      if (mode === 'edit') {
        console.log('📝 Updating form with ID:', id);
        result = await formAPI.updateForm(id, submissionData);
      } else {
        console.log('➕ Creating new form');
        result = await formAPI.createForm(submissionData);
      }
      
      console.log('✅ Form submission successful:', result);
      
      const successMessage = mode === 'edit' 
        ? 'Form updated successfully!' 
        : 'Form created successfully!';
      setSuccess(successMessage);
      
      // Reset dirty state
      reset(data);
      
      // Redirect after success
      setTimeout(() => {
        if (mode === 'create' && result?.id) {
          navigate(`/inspection/${result.id}`);
        } else if (mode === 'edit') {
          navigate(`/inspection/${id}`);
        } else {
          navigate('/dashboard');
        }
      }, 2000);
      
    } catch (err) {
      console.error('❌ Form submission error:', err);
      
      // Detailed error logging
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
        console.error('Response headers:', err.response.headers);
      }
      
      const errorMessage = handleApiError(err);
      setError(`Submission failed: ${errorMessage}`);
      
      // Show validation errors if available
      if (err.response?.data?.validation_errors) {
        console.error('Validation errors:', err.response.data.validation_errors);
      }
      
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!id) return;
    
    try {
      setDownloadingPdf(true);
      const response = await formAPI.downloadPdf(id);
      const filename = `Inspection_Form_${id}_${new Date().toISOString().split('T')[0]}.pdf`;
      downloadFile(response, filename);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadExcel = async () => {
    if (!id) return;
    
    try {
      setDownloadingExcel(true);
      const response = await formAPI.downloadExcel(id);
      const filename = `Inspection_Form_${id}_${new Date().toISOString().split('T')[0]}.xlsx`;
      downloadFile(response, filename);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setDownloadingExcel(false);
    }
  };

  const handleGoBack = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
      return;
    }
    navigate('/dashboard');
  };

  // Auto-save functionality (optional)
  const handleAutoSave = async () => {
    if (mode === 'edit' && isDirty && isValid) {
      try {
        const data = methods.getValues();
        const transformedData = transformFormDataForSubmission(data);
        await formAPI.updateForm(id, { ...transformedData, auto_save: true });
        console.log('💾 Auto-saved form data');
      } catch (err) {
        console.warn('⚠️ Auto-save failed:', err);
      }
    }
  };

  // Auto-save every 2 minutes
  useEffect(() => {
    const interval = setInterval(handleAutoSave, 120000);
    return () => clearInterval(interval);
  }, [isDirty, isValid, mode, id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600">Loading form data...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-ca-blue" />
                {mode === 'edit' ? `Edit Inspection Form` : 'New Inspection Form'}
              </h1>
              <div className="flex items-center space-x-4 mt-1">
                <p className="text-gray-600">
                  {process.env.REACT_APP_FORM_ID} - Version {process.env.REACT_APP_VERSION}
                </p>
                {mode === 'edit' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Form ID: {id}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {mode === 'edit' && (
              <>
                <Button
                  variant="outline"
                  onClick={handleDownloadPdf}
                  loading={downloadingPdf}
                  disabled={downloadingPdf}
                >
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleDownloadExcel}
                  loading={downloadingExcel}
                  disabled={downloadingExcel}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Excel
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Validation Summary */}
        {Object.keys(formErrors).length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-amber-800 mb-2">
              Please fix the following errors:
            </h3>
            <ul className="text-sm text-amber-700 list-disc list-inside space-y-1">
              {Object.entries(formErrors).map(([section, sectionErrors]) =>
                Object.entries(sectionErrors).map(([field, error]) => (
                  <li key={`${section}.${field}`}>
                    {section.replace('_', ' ')} - {field.replace('_', ' ')}: {error.message}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

        {/* Form */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <AdministrativeInfoForm />
            <TowerInfoForm />
            <TransmitterInfoForm />
            <FilterInfoForm />
            <AntennaSystemForm />
            <StudioLinkForm />
            <OtherInfoForm />

            {/* Form Actions */}
            <div className="bg-white rounded-lg shadow-soft border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="text-sm text-gray-600">
                  {isDirty ? (
                    <span className="text-amber-600 font-medium">● Unsaved changes</span>
                  ) : (
                    <span className="text-green-600">All changes saved</span>
                  )}
                  {submitAttempts > 0 && (
                    <span className="ml-2 text-gray-500">
                      (Attempt #{submitAttempts})
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoBack}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    loading={saving}
                    disabled={saving || !isValid}
                    className="min-w-32"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : (mode === 'edit' ? 'Update Form' : 'Save Form')}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </Layout>
  );
};

export default InspectionForm;