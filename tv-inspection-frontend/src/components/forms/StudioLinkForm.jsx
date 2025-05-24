// src/components/forms/StudioLinkForm.jsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormSection from './FormSection';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';

const StudioLinkForm = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <FormSection title="STUDIO TO TRANSMITTER LINK">
      <div className="form-grid form-grid-2">
        <Input
          label="Manufacturer"
          {...register('stl.manufacturer')}
          error={errors.stl?.manufacturer?.message}
          placeholder="Enter STL manufacturer"
        />

        <Input
          label="Model Number"
          {...register('stl.model_number')}
          error={errors.stl?.model_number?.message}
          placeholder="Enter model number"
        />

        <Input
          label="Serial Number"
          {...register('stl.serial_number')}
          error={errors.stl?.serial_number?.message}
          placeholder="Enter serial number"
        />

        <Input
          label="Frequency (MHz)"
          type="number"
          step="0.001"
          {...register('stl.frequency')}
          error={errors.stl?.frequency?.message}
          placeholder="Enter frequency in MHz"
        />

        <Input
          label="Polarization"
          {...register('stl.polarization')}
          error={errors.stl?.polarization?.message}
          placeholder="Enter polarization type"
        />
      </div>

      <div className="mt-4">
        <Textarea
          label="Signal Description"
          {...register('stl.signal_description')}
          error={errors.stl?.signal_description?.message}
          placeholder="Describe the signal characteristics, modulation type, bandwidth, etc..."
          rows={4}
        />
      </div>
    </FormSection>
  );
};

export default StudioLinkForm;