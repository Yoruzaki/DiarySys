import React, { useState } from 'react';

const StockLevelsModal = ({ item, onClose, onSave }) => {
  const [levels, setLevels] = useState({
    min_stock_level: item.min_stock_level || '',
    max_stock_level: item.max_stock_level || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLevels(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      min_stock_level: levels.min_stock_level ? parseFloat(levels.min_stock_level) : null,
      max_stock_level: levels.max_stock_level ? parseFloat(levels.max_stock_level) : null
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Set Stock Levels - {item.name}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Stock Level ({item.unit})
                </label>
                <input
                  type="number"
                  name="min_stock_level"
                  value={levels.min_stock_level}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Stock Level ({item.unit})
                </label>
                <input
                  type="number"
                  name="max_stock_level"
                  value={levels.max_stock_level}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-700">
                  Current stock: {item.current_stock} {item.unit}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Save Levels
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StockLevelsModal;