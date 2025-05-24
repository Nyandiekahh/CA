// src/components/forms/AntennaSystemForm.jsx
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import FormSection from './FormSection';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';

const AntennaSystemForm = () => {
  const { register, formState: { errors }, control } = useFormContext();

  const mechanicalTilt = useWatch({ control, name: 'antenna_system.mechanical_tilt' });
  const electricalTilt = useWatch({ control, name: 'antenna_system.electrical_tilt' });
  const nullFill = useWatch({ control, name: 'antenna_system.null_fill' });

  return (
    <FormSection title="ANTENNA SYSTEM">
      <div className="form-grid form-grid-2">
        <Input
          label="Height (m)"
          type="number"
          step="0.01"
          {...register('antenna_system.height')}
          error={errors.antenna_system?.height?.message}
          placeholder="Enter antenna height in meters"
        />

        <Input
          label="Antenna Type"
          {...register('antenna_system.antenna_type')}
          error={errors.antenna_system?.antenna_type?.message}
          placeholder="Enter antenna type"
        />

        <Input
          label="Manufacturer"
          {...register('antenna_system.manufacturer')}
          error={errors.antenna_system?.manufacturer?.message}
          placeholder="Enter manufacturer name"
        />

        <Input
          label="Model Number"
          {...register('antenna_system.model_number')}
          error={errors.antenna_system?.model_number?.message}
          placeholder="Enter model number"
        />
      </div>

      {/* Polarization and Pattern */}
      <div className="form-grid form-grid-2 mt-4">
        <Select
          label="Polarization"
          {...register('antenna_system.polarization')}
          error={errors.antenna_system?.polarization?.message}
        >
          <option value="VERTICAL">Vertical</option>
          <option value="HORIZONTAL">Horizontal</option>
          <option value="CIRCULAR">Circular</option>
          <option value="ELLIPTICAL">Elliptical</option>
        </Select>

        <Select
          label="Horizontal Pattern"
          {...register('antenna_system.horizontal_pattern')}
          error={errors.antenna_system?.horizontal_pattern?.message}
        >
          <option value="OMNI">Omni directional</option>
          <option value="DIRECTIONAL">Directional</option>
        </Select>

        <Input
          label="Beam Width 3dB"
          {...register('antenna_system.beam_width_3db')}
          error={errors.antenna_system?.beam_width_3db?.message}
          placeholder="Enter beam width"
        />

        <Input
          label="Degrees Azimuth"
          {...register('antenna_system.degrees_azimuth')}
          error={errors.antenna_system?.degrees_azimuth?.message}
          placeholder="Enter azimuth in degrees"
        />
      </div>

      {/* Azimuth Horizontal Table */}
      <div className="mt-4">
        <Textarea
          label="Table Azimuth Horizontal"
          {...register('antenna_system.table_azimuth_horizontal')}
          error={errors.antenna_system?.table_azimuth_horizontal?.message}
          placeholder="Enter azimuth horizontal pattern data..."
          rows={3}
        />
      </div>

      {/* Vertical Pattern */}
      <div className="mt-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          Vertical Pattern
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('antenna_system.mechanical_tilt')}
              className="w-4 h-4 text-ca-blue bg-gray-100 border-gray-300 rounded focus:ring-ca-blue focus:ring-2"
            />
            <span className="ml-2 text-sm text-gray-700">Mechanical Tilt</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('antenna_system.electrical_tilt')}
              className="w-4 h-4 text-ca-blue bg-gray-100 border-gray-300 rounded focus:ring-ca-blue focus:ring-2"
            />
            <span className="ml-2 text-sm text-gray-700">Electrical Tilt</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('antenna_system.null_fill')}
              className="w-4 h-4 text-ca-blue bg-gray-100 border-gray-300 rounded focus:ring-ca-blue focus:ring-2"
            />
            <span className="ml-2 text-sm text-gray-700">Null Fill</span>
          </label>
        </div>

        <div className="form-grid form-grid-3">
          {mechanicalTilt && (
            <Input
              label="Mechanical Tilt Degree"
              {...register('antenna_system.mechanical_tilt_degree')}
              error={errors.antenna_system?.mechanical_tilt_degree?.message}
              placeholder="Enter mechanical tilt degree"
            />
          )}

          {electricalTilt && (
            <Input
              label="Electrical Tilt Degree"
              {...register('antenna_system.electrical_tilt_degree')}
              error={errors.antenna_system?.electrical_tilt_degree?.message}
              placeholder="Enter electrical tilt degree"
            />
          )}

          {nullFill && (
            <Input
              label="Null Fill Percentage"
              {...register('antenna_system.null_fill_percentage')}
              error={errors.antenna_system?.null_fill_percentage?.message}
              placeholder="Enter null fill percentage"
            />
          )}
        </div>
      </div>

      {/* Azimuth Vertical Table */}
      <div className="mt-4">
        <Textarea
          label="Table Azimuth Vertical"
          {...register('antenna_system.table_azimuth_vertical')}
          error={errors.antenna_system?.table_azimuth_vertical?.message}
          placeholder="Enter azimuth vertical pattern data..."
          rows={3}
        />
      </div>

      {/* System Performance */}
      <div className="mt-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          System Performance
        </h4>
        
        <div className="form-grid form-grid-2">
          <Input
            label="Antenna System Gain"
            {...register('antenna_system.antenna_system_gain')}
            error={errors.antenna_system?.antenna_system_gain?.message}
            placeholder="Enter system gain"
          />

          <Input
            label="Estimated Antenna Losses (dB)"
            type="number"
            step="0.01"
            {...register('antenna_system.estimated_antenna_losses')}
            error={errors.antenna_system?.estimated_antenna_losses?.message}
            placeholder="Enter antenna losses in dB"
          />

          <Input
            label="Estimated Feeder Losses (dB)"
            type="number"
            step="0.01"
            {...register('antenna_system.estimated_feeder_losses')}
            error={errors.antenna_system?.estimated_feeder_losses?.message}
            placeholder="Enter feeder losses in dB"
          />

          <Input
            label="Estimated Multiplexer Losses (dB)"
            type="number"
            step="0.01"
            {...register('antenna_system.estimated_multiplexer_losses')}
            error={errors.antenna_system?.estimated_multiplexer_losses?.message}
            placeholder="Enter multiplexer losses in dB"
          />

          <Input
            label="Effective Radiated Power (kW)"
            type="number"
            step="0.001"
            {...register('antenna_system.effective_radiated_power')}
            error={errors.antenna_system?.effective_radiated_power?.message}
            placeholder="Enter ERP in kW"
          />
        </div>
      </div>

      {/* Antenna Catalog */}
      <div className="mt-4">
        <Textarea
          label="Antenna Catalog / Additional Notes"
          {...register('antenna_system.antenna_catalog')}
          error={errors.antenna_system?.antenna_catalog?.message}
          placeholder="Enter additional antenna specifications or catalog information..."
          rows={4}
        />
      </div>
    </FormSection>
  );
};

export default AntennaSystemForm;