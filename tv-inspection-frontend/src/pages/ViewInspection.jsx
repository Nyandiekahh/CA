import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Download, 
  FileText, 
  MapPin, 
  Radio,
  Antenna,
  Settings,
  Building,
  User,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';
import { formAPI, handleApiError, downloadFile } from '../services/api';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { format } from 'date-fns';

const ViewInspection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  useEffect(() => {
    loadForm();
  }, [id]);

  const loadForm = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await formAPI.getForm(id);
      setForm(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloadingPdf(true);
      const response = await formAPI.downloadPdf(id);
      const filename = `Inspection_Form_${form.administrative_info?.name_of_broadcaster || id}_${new Date().toISOString().split('T')[0]}.pdf`;
      downloadFile(response, filename);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      setDownloadingExcel(true);
      const response = await formAPI.downloadExcel(id);
      const filename = `Inspection_Form_${form.administrative_info?.name_of_broadcaster || id}_${new Date().toISOString().split('T')[0]}.xlsx`;
      downloadFile(response, filename);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setDownloadingExcel(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Inspection</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button onClick={loadForm}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!form) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Inspection Not Found</h3>
            <p className="text-gray-600 mb-6">The inspection form you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const { administrative_info, tower_info, transmitter_info, filter_info, antenna_system, stl, other_information, ca_personnel } = form;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {administrative_info?.name_of_broadcaster || `Inspection #${id}`}
              </h1>
              <p className="text-gray-600">
                Created: {format(new Date(form.created_at), 'MMMM dd, yyyy')} • 
                Form ID: {form.form_id} • Version: {form.version}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button
              variant="outline"
              onClick={handleDownloadPdf}
              loading={downloadingPdf}
            >
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadExcel}
              loading={downloadingExcel}
            >
              <Download className="w-4 h-4 mr-2" />
              Excel
            </Button>
            <Button onClick={() => navigate(`/inspection/${id}/edit`)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* Administrative Information */}
        {administrative_info && (
          <Card>
            <div className="flex items-center mb-6">
              <Building className="w-5 h-5 text-ca-blue mr-2" />
              <h2 className="text-lg font-semibold">Administrative Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Broadcaster Name</label>
                <p className="text-gray-900">{administrative_info.name_of_broadcaster || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Station Type</label>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  administrative_info.station_type === 'TV' ? 'bg-blue-100 text-blue-800' :
                  administrative_info.station_type === 'RADIO_FM' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {administrative_info.station_type || 'N/A'}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <p className="text-gray-900 flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  {administrative_info.phone_number || 'N/A'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <p className="text-gray-900 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {administrative_info.location || 'N/A'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Town</label>
                <p className="text-gray-900">{administrative_info.town || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">P.O. Box</label>
                <p className="text-gray-900">{administrative_info.po_box || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transmitting Site</label>
                <p className="text-gray-900">{administrative_info.transmitting_site || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coordinates</label>
                <p className="text-gray-900">
                  {administrative_info.latitude && administrative_info.longitude ? 
                    `${administrative_info.latitude}, ${administrative_info.longitude}` : 'N/A'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Altitude</label>
                <p className="text-gray-900">
                  {administrative_info.altitude ? `${administrative_info.altitude}m` : 'N/A'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Tower Information */}
        {tower_info && (
          <Card>
            <div className="flex items-center mb-6">
              <Building className="w-5 h-5 text-ca-blue mr-2" />
              <h2 className="text-lg font-semibold">Tower Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tower Owner</label>
                <p className="text-gray-900">{tower_info.tower_owner || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tower Height</label>
                <p className="text-gray-900">
                  {tower_info.tower_height ? `${tower_info.tower_height}m` : 'N/A'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tower Type</label>
                <p className="text-gray-900">{tower_info.tower_type || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rust Protection</label>
                <p className="text-gray-900">{tower_info.rust_protection || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Installation Year</label>
                <p className="text-gray-900">{tower_info.installation_year || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                <p className="text-gray-900">{tower_info.manufacturer || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Wind Load</label>
                <p className="text-gray-900">
                  {tower_info.max_wind_load ? `${tower_info.max_wind_load} km/h` : 'N/A'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lightning Protection</label>
                <p className="text-gray-900">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    tower_info.lightning_protection ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {tower_info.lightning_protection ? 'Yes' : 'No'}
                  </span>
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aviation Warning Light</label>
                <p className="text-gray-900">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    tower_info.aviation_warning_light ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {tower_info.aviation_warning_light ? 'Yes' : 'No'}
                  </span>
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Transmitter Information */}
        {transmitter_info && (
          <Card>
            <div className="flex items-center mb-6">
              <Radio className="w-5 h-5 text-ca-blue mr-2" />
              <h2 className="text-lg font-semibold">Transmitter Information</h2>
            </div>
            
            <div className="space-y-6">
              {/* Exciter Section */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Exciter</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                    <p className="text-gray-900">{transmitter_info.exciter_manufacturer || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model Number</label>
                    <p className="text-gray-900">{transmitter_info.exciter_model_number || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                    <p className="text-gray-900">{transmitter_info.exciter_serial_number || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nominal Power</label>
                    <p className="text-gray-900">
                      {transmitter_info.exciter_nominal_power ? `${transmitter_info.exciter_nominal_power}W` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Amplifier Section */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Amplifier</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                    <p className="text-gray-900">{transmitter_info.amplifier_manufacturer || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model Number</label>
                    <p className="text-gray-900">{transmitter_info.amplifier_model_number || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                    <p className="text-gray-900">{transmitter_info.amplifier_serial_number || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nominal Power</label>
                    <p className="text-gray-900">
                      {transmitter_info.amplifier_nominal_power ? `${transmitter_info.amplifier_nominal_power}W` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                    <p className="text-gray-900">{transmitter_info.transmit_frequency || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequency Stability</label>
                    <p className="text-gray-900">{transmitter_info.frequency_stability || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Antenna System */}
        {antenna_system && (
          <Card>
            <div className="flex items-center mb-6">
              <Antenna className="w-5 h-5 text-ca-blue mr-2" />
              <h2 className="text-lg font-semibold">Antenna System</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                <p className="text-gray-900">
                  {antenna_system.height ? `${antenna_system.height}m` : 'N/A'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Antenna Type</label>
                <p className="text-gray-900">{antenna_system.antenna_type || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                <p className="text-gray-900">{antenna_system.manufacturer || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Polarization</label>
                <p className="text-gray-900">{antenna_system.polarization || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horizontal Pattern</label>
                <p className="text-gray-900">{antenna_system.horizontal_pattern || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">System Gain</label>
                <p className="text-gray-900">{antenna_system.antenna_system_gain || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ERP</label>
                <p className="text-gray-900">
                  {antenna_system.effective_radiated_power ? `${antenna_system.effective_radiated_power} kW` : 'N/A'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Other Information */}
        {other_information && (
          <Card>
            <div className="flex items-center mb-6">
              <Settings className="w-5 h-5 text-ca-blue mr-2" />
              <h2 className="text-lg font-semibold">Other Information</h2>
            </div>
            
            <div className="space-y-6">
              {other_information.observations && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Observations</label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">{other_information.observations}</p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Technical Personnel</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <p className="text-gray-900 flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {other_information.technical_personnel_name || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Contact Person</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <p className="text-gray-900 flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {other_information.contact_name || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900 flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {other_information.contact_email || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-gray-900 flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {other_information.contact_tel || 'N/A'}
                      </p>
                    </div>
                    {other_information.contact_date && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <p className="text-gray-900 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {format(new Date(other_information.contact_date), 'MMMM dd, yyyy')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* CA Personnel */}
        {ca_personnel && ca_personnel.length > 0 && (
          <Card>
            <div className="flex items-center mb-6">
              <User className="w-5 h-5 text-ca-blue mr-2" />
              <h2 className="text-lg font-semibold">CA Inspection Personnel</h2>
            </div>
            
            <div className="space-y-4">
              {ca_personnel.map((personnel, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <p className="text-gray-900">{personnel.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Signature</label>
                      <p className="text-gray-900">{personnel.signature || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <p className="text-gray-900">
                        {personnel.date ? format(new Date(personnel.date), 'MMMM dd, yyyy') : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ViewInspection;