// src/components/forms/FilterInfoForm.jsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormSection from './FormSection';
import Input from '../ui/Input';
import Select from '../ui/Select';

const FilterInfoForm = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <FormSection title="FILTER INFORMATION">
      <div className="form-grid form-grid-2">
        <Select
          label="Filter Type"
          {...register('filter_info.filter_type')}
          error={errors.filter_info?.filter_type?.message}
        >
          <option value="BAND_PASS">Band Pass Filter</option>
          <option value="NOTCH">Notch Filter</option>
          <option value="OTHER">Other</option>
        </Select>

        <Input
          label="Manufacturer"
          {...register('filter_info.manufacturer')}
          error={errors.filter_info?.manufacturer?.message}
          placeholder="Enter filter manufacturer"
        />

        <Input
          label="Model Number"
          {...register('filter_info.model_number')}
          error={errors.filter_info?.model_number?.message}
          placeholder="Enter model number"
        />

        <Input
          label="Serial Number"
          {...register('filter_info.serial_number')}
          error={errors.filter_info?.serial_number?.message}
          placeholder="Enter serial number"
        />

        <Input
          label="Frequency (MHz / TV Channel)"
          {...register('filter_info.frequency')}
          error={errors.filter_info?.frequency?.message}
          placeholder="e.g., 101.5 MHz or Channel 23"
        />
      </div>
    </FormSection>
  );
};

export default FilterInfoForm;