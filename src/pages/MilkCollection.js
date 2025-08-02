import React, { useState, useEffect } from 'react';
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays } from 'date-fns';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import MilkCollectionReport from './MilkCollectionReport';

const MilkCollection = () => {
  const [activeTab, setActiveTab] = useState('newEntry');
  const [suppliers, setSuppliers] = useState([]);
  const [collections, setCollections] = useState([]);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  
  const [reportParams, setReportParams] = useState({
    period: 'daily',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    supplierId: 'all'
  });

  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: ''
  });

  const [formData, setFormData] = useState({
    supplier_id: '',
    collection_date: format(new Date(), 'yyyy-MM-dd'),
    quantity: '',
    temperature: '',
    qualityParams: {
      fat_content: '',
      density: '',
      ph: '',
      protein: '',
      lactose: '',
      somatic_cell_count: '',
      total_bacterial_count: ''
    },
    notes: ''
  });

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (activeTab === 'history') {
          await fetchCollections();
        } else {
          await fetchSuppliers();
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error(`Error loading data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/milk/suppliers', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSuppliers(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch suppliers');
      }
    } catch (error) {
      console.error('Supplier fetch error:', error);
      throw error;
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/milk/collections', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setCollections(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch collections');
      }
    } catch (error) {
      console.error('Collection fetch error:', error);
      throw error;
    }
  };

  const fetchReportData = async () => {
    try {
      setReportLoading(true);
      let url = `http://localhost:5000/api/milk/collections/report?start_date=${reportParams.startDate}&end_date=${reportParams.endDate}`;
      
      if (reportParams.supplierId !== 'all') {
        url += `&supplier_id=${reportParams.supplierId}`;
      }

      const response = await fetch(url, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setReportData(data.data);
        return true;
      } else {
        throw new Error(data.message || 'Failed to fetch report data');
      }
    } catch (error) {
      console.error('Report fetch error:', error);
      toast.error(`Failed to generate report: ${error.message}`);
      return false;
    } finally {
      setReportLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQualityParamChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      qualityParams: { ...prev.qualityParams, [name]: value }
    }));
  };

  const handleSupplierInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier(prev => ({ ...prev, [name]: value }));
  };

  const handleReportParamChange = (e) => {
    const { name, value } = e.target;
    
    setReportParams(prev => {
      const newParams = { ...prev, [name]: value };
      
      // Auto-adjust dates when period changes
      if (name === 'period') {
        const today = new Date();
        switch (value) {
          case 'daily':
            const dateStr = format(today, 'yyyy-MM-dd');
            return { ...newParams, startDate: dateStr, endDate: dateStr };
          case 'weekly':
            return { 
              ...newParams, 
              startDate: format(startOfWeek(today), 'yyyy-MM-dd'),
              endDate: format(endOfWeek(today), 'yyyy-MM-dd')
            };
          case 'monthly':
            return { 
              ...newParams, 
              startDate: format(startOfMonth(today), 'yyyy-MM-dd'),
              endDate: format(endOfMonth(today), 'yyyy-MM-dd')
            };
          default:
            return newParams;
        }
      }
      return newParams;
    });
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/milk/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSupplier),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Supplier added successfully!');
        setShowSupplierModal(false);
        await fetchSuppliers();
        setNewSupplier({
          name: '',
          contact_person: '',
          phone: '',
          email: '',
          address: ''
        });
        // Auto-select the new supplier
        setFormData(prev => ({ ...prev, supplier_id: data.supplier_id }));
      } else {
        throw new Error(data.message || 'Failed to add supplier');
      }
    } catch (error) {
      console.error('Add supplier error:', error);
      toast.error(`Failed to add supplier: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        ...formData.qualityParams
      };
      delete payload.qualityParams;

      const response = await fetch('http://localhost:5000/api/milk/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Milk collection recorded successfully!');
        // Reset form but keep supplier and date
        setFormData(prev => ({
          supplier_id: prev.supplier_id,
          collection_date: format(new Date(), 'yyyy-MM-dd'),
          quantity: '',
          temperature: '',
          qualityParams: {
            fat_content: '',
            density: '',
            ph: '',
            protein: '',
            lactose: '',
            somatic_cell_count: '',
            total_bacterial_count: ''
          },
          notes: ''
        }));
        // Refresh collections if on history tab
        if (activeTab === 'history') {
          await fetchCollections();
        }
      } else {
        throw new Error(data.message || 'Failed to record collection');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(`Failed to record collection: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    const success = await fetchReportData();
    if (success) {
      setShowReportModal(true);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Milk Collection</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('newEntry')}
            className={`px-4 py-2 rounded-md ${activeTab === 'newEntry' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            disabled={loading}
          >
            {loading && activeTab === 'newEntry' ? 'Loading...' : 'New Entry'}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-md ${activeTab === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            disabled={loading}
          >
            {loading && activeTab === 'history' ? 'Loading...' : 'Collection History'}
          </button>
          <button
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            disabled={loading}
          >
            Generate Report
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : activeTab === 'newEntry' ? (
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Collection Details */}
              <div>
                <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                  Collection Details
                </h2>
                <div className="space-y-4">
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Supplier *
                      </label>
                      <select
                        name="supplier_id"
                        value={formData.supplier_id}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={loading}
                      >
                        <option value="">Select Supplier</option>
                        {suppliers.map(supplier => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.name} ({supplier.contact_person})
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSupplierModal(true)}
                      className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
                      disabled={loading}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Collection Date *
                    </label>
                    <input
                      type="date"
                      name="collection_date"
                      value={formData.collection_date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity (Liters) *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      step="0.01"
                      min="0"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Temperature (°C)
                    </label>
                    <input
                      type="number"
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      step="0.1"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Quality Parameters */}
              <div>
                <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                  Quality Parameters
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fat Content (%)
                      </label>
                      <input
                        type="number"
                        name="fat_content"
                        value={formData.qualityParams.fat_content}
                        onChange={handleQualityParamChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        step="0.01"
                        min="0"
                        max="100"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Density (g/cm³)
                      </label>
                      <input
                        type="number"
                        name="density"
                        value={formData.qualityParams.density}
                        onChange={handleQualityParamChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        step="0.001"
                        min="0"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        pH Level
                      </label>
                      <input
                        type="number"
                        name="ph"
                        value={formData.qualityParams.ph}
                        onChange={handleQualityParamChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        step="0.1"
                        min="0"
                        max="14"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Protein (%)
                      </label>
                      <input
                        type="number"
                        name="protein"
                        value={formData.qualityParams.protein}
                        onChange={handleQualityParamChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        step="0.01"
                        min="0"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lactose (%)
                      </label>
                      <input
                        type="number"
                        name="lactose"
                        value={formData.qualityParams.lactose}
                        onChange={handleQualityParamChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        step="0.01"
                        min="0"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Somatic Cell Count
                      </label>
                      <input
                        type="number"
                        name="somatic_cell_count"
                        value={formData.qualityParams.somatic_cell_count}
                        onChange={handleQualityParamChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Bacterial Count
                    </label>
                    <input
                      type="number"
                      name="total_bacterial_count"
                      value={formData.qualityParams.total_bacterial_count}
                      onChange={handleQualityParamChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Record Collection'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Collection History
            </h2>
            {collections.length === 0 ? (
              <p className="text-gray-500">No collection records found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Supplier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity (L)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Temp (°C)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fat (%)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        pH
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {collections.map((collection) => (
                      <tr key={collection.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(parseISO(collection.collection_date), 'MMM dd, yyyy HH:mm')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {collection.supplier_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {collection.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {collection.temperature || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {collection.fat_content || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {collection.ph || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {showSupplierModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Supplier</h3>
                <button
                  onClick={() => setShowSupplierModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                  disabled={loading}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleAddSupplier}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supplier Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newSupplier.name}
                      onChange={handleSupplierInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      name="contact_person"
                      value={newSupplier.contact_person}
                      onChange={handleSupplierInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={newSupplier.phone}
                      onChange={handleSupplierInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={newSupplier.email}
                      onChange={handleSupplierInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address (Optional)
                    </label>
                    <textarea
                      name="address"
                      value={newSupplier.address}
                      onChange={handleSupplierInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowSupplierModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Supplier'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Report Generation Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Generate Milk Collection Report</h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                  disabled={reportLoading}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Report Period
                  </label>
                  <select
                    name="period"
                    value={reportParams.period}
                    onChange={handleReportParamChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={reportLoading}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={reportParams.startDate}
                      onChange={handleReportParamChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={reportParams.period !== 'custom' || reportLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={reportParams.endDate}
                      onChange={handleReportParamChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={reportParams.period !== 'custom' || reportLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier (Optional)
                  </label>
                  <select
                    name="supplierId"
                    value={reportParams.supplierId}
                    onChange={handleReportParamChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={reportLoading}
                  >
                    <option value="all">All Suppliers</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
                  disabled={reportLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGenerateReport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={reportLoading}
                >
                  {reportLoading ? 'Generating...' : 'Generate Report'}
                </button>
              </div>

              {reportData.length > 0 && (
                <div className="mt-6">
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-700">Report generated successfully!</p>
                    <p className="text-sm text-green-600 mt-1">
                      {reportData.length} records found between {format(new Date(reportParams.startDate), 'MMM dd, yyyy')} and {format(new Date(reportParams.endDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <PDFDownloadLink
                    document={<MilkCollectionReport data={reportData} params={reportParams} />}
                    fileName={`milk-collection-report-${reportParams.startDate}-to-${reportParams.endDate}.pdf`}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 inline-flex items-center"
                  >
                    {({ loading }) => (
                      loading ? 'Preparing PDF...' : (
                        <>
                          <i className="fas fa-file-pdf mr-2"></i> Download PDF
                        </>
                      )
                    )}
                  </PDFDownloadLink>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilkCollection;