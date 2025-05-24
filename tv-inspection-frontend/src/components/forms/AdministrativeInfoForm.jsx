// src/components/forms/AdministrativeInfoForm.jsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormSection from './FormSection';
import Input from '../ui/Input';
import Select from '../ui/Select';

const AdministrativeInfoForm = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <FormSection title="ADMINISTRATIVE INFORMATION">
      <div className="form-grid form-grid-2">
        <div className="md:col-span-2">
          <Input
            label="Name of Broadcaster"
            {...register('administrative_info.name_of_broadcaster')}
            error={errors.administrative_info?.name_of_broadcaster?.message}
            placeholder="Enter broadcaster name"
          />
        </div>
      </div>

      <div className="form-grid form-grid-2 mt-4">
        <Input
          label="P.O. Box"
          {...register('administrative_info.po_box')}
          error={errors.administrative_info?.po_box?.message}
          placeholder="Enter P.O. Box"
        />

        <Input
          label="Postal Code"
          {...register('administrative_info.postal_code')}
          error={errors.administrative_info?.postal_code?.message}
          placeholder="Enter postal code"
        />

        <Input
          label="Town"
          {...register('administrative_info.town')}
          error={errors.administrative_info?.town?.message}
          placeholder="Enter town"
        />

        <Input
          label="Location"
          {...register('administrative_info.location')}
          error={errors.administrative_info?.location?.message}
          placeholder="Enter location"
        />

        <Input
          label="Street"
          {...register('administrative_info.street')}
          error={errors.administrative_info?.street?.message}
          placeholder="Enter street"
        />

        <Input
          label="Phone Number"
          {...register('administrative_info.phone_number')}
          error={errors.administrative_info?.phone_number?.message}
          placeholder="Enter phone number"
        />
      </div>

      {/* General Data Section */}
      <div className="mt-8">
        <h4 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          GENERAL DATA
        </h4>
        
        <div className="form-grid form-grid-2">
          <Select
            label="Type of Station"
            {...register('administrative_info.station_type')}
            error={errors.administrative_info?.station_type?.message}
          >
            <option value="RADIO_AM">Radio AM</option>
            <option value="RADIO_FM">Radio FM</option>
            <option value="TV">TV</option>
          </Select>

          <Input
            label="Name of the Transmitting Site"
            {...register('administrative_info.transmitting_site')}
            error={errors.administrative_info?.transmitting_site?.message}
            placeholder="Enter transmitting site name"
          />
        </div>

        <div className="form-grid form-grid-2 mt-4">
          <Input
            label="Longitude (dd mm ss E)"
            {...register('administrative_info.longitude')}
            error={errors.administrative_info?.longitude?.message}
            placeholder="e.g., 36 49 12 E"
          />

          <Input
            label="Latitude (dd mm ss N/S)"
            {...register('administrative_info.latitude')}
            error={errors.administrative_info?.latitude?.message}
            placeholder="e.g., 01 17 30 S"
          />
        </div>

        <div className="form-grid form-grid-3 mt-4">
          <Input
            label="Physical Location"
            {...register('administrative_info.physical_location')}
            error={errors.administrative_info?.physical_location?.message}
            placeholder="Enter physical location"
          />

          <Input
            label="Physical Street"
            {...register('administrative_info.physical_street')}
            error={errors.administrative_info?.physical_street?.message}
            placeholder="Enter physical street"
          />

          <Input
            label="Physical Area"
            {...register('administrative_info.physical_area')}
            error={errors.administrative_info?.physical_area?.message}
            placeholder="Enter physical area"
          />
        </div>

        <div className="form-grid form-grid-2 mt-4">
          <Input
            label="Altitude (m above sea level)"
            type="number"
            step="0.01"
            {...register('administrative_info.altitude')}
            error={errors.administrative_info?.altitude?.message}
            placeholder="Enter altitude in meters"
          />

          <Input
            label="Name of the Land Owner"
            {...register('administrative_info.land_owner')}
            error={errors.administrative_info?.land_owner?.message}
            placeholder="Enter land owner name"
          />
        </div>

        <div className="mt-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="other_telecoms_operator"
              {...register('administrative_info.other_telecoms_operator')}
              className="mt-1 w-4 h-4 text-ca-blue bg-gray-100 border-gray-300 rounded focus:ring-ca-blue focus:ring-2"
            />
            <div className="flex-1">
              <label htmlFor="other_telecoms_operator" className="text-sm font-medium text-gray-700">
                Others Telecoms Operator on site?
              </label>
              <textarea
                {...register('administrative_info.other_telecoms_details')}
                placeholder="If yes, elaborate..."
                rows={2}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ca-blue focus:border-ca-blue transition-colors duration-200 resize-y"
              />
            </div>
          </div>
        </div>
      </div>
    </FormSection>
  );
};

export default AdministrativeInfoForm;