import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  FileText, 
  Download, 
  Eye, 
  Edit3, 
  Trash2,
  Calendar,
  User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formAPI, downloadFile, handleApiError } from '../services/api';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingPdf, setDownloadingPdf] = useState(null);
  const [downloadingExcel, setDownloadingExcel] = useState(null);

  useEffect(() => {
    loadForms();
  }, []);

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

  const stats = {
    total: forms.length,
    thisMonth: forms.filter(form => {
      const createdDate = new Date(form.created_at);
      const now = new Date();
      return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
    }).length,
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
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-gray-600">
              Welcome back, {user?.first_name || user?.username}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-ca-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-ca-blue" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Inspections</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inspector</p>
                <p className="text-lg font-bold text-gray-900">
                  {user?.first_name} {user?.last_name}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Inspections */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Inspections</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/inspections')}
            >
              View All
            </Button>
          </div>

          {forms.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No inspections yet</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first inspection form.</p>
              <Button onClick={() => navigate('/inspection/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Inspection
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {forms.slice(0, 5).map((form) => (
                <div
                  key={form.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-ca-light bg-opacity-10 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-ca-blue" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {form.administrative_info?.name_of_broadcaster || `Inspection #${form.id}`}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-xs text-gray-500">
                            Created: {format(new Date(form.created_at), 'MMM dd, yyyy')}
                          </p>
                          {form.administrative_info?.station_type && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {form.administrative_info.station_type}
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
                      onClick={() => handleDeleteForm(form.id)}
                      title="Delete"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2 border-dashed border-gray-200 hover:border-ca-blue transition-colors cursor-pointer">
            <div
              className="text-center py-8"
              onClick={() => navigate('/inspection/new')}
            >
              <div className="w-12 h-12 bg-ca-blue bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-ca-blue" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">New Inspection</h3>
              <p className="text-gray-600">Create a new TV/Radio inspection form</p>
            </div>
          </Card>

          <Card className="border-2 border-dashed border-gray-200 hover:border-ca-blue transition-colors cursor-pointer">
            <div
              className="text-center py-8"
              onClick={() => navigate('/inspections')}
            >
              <div className="w-12 h-12 bg-ca-blue bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-ca-blue" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">View All</h3>
              <p className="text-gray-600">Browse all inspection forms</p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;