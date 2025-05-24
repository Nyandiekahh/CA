// src/components/forms/TransmitterInfoForm.jsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormSection from './FormSection';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';

const TransmitterInfoForm = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <FormSection title="TRANSMITTER INFORMATION">
      {/* Exciter Section */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          Exciter
        </h4>
        
        <div className="form-grid form-grid-2">
          <Input
            label="Manufacturer"
            {...register('transmitter_info.exciter_manufacturer')}
            error={errors.transmitter_info?.exciter_manufacturer?.message}
            placeholder="Enter exciter manufacturer"
          />

          <Input
            label="Model Number"
            {...register('transmitter_info.exciter_model_number')}
            error={errors.transmitter_info?.exciter_model_number?.message}
            placeholder="Enter model number"
          />

          <Input
            label="Serial Number"
            {...register('transmitter_info.exciter_serial_number')}
            error={errors.transmitter_info?.exciter_serial_number?.message}
            placeholder="Enter serial number"
          />

          <Input
            label="Nominal Power (W)"
            type="number"
            step="0.01"
            {...register('transmitter_info.exciter_nominal_power')}
            error={errors.transmitter_info?.exciter_nominal_power?.message}
            placeholder="Enter nominal power in watts"
          />

          <Input
            label="Actual Reading"
            type="number"
            step="0.01"
            {...register('transmitter_info.exciter_actual_reading')}
            error={errors.transmitter_info?.exciter_actual_reading?.message}
            placeholder="Enter actual reading"
          />
        </div>
      </div>

      {/* Amplifier Section */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          Amplifier
        </h4>
        
        <div className="form-grid form-grid-2">
          <Input
            label="Manufacturer"
            {...register('transmitter_info.amplifier_manufacturer')}
            error={errors.transmitter_info?.amplifier_manufacturer?.message}
            placeholder="Enter amplifier manufacturer"
          />

          <Input
            label="Model Number"
            {...register('transmitter_info.amplifier_model_number')}
            error={errors.transmitter_info?.amplifier_model_number?.message}
            placeholder="Enter model number"
          />

          <Input
            label="Serial Number"
            {...register('transmitter_info.amplifier_serial_number')}
            error={errors.transmitter_info?.amplifier_serial_number?.message}
            placeholder="Enter serial number"
          />

          <Input
            label="Nominal Power (W)"
            type="number"
            step="0.01"
            {...register('transmitter_info.amplifier_nominal_power')}
            error={errors.transmitter_info?.amplifier_nominal_power?.message}
            placeholder="Enter nominal power in watts"
          />

          <Input
            label="Actual Reading"
            type="number"
            step="0.01"
            {...register('transmitter_info.amplifier_actual_reading')}
            error={errors.transmitter_info?.amplifier_actual_reading?.message}
            placeholder="Enter actual reading"
          />

          <Input
            label="RF Output Type"
            {...register('transmitter_info.rf_output_type')}
            error={errors.transmitter_info?.rf_output_type?.message}
            placeholder="Enter RF output type"
          />
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          Technical Specifications
        </h4>
        
        <div className="form-grid form-grid-2">
          <Input
            label="Frequency Range"
            {...register('transmitter_info.frequency_range')}
            error={errors.transmitter_info?.frequency_range?.message}
            placeholder="e.g., 88-108 MHz"
          />

          <Input
            label="Transmit Frequency (MHz / TV Channel)"
            {...register('transmitter_info.transmit_frequency')}
            error={errors.transmitter_info?.transmit_frequency?.message}
            placeholder="e.g., 101.5 MHz or Channel 23"
          />

          <Input
            label="Frequency Stability (ppm)"
            {...register('transmitter_info.frequency_stability')}
            error={errors.transmitter_info?.frequency_stability?.message}
            placeholder="e.g., ±10 ppm"
          />

          <Input
            label="Harmonics Suppression Level (dB)"
            type="number"
            step="0.01"
            {...register('transmitter_info.harmonics_suppression_level')}
            error={errors.transmitter_info?.harmonics_suppression_level?.message}
            placeholder="Enter suppression level in dB"
          />

          <Input
            label="Spurious Emission Level (dB)"
            type="number"
            step="0.01"
            {...register('transmitter_info.spurious_emission_level')}
            error={errors.transmitter_info?.spurious_emission_level?.message}
            placeholder="Enter emission level in dB"
          />

          <Input
            label="Transmit Bandwidth (-26dB)"
            {...register('transmitter_info.transmit_bandwidth')}
            error={errors.transmitter_info?.transmit_bandwidth?.message}
            placeholder="Enter bandwidth specification"
          />
        </div>
      </div>

      {/* Features */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          Features
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('transmitter_info.internal_audio_limiter')}
              className="w-4 h-4 text-ca-blue bg-gray-100 border-gray-300 rounded focus:ring-ca-blue focus:ring-2"
            />
            <span className="ml-2 text-sm text-gray-700">Internal Audio Limiter</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('transmitter_info.internal_stereo_coder')}
              className="w-4 h-4 text-ca-blue bg-gray-100 border-gray-300 rounded focus:ring-ca-blue focus:ring-2"
            />
            <span className="ml-2 text-sm text-gray-700">Internal Stereo Coder</span>
          </label>
        </div>
      </div>

      {/* Transmitter Catalog */}
      <div>
        <Textarea
          label="Transmitter Catalog / Additional Notes"
          {...register('transmitter_info.transmitter_catalog')}
          error={errors.transmitter_info?.transmitter_catalog?.message}
          placeholder="Enter additional transmitter specifications or catalog information..."
          rows={4}
        />
      </div>
    </FormSection>
  );
};

export default TransmitterInfoForm;