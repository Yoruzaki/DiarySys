import React, { useState } from 'react';
import { toast } from 'react-toastify';

const AddItemModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  itemType, 
  productTypes = ['raw_milk', 'pasteurized_milk', 'cheese', 'yogurt', 'other']
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unit: 'kg',
    product_type: 'raw_milk',
    min_stock_level: '',
    max_stock_level: '',
    // Product-specific fields
    wholesale_price: '',
    retail_price: '',
    tax_rate: '',
    ht_price: '',
    ttc_price: '',
    cost_price: '',
    profit_margin: '',
    barcode: '',
    shelf_life_days: '',
    storage_conditions: '',
    // Raw material-specific fields
    purchase_price: '',
    supplier_price: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculatePrices = () => {
    if (itemType === 'product') {
      // Calculate TTC price if HT and tax rate are provided
      if (formData.ht_price && formData.tax_rate) {
        const ttc = parseFloat(formData.ht_price) * (1 + parseFloat(formData.tax_rate)/100);
        setFormData(prev => ({ ...prev, ttc_price: ttc.toFixed(2) }));
      }
      // Calculate profit margin if cost and retail prices are provided
      if (formData.cost_price && formData.retail_price) {
        const margin = ((parseFloat(formData.retail_price) - parseFloat(formData.cost_price)) / 
                       parseFloat(formData.cost_price)) * 100;
        setFormData(prev => ({ ...prev, profit_margin: margin.toFixed(2) }));
      }
    } else {
      // Calculate TTC price for raw materials
      if (formData.purchase_price && formData.tax_rate) {
        const ttc = parseFloat(formData.purchase_price) * (1 + parseFloat(formData.tax_rate)/100);
        setFormData(prev => ({ ...prev, ttc_price: ttc.toFixed(2) }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.unit) {
      toast.error('Name and unit are required fields');
      return;
    }

    if (itemType === 'product' && !formData.retail_price) {
      toast.error('Retail price is required for products');
      return;
    }

    if (itemType === 'raw_material' && !formData.purchase_price) {
      toast.error('Purchase price is required for raw materials');
      return;
    }

    // Prepare data based on item type
    const dataToSend = { ...formData };
    
    // Remove fields not needed for the specific item type
    if (itemType === 'raw_material') {
      delete dataToSend.product_type;
      delete dataToSend.wholesale_price;
      delete dataToSend.retail_price;
    } else {
      delete dataToSend.purchase_price;
      delete dataToSend.supplier_price;
    }

    // Convert numeric fields
    const numericFields = [
      'min_stock_level', 'max_stock_level',
      'wholesale_price', 'retail_price', 'tax_rate',
      'ht_price', 'ttc_price', 'cost_price', 'profit_margin',
      'purchase_price', 'supplier_price', 'shelf_life_days'
    ];

    numericFields.forEach(field => {
      if (dataToSend[field]) {
        dataToSend[field] = parseFloat(dataToSend[field]);
      } else if (dataToSend[field] === '') {
        delete dataToSend[field];
      }
    });

    onSave(dataToSend);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Add New {itemType === 'raw_material' ? 'Raw Material' : 'Product'}
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
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit *
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="L">L</option>
                    <option value="ml">ml</option>
                    <option value="piece">piece</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              {itemType === 'product' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Type *
                  </label>
                  <select
                    name="product_type"
                    value={formData.product_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  >
                    {productTypes.map(type => (
                      <option key={type} value={type}>
                        {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Stock Levels */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Stock Level
                  </label>
                  <input
                    type="number"
                    name="min_stock_level"
                    value={formData.min_stock_level}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Stock Level
                  </label>
                  <input
                    type="number"
                    name="max_stock_level"
                    value={formData.max_stock_level}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              {/* Product-specific Pricing */}
              {itemType === 'product' ? (
                <>
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Pricing Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Wholesale Price
                        </label>
                        <input
                          type="number"
                          name="wholesale_price"
                          value={formData.wholesale_price}
                          onChange={handleInputChange}
                          onBlur={calculatePrices}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          step="0.01"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Retail Price *
                        </label>
                        <input
                          type="number"
                          name="retail_price"
                          value={formData.retail_price}
                          onChange={handleInputChange}
                          onBlur={calculatePrices}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          step="0.01"
                          min="0"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tax Rate (%)
                        </label>
                        <input
                          type="number"
                          name="tax_rate"
                          value={formData.tax_rate}
                          onChange={handleInputChange}
                          onBlur={calculatePrices}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          step="0.01"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          HT Price
                        </label>
                        <input
                          type="number"
                          name="ht_price"
                          value={formData.ht_price}
                          onChange={handleInputChange}
                          onBlur={calculatePrices}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          step="0.01"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          TTC Price
                        </label>
                        <input
                          type="number"
                          name="ttc_price"
                          value={formData.ttc_price}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          step="0.01"
                          min="0"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cost Price
                        </label>
                        <input
                          type="number"
                          name="cost_price"
                          value={formData.cost_price}
                          onChange={handleInputChange}
                          onBlur={calculatePrices}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          step="0.01"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Profit Margin (%)
                        </label>
                        <input
                          type="number"
                          name="profit_margin"
                          value={formData.profit_margin}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          step="0.01"
                          min="0"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Pricing Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Purchase Price *
                        </label>
                        <input
                          type="number"
                          name="purchase_price"
                          value={formData.purchase_price}
                          onChange={handleInputChange}
                          onBlur={calculatePrices}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          step="0.01"
                          min="0"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Supplier Price
                        </label>
                        <input
                          type="number"
                          name="supplier_price"
                          value={formData.supplier_price}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tax Rate (%)
                        </label>
                        <input
                          type="number"
                          name="tax_rate"
                          value={formData.tax_rate}
                          onChange={handleInputChange}
                          onBlur={calculatePrices}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          step="0.01"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          HT Price
                        </label>
                        <input
                          type="number"
                          name="ht_price"
                          value={formData.ht_price}
                          onChange={handleInputChange}
                          onBlur={calculatePrices}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          step="0.01"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          TTC Price
                        </label>
                        <input
                          type="number"
                          name="ttc_price"
                          value={formData.ttc_price}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          step="0.01"
                          min="0"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Additional Information */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Additional Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Barcode
                    </label>
                    <input
                      type="text"
                      name="barcode"
                      value={formData.barcode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shelf Life (days)
                    </label>
                    <input
                      type="number"
                      name="shelf_life_days"
                      value={formData.shelf_life_days}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      min="0"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Storage Conditions
                  </label>
                  <input
                    type="text"
                    name="storage_conditions"
                    value={formData.storage_conditions}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="e.g., Refrigerated, Room Temperature"
                  />
                </div>
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
                Save {itemType === 'raw_material' ? 'Raw Material' : 'Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;