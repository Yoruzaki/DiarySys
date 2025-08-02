import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  getRawMaterialStock, 
  getProductStock,
  getRawMaterialMovements,
  getProductMovements,
  addRawMaterialMovement,
  addProductMovement,
  updateRawMaterialLevels,
  updateProductLevels,
  getSuppliersForInventory,
  getClientsForInventory,
  addRawMaterial,
  addProduct
} from '../services/inventory';
import StockMovementModal from '../components/Inventory/StockMovementModal';
import StockLevelsModal from '../components/Inventory/StockLevelsModal';
import AddItemModal from '../components/Inventory/AddItemModal';

const Inventory = () => {
  const [activeTab, setActiveTab] = useState('rawMaterials');
  const [rawMaterials, setRawMaterials] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [showLevelsModal, setShowLevelsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState('raw_material');
  const [suppliers, setSuppliers] = useState([]);
  const [clients, setClients] = useState([]);
  const [movementType, setMovementType] = useState('in');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (activeTab === 'rawMaterials') {
          const stockData = await getRawMaterialStock();
          setRawMaterials(stockData.data);
          
          const suppliersData = await getSuppliersForInventory();
          setSuppliers(suppliersData.data);
        } else {
          const stockData = await getProductStock();
          setProducts(stockData.data);
          
          const clientsData = await getClientsForInventory();
          setClients(clientsData.data);
        }
        
        if (selectedItem) {
          await fetchMovements(selectedItem.id);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error(`Error loading data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, selectedItem]);

  const fetchMovements = async (itemId) => {
    try {
      setLoading(true);
      let movementsData;
      
      if (activeTab === 'rawMaterials') {
        movementsData = await getRawMaterialMovements(itemId);
      } else {
        movementsData = await getProductMovements(itemId);
      }
      
      setMovements(movementsData.data);
    } catch (error) {
      console.error('Error fetching movements:', error);
      toast.error(`Failed to fetch movements: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovement = async (movementData) => {
    try {
      setLoading(true);
      
      if (activeTab === 'rawMaterials') {
        await addRawMaterialMovement({
          ...movementData,
          raw_material_id: selectedItem.id
        });
      } else {
        await addProductMovement({
          ...movementData,
          product_id: selectedItem.id
        });
      }
      
      toast.success('Stock movement recorded successfully!');
      setShowMovementModal(false);
      
      // Refresh data
      if (activeTab === 'rawMaterials') {
        const stockData = await getRawMaterialStock();
        setRawMaterials(stockData.data);
      } else {
        const stockData = await getProductStock();
        setProducts(stockData.data);
      }
      
      await fetchMovements(selectedItem.id);
    } catch (error) {
      console.error('Error adding movement:', error);
      toast.error(`Failed to record movement: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLevels = async (levels) => {
    try {
      setLoading(true);
      
      if (activeTab === 'rawMaterials') {
        await updateRawMaterialLevels(selectedItem.id, levels);
      } else {
        await updateProductLevels(selectedItem.id, levels);
      }
      
      toast.success('Stock levels updated successfully!');
      setShowLevelsModal(false);
      
      // Refresh data
      if (activeTab === 'rawMaterials') {
        const stockData = await getRawMaterialStock();
        setRawMaterials(stockData.data);
      } else {
        const stockData = await getProductStock();
        setProducts(stockData.data);
      }
    } catch (error) {
      console.error('Error updating levels:', error);
      toast.error(`Failed to update levels: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (itemData) => {
    try {
      setLoading(true);
      let response;
      
      if (addModalType === 'raw_material') {
        response = await addRawMaterial(itemData);
      } else {
        response = await addProduct(itemData);
      }
      
      toast.success(`${addModalType === 'raw_material' ? 'Raw material' : 'Product'} added successfully!`);
      setShowAddModal(false);
      
      // Refresh the appropriate list
      if (addModalType === 'raw_material') {
        const stockData = await getRawMaterialStock();
        setRawMaterials(stockData.data);
      } else {
        const stockData = await getProductStock();
        setProducts(stockData.data);
      }
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error(`Failed to add item: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (item) => {
    if (item.status === 'low') {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Low Stock</span>;
    } else if (item.status === 'high') {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">High Stock</span>;
    }
    return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Normal</span>;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setAddModalType('raw_material');
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Raw Material
          </button>
          <button
            onClick={() => {
              setAddModalType('product');
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add Product
          </button>
          <button
            onClick={() => setActiveTab('rawMaterials')}
            className={`px-4 py-2 rounded-md ${activeTab === 'rawMaterials' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
            disabled={loading}
          >
            Raw Materials
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-md ${activeTab === 'products' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
            disabled={loading}
          >
            Products
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stock List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">
                {activeTab === 'rawMaterials' ? 'Raw Materials' : 'Products'}
              </h2>
            </div>
            <div className="divide-y">
              {(activeTab === 'rawMaterials' ? rawMaterials : products).map(item => (
                <div 
                  key={item.id} 
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedItem?.id === item.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    {getStatusBadge(item)}
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-lg font-semibold">
                      {item.current_stock} {item.unit}
                    </span>
                    <div className="text-sm text-gray-500">
                      Min: {item.min_stock_level || 'N/A'} | Max: {item.max_stock_level || 'N/A'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details and Movements */}
          <div className="lg:col-span-2 space-y-6">
            {selectedItem ? (
              <>
                {/* Item Details */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{selectedItem.name}</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setMovementType('in');
                          setShowMovementModal(true);
                        }}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                      >
                        Add Stock
                      </button>
                      <button
                        onClick={() => {
                          setMovementType('out');
                          setShowMovementModal(true);
                        }}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                      >
                        Remove Stock
                      </button>
                      <button
                        onClick={() => setShowLevelsModal(true)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        Set Levels
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Current Stock</h3>
                      <p className="text-2xl font-bold">
                        {selectedItem.current_stock} {selectedItem.unit}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Minimum Level</h3>
                      <p className="text-xl">
                        {selectedItem.min_stock_level || 'Not set'} {selectedItem.unit}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Maximum Level</h3>
                      <p className="text-xl">
                        {selectedItem.max_stock_level || 'Not set'} {selectedItem.unit}
                      </p>
                    </div>
                  </div>

                  {selectedItem.description && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                      <p className="text-gray-700">{selectedItem.description}</p>
                    </div>
                  )}
                </div>

                {/* Stock Movements */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Stock Movements</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Batch/Reference
                          </th>
                          {activeTab === 'rawMaterials' ? (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Supplier
                            </th>
                          ) : (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Client
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {movements.map((movement, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(movement.movement_date).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {movement.movement_type === 'in' ? (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  In
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                  Out
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {movement.quantity} {movement.unit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {movement.batch_number || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {activeTab === 'rawMaterials' 
                                ? movement.supplier_name || '-' 
                                : movement.client_name || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center h-64">
                <p className="text-gray-500">
                  Select an item from the list to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stock Movement Modal */}
      {showMovementModal && selectedItem && (
        <StockMovementModal
          item={selectedItem}
          type={movementType}
          onClose={() => setShowMovementModal(false)}
          onSave={handleAddMovement}
          suppliers={activeTab === 'rawMaterials' ? suppliers : []}
          clients={activeTab === 'products' ? clients : []}
        />
      )}

      {/* Stock Levels Modal */}
      {showLevelsModal && selectedItem && (
        <StockLevelsModal
          item={selectedItem}
          onClose={() => setShowLevelsModal(false)}
          onSave={handleUpdateLevels}
        />
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <AddItemModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddItem}
          itemType={addModalType}
        />
      )}
    </div>
  );
};

export default Inventory;