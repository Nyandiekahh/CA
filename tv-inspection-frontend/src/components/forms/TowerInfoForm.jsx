// src/components/forms/TowerInfoForm.jsx
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import FormSection from './FormSection';
import Input from '../ui/Input';
import Select from '../ui/Select';

const TowerInfoForm = () => {
  const { register, formState: { errors }, control } = useFormContext();
  
  // Watch for conditional fields
  const towerAboveBuilding = useWatch({
    control,
    name: 'tower_info.tower_above_building',
  });

  const isInsured = useWatch({
    control,
    name: 'tower_info.is_insured',
  });

  const otherAntennas = useWatch({
    control,
    name: 'tower_info.other_antennas',
  });

  const towerType = useWatch({
    control,
    name: 'tower_info.tower_type',
  });

  return (
    <FormSection title="TOWER">
      <div className="form-grid form-grid-2">
        <Input
          label="Name of the Tower Owner"
          {...register('tower_info.tower_owner')}
          error={errors.tower_info?.tower_owner?.message}
          placeholder="Enter tower owner name"
        />

        <Input
          label="Height of the Tower above Ground (m)"
          type="number"
          step="0.01"
          {...register('tower_info.tower_height')}
          error={errors.tower_info?.tower_height?.message}
          placeholder="Enter height in meters"
        />
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-6">
          <label className="text-sm font-medium text-gray-700">
            Is the tower above a Building Roof?
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value={true}
                {...register('tower_info.tower_above_building')}
                className="w-4 h-4 text-ca-blue bg-gray-100 border-gray-300 focus:ring-ca-blue focus:ring-2"
              />
              <span className="ml-2 text-sm text-gray-700">Yes</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value={false}
                {...register('tower_info.tower_above_building')}
                className="w-4 h-4 text-ca-blue bg-gray-100 border-gray-300 focus:ring-ca-blue focus:ring-2"
              />
              <span className="ml-2 text-sm text-gray-700">No</span>
            </label>
          </div>
        </div>

        {towerAboveBuilding && (
          <div className="mt-3">
            <Input
              label="Height of the building above ground (m)"
              type="number"
              step="0.01"
              {...register('tower_info.building_height')}
              error={errors.tower_info?.building_height?.message}
              placeholder="Enter building height in meters"
            />
          </div>
        )}
      </div>

      <div className="form-grid form-grid-2 mt-4">
        <Select
          label="Type of Tower"
          {...register('tower_info.tower_type')}
          error={errors.tower_info?.tower_type?.message}
        >
          <option value="GUYED">Guyed</option>
          <option value="SELF_SUPPORTING">Self-Supporting</option>
          <option value="OTHER">Other</option>
        </Select>

        {towerType === 'OTHER' && (
          <Input
            label="Other Tower Type (specify)"
            {...register('tower_info.tower_type_other')}
            error={errors.tower_info?.tower_type_other?.message}
            placeholder="Specify other tower type"
          />
        )}

        <Select
          label="Rust Protection"
          {...register('tower_info.rust_protection')}
          error={errors.tower_info?.rust_protection?.message}
        >
          <option value="GALVANIZED">Galvanized</option>
          <option value="PAINTED">Painted</option>
          <option value="ALUMINUM">Aluminum</option>
          <option value="NONE">No Rust Protection</option>
        </Select>
      </div>

      <div className="form-grid form-grid-3 mt-4">
        <Input
          label="Year of Tower Installation"
          type="number"
          min="1950"
          max="2030"
          {...register('tower_info.installation_year')}
          error={errors.tower_info?.installation_year?.message}
          placeholder="e.g., 2020"
        />

        <Input
          label="Name of the Tower Manufacturer"
          {...register('tower_info.manufacturer')}
          error={errors.tower_info?.manufacturer?.message}
          placeholder="Enter manufacturer name"
        />

        <Input
          label="Model Number"
          {...register('tower_info.model_number')}
          error={errors.tower_info?.model_number?.message}
          placeholder="Enter model number"
        />
      </div>

      <div className="form-grid form-grid-2 mt-4">
        <Input
          label="Maximum Wind Load (km/h)"
          type="number"
          step="0.01"
          {...register('tower_info.max_wind_load')}
          error={errors.tower_info?.max_wind_load?.message}
          placeholder="Enter max wind load"
        />

        <Input
          label="Maximum Load Charge (kg)"
          type="number"
          step="0.01"
          {...register('tower_info.max_load_charge')}
          error={errors.tower_info?.max_load_charge?.message}
          placeholder="Enter max load charge"
        />
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-6">
          <label className="text-sm font-medium text-gray-700">
            Has Tower got an Insurance Policy?
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value={true}
                {...register('tower_info.is_insured')}
                className="w-4 h-4 text-ca-blue bg-gray-100 border-gray-300 focus:ring-ca-blue focus:ring-2"
              />
              <span className="ml-2 text-sm text-gray-700">Yes</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value={false}
                {...register('tower_info.is_insured')}
                className="w-4 h-4 text-ca-blue bg-gray-100 border-gray-300 focus:ring-ca-blue focus:ring-2"
              />
              <span className="ml-2 text-sm text-gray-700">No</span>
            </label>
          </div>
        </div>

        {isInsured && (
          <div className="mt-3">
            <Input
              label="Name of Insurer"
              {...register('tower_info.insurer_name')}
              error={errors.tower_info?.insurer_name?.message}
              placeholder="Enter insurer name"
            />
          </div>
        )}
      </div>

      {/* Checkboxes Section */}
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('tower_info.concrete_base')}
              className="w-4 h-4 text-ca-blue bg-gray-100 border-gray-300 rounded focus:ring-ca-blue focus:ring-2"
            />
            <span className="ml-2 text-sm text-gray-700">Concrete Base?</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('tower_info.lightning_protection')}
              className="w-4 h-4 text-ca-blue bg-gray-100 border-gray-300 rounded focus:ring-ca-blue focus:ring-2"
            />
            <span className="ml-2 text-sm text-gray-700">Lightning Protection provided?</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('tower_info.electrically_grounded')}
              className="w-4 h-4 text-ca-blue bg-gray-100 border-gray-300 rounded focus:ring-ca-blue focus:ring-2"
            />
            <span className="ml-2 text-sm text-gray-700">Electrically Grounded?</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('tower_info.aviation_warning_light')}
              className="w-4 h-4 text-ca-blue bg-gray-100 border-gray-300 rounded focus:ring-ca-blue focus:ring-2"
            />
            <span className="ml-2 text-sm text-gray-700">Aviation Warning Light?</span>
          </label>
        </div>

        <div className="mt-4">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              {...register('tower_info.other_antennas')}
              className="mt-1 w-4 h-4 text-ca-blue bg-gray-100 border-gray-300 rounded focus:ring-ca-blue focus:ring-2"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">Other Antennas on Tower?</span>
              {otherAntennas && (
                <textarea
                  {...register('tower_info.other_antennas_details')}
                  placeholder="Provide details about other antennas..."
                  rows={3}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ca-blue focus:border-ca-blue transition-colors duration-200 resize-y"
                />
              )}
            </div>
          </label>
        </div>
      </div>
    </FormSection>
  );
};

export default TowerInfoForm;