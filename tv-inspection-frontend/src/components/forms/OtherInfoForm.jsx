// src/components/forms/OtherInfoForm.jsx
import React, { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Calendar } from 'lucide-react';
import FormSection from './FormSection';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';

const OtherInfoForm = () => {
  const { register, formState: { errors }, control } = useFormContext();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ca_personnel'
  });

  const addPersonnel = () => {
    append({
      name: '',
      signature: '',
      date: ''
    });
  };

  return (
    <FormSection title="OTHER INFORMATION">
      {/* Observations */}
      <div className="mb-6">
        <Textarea
          label="Observations"
          {...register('other_information.observations')}
          error={errors.other_information?.observations?.message}
          placeholder="Enter any observations, issues, or additional notes about the inspection..."
          rows={4}
        />
      </div>

      <div className="mb-6">
        <Input
          label="Technical Personnel Name"
          {...register('other_information.technical_personnel_name')}
          error={errors.other_information?.technical_personnel_name?.message}
          placeholder="Enter name of technical personnel present"
        />
      </div>

      {/* Contact Personnel Section */}
      <div className="mb-8">
        <h4 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          Contact Personnel
        </h4>
        
        <div className="form-grid form-grid-2">
          <Input
            label="Contact Name"
            {...register('other_information.contact_name')}
            error={errors.other_information?.contact_name?.message}
            placeholder="Enter contact person name"
          />

          <Input
            label="Contact Address"
            {...register('other_information.contact_address')}
            error={errors.other_information?.contact_address?.message}
            placeholder="Enter contact address"
          />

          <Input
            label="Contact Telephone"
            {...register('other_information.contact_tel')}
            error={errors.other_information?.contact_tel?.message}
            placeholder="Enter contact telephone"
          />

          <Input
            label="Contact Email"
            type="email"
            {...register('other_information.contact_email')}
            error={errors.other_information?.contact_email?.message}
            placeholder="Enter contact email"
          />

          <Input
            label="Contact Date"
            type="date"
            {...register('other_information.contact_date')}
            error={errors.other_information?.contact_date?.message}
          />
        </div>

        <div className="mt-4">
          <Textarea
            label="Contact Signature (Digital Signature or Notes)"
            {...register('other_information.contact_signature')}
            error={errors.other_information?.contact_signature?.message}
            placeholder="Enter digital signature details or signature notes..."
            rows={2}
          />
        </div>
      </div>

      {/* CA Inspection Personnel Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-gray-800 pb-2 border-b border-gray-200 flex-1">
            CA Inspection Personnel
          </h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPersonnel}
            className="ml-4"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Personnel
          </Button>
        </div>

        {fields.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No CA personnel added yet</p>
            <Button
              type="button"
              variant="outline"
              onClick={addPersonnel}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Personnel
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-sm font-medium text-gray-700">
                  Personnel #{index + 1}
                </h5>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="form-grid form-grid-2">
                <Input
                  label="Name"
                  {...register(`ca_personnel.${index}.name`)}
                  error={errors.ca_personnel?.[index]?.name?.message}
                  placeholder="Enter personnel name"
                />

                <Input
                  label="Date"
                  type="date"
                  {...register(`ca_personnel.${index}.date`)}
                  error={errors.ca_personnel?.[index]?.date?.message}
                />
              </div>

              <div className="mt-3">
                <Textarea
                  label="Signature (Digital Signature or Notes)"
                  {...register(`ca_personnel.${index}.signature`)}
                  error={errors.ca_personnel?.[index]?.signature?.message}
                  placeholder="Enter digital signature details or signature notes..."
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </FormSection>
  );
};

export default OtherInfoForm;