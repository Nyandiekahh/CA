// src/pages/InspectionList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter,
  Download, 
  Eye, 
  Edit3, 
  Trash2,
  FileText,
  Calendar,
  Building,
  ChevronDown,
  FileSpreadsheet
} from 'lucide-react';
import { formAPI, downloadFile, handleApiError } from '../services/api';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { format } from 'date-fns';

const InspectionList = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stationTypeFilter, setStationTypeFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(null);
  const [downloadingExcel, setDownloadingExcel] = useState(null);

  useEffect(() => {
    loadForms();
  }, []);

  useEffect(() => {
    filterAndSortForms();
  }, [forms, searchTerm, stationTypeFilter, sortBy, sortOrder]);

  const loadForms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await formAPI.getAllForms();
      setForms(data.results || data || []);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortForms = () => {
    let filtered = [...forms];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(form => 
        form.administrative_info?.name_of_broadcaster?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.administrative_info?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.id.toString().includes(searchTerm)
      );
    }

    // Station type filter
    if (stationTypeFilter) {
      filtered = filtered.filter(form => 
        form.administrative_info?.station_type === stationTypeFilter
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'broadcaster':
          aValue = a.administrative_info?.name_of_broadcaster || '';
          bValue = b.administrative_info?.name_of_broadcaster || '';
          break;
        case 'station_type':
          aValue = a.administrative_info?.station_type || '';
          bValue = b.administrative_info?.station_type || '';
          break;
        case 'location':
          aValue = a.administrative_info?.location || '';
          bValue = b.administrative_info?.location || '';
          break;
        default:
          aValue = new Date(a[sortBy]);
          bValue = new Date(b[sortBy]);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredForms(filtered);
  };

  const handleDownloadPdf = async (formId, broadcasterName) => {
    try {
      setDownloadingPdf(formId);
      const response = await formAPI.downloadPdf(formId);
      const filename = `Inspection_Form_${broadcasterName || formId}_${new Date().toISOString().split('T')[0]}.pdf`;
      downloadFile(response, filename);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setDownloadingPdf(null);
    }
  };

  const handleDownloadExcel = async (formId, broadcasterName) => {
    try {
      setDownloadingExcel(formId);
      const response = await formAPI.downloadExcel(formId);
      const filename = `Inspection_Form_${broadcasterName || formId}_${new Date().toISOString().split('T')[0]}.xlsx`;
      downloadFile(response, filename);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setDownloadingExcel(null);
    }
  };

  const handleDeleteForm = async (formId) => {
    if (window.confirm('Are you sure you want to delete this inspection form?')) {
      try {
        await formAPI.deleteForm(formId);
        await loadForms(); // Reload forms
      } catch (err) {
        setError(handleApiError(err));
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStationTypeFilter('');
    setSortBy('created_at');
    setSortOrder('desc');
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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Inspections</h1>
            <p className="mt-1 text-gray-600">
              {filteredForms.length} of {forms.length} inspection forms
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              onClick={() => navigate('/inspection/new')}
              className="w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Inspection
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="mt-2"
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Filters */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by broadcaster, location, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ca-blue focus:border-ca-blue"
                  />
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <Select
                  label="Station Type"
                  value={stationTypeFilter}
                  onChange={(e) => setStationTypeFilter(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="RADIO_AM">Radio AM</option>
                  <option value="RADIO_FM">Radio FM</option>
                  <option value="TV">TV</option>
                </Select>

                <Select
                  label="Sort By"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="created_at">Date Created</option>
                  <option value="updated_at">Date Updated</option>
                  <option value="broadcaster">Broadcaster</option>
                  <option value="station_type">Station Type</option>
                  <option value="location">Location</option>
                </Select>

                <Select
                  label="Sort Order"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </Select>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Forms List */}
        {filteredForms.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {forms.length === 0 ? 'No inspections yet' : 'No matching inspections'}
              </h3>
              <p className="text-gray-600 mb-6">
                {forms.length === 0 
                  ? 'Get started by creating your first inspection form.' 
                  : 'Try adjusting your search or filter criteria.'}
              </p>
              {forms.length === 0 && (
                <Button onClick={() => navigate('/inspection/new')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Inspection
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredForms.map((form) => (
              <Card key={form.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-ca-light bg-opacity-10 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-ca-blue" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {form.administrative_info?.name_of_broadcaster || `Inspection #${form.id}`}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Building className="w-4 h-4 mr-1" />
                            <span>{form.administrative_info?.location || 'No location'}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{format(new Date(form.created_at), 'MMM dd, yyyy')}</span>
                          </div>
                          
                          {form.administrative_info?.station_type && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-ca-blue bg-opacity-10 text-ca-blue">
                              {form.administrative_info.station_type.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/inspection/${form.id}`)}
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/inspection/${form.id}/edit`)}
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadPdf(form.id, form.administrative_info?.name_of_broadcaster)}
                      loading={downloadingPdf === form.id}
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadExcel(form.id, form.administrative_info?.name_of_broadcaster)}
                      loading={downloadingExcel === form.id}
                      title="Download Excel"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteForm(form.id)}
                      title="Delete"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InspectionList;