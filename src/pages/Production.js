import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  getRecipes, 
  getBatches, 
  createBatch, 
  updateBatchStatus, 
  completeBatch,
  getProducts, 
  getRawMaterials, 
  getEmployees,
  getBatchDetails,  
  addRecipe,        
  addRecipeIngredient
} from '../services/production';
import RecipeModal from '../components/Production/RecipeModal';
import BatchModal from '../components/Production/BatchModal';
import BatchDetailsModal from '../components/Production/BatchDetailsModal.js';

const Production = () => {
  const [activeTab, setActiveTab] = useState('batches');
  const [recipes, setRecipes] = useState([]);
  const [batches, setBatches] = useState([]);
  const [products, setProducts] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const navigate = useNavigate();

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (activeTab === 'recipes') {
          const recipesData = await getRecipes();
          setRecipes(recipesData.data);
        } else {
          const batchesData = await getBatches();
          setBatches(batchesData.data);
        }
        
        // Load supporting data if not already loaded
        if (products.length === 0) {
          const productsData = await getProducts();
          setProducts(productsData.data);
        }
        if (rawMaterials.length === 0) {
          const materialsData = await getRawMaterials();
          setRawMaterials(materialsData.data);
        }
        if (employees.length === 0) {
          const employeesData = await getEmployees();
          setEmployees(employeesData.data);
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

  const handleCreateBatch = async (batchData) => {
    try {
      setLoading(true);
      const response = await createBatch(batchData);
      toast.success('Batch created successfully!');
      setShowBatchModal(false);
      
      // Refresh batches list
      const batchesData = await getBatches();
      setBatches(batchesData.data);
    } catch (error) {
      console.error('Error creating batch:', error);
      toast.error(`Failed to create batch: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBatchStatus = async (batchId, status) => {
    try {
      setLoading(true);
      await updateBatchStatus(batchId, status);
      toast.success(`Batch status updated to ${status.replace('_', ' ')}`);
      
      // Refresh batches list
      const batchesData = await getBatches();
      setBatches(batchesData.data);
      
      // Refresh selected batch if it's the one being updated
      if (selectedBatch && selectedBatch.id === batchId) {
        const batchDetails = await getBatchDetails(batchId);
        setSelectedBatch(batchDetails.data);
      }
    } catch (error) {
      console.error('Error updating batch status:', error);
      toast.error(`Failed to update batch status: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteBatch = async (batchId, actualQuantity) => {
    try {
      setLoading(true);
      await completeBatch(batchId, actualQuantity);
      toast.success('Batch completed successfully!');
      setSelectedBatch(null);
      
      // Refresh batches list
      const batchesData = await getBatches();
      setBatches(batchesData.data);
    } catch (error) {
      console.error('Error completing batch:', error);
      toast.error(`Failed to complete batch: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      planned: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    const displayStatus = status.replace('_', ' ');
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {displayStatus}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Production Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('batches')}
            className={`px-4 py-2 rounded-md ${activeTab === 'batches' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
            disabled={loading}
          >
            {loading && activeTab === 'batches' ? 'Loading...' : 'Production Batches'}
          </button>
          <button
            onClick={() => setActiveTab('recipes')}
            className={`px-4 py-2 rounded-md ${activeTab === 'recipes' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
            disabled={loading}
          >
            {loading && activeTab === 'recipes' ? 'Loading...' : 'Recipes'}
          </button>
          {activeTab === 'batches' && (
            <button
              onClick={() => setShowBatchModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              disabled={loading}
            >
              New Batch
            </button>
          )}
          {activeTab === 'recipes' && (
            <button
              onClick={() => setShowRecipeModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              disabled={loading}
            >
              New Recipe
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : activeTab === 'recipes' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Recipes
            </h2>
            {recipes.length === 0 ? (
              <p className="text-gray-500">No recipes found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Yield
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recipes.map((recipe) => (
                      <tr key={recipe.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {recipe.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {recipe.product_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {recipe.yield_quantity} {recipe.yield_unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => navigate(`/recipes/${recipe.id}`)}
                            className="text-primary hover:text-primary-dark mr-3"
                          >
                            View
                          </button>
                          <button
                            onClick={() => setShowBatchModal({ recipeId: recipe.id })}
                            className="text-green-600 hover:text-green-800"
                          >
                            New Batch
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Production Batches
            </h2>
            {batches.length === 0 ? (
              <p className="text-gray-500">No production batches found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Batch #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recipe
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Planned Qty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {batches.map((batch) => (
                      <tr key={batch.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {batch.batch_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {batch.recipe_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {batch.product_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {batch.planned_quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getStatusBadge(batch.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(batch.start_date).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => setSelectedBatch(batch)}
                            className="text-primary hover:text-primary-dark mr-3"
                          >
                            Details
                          </button>
                          {batch.status === 'planned' && (
                            <button
                              onClick={() => handleUpdateBatchStatus(batch.id, 'in_progress')}
                              className="text-yellow-600 hover:text-yellow-800"
                            >
                              Start
                            </button>
                          )}
                          {batch.status === 'in_progress' && (
                            <button
                              onClick={() => setSelectedBatch(batch)}
                              className="text-green-600 hover:text-green-800"
                            >
                              Complete
                            </button>
                          )}
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

      {/* Recipe Modal */}
      {showRecipeModal && (
        <RecipeModal
          products={products}
          rawMaterials={rawMaterials}
          onClose={() => setShowRecipeModal(false)}
          onSave={async (recipeData) => {
            try {
              setLoading(true);
              const response = await addRecipe(recipeData);
              toast.success('Recipe added successfully!');
              
              // Add ingredients if any
              if (recipeData.ingredients && recipeData.ingredients.length > 0) {
                for (const ingredient of recipeData.ingredients) {
                  await addRecipeIngredient(response.recipe_id, ingredient);
                }
              }
              
              setShowRecipeModal(false);
              
              // Refresh recipes list
              const recipesData = await getRecipes();
              setRecipes(recipesData.data);
            } catch (error) {
              console.error('Error adding recipe:', error);
              toast.error(`Failed to add recipe: ${error.message}`);
            } finally {
              setLoading(false);
            }
          }}
        />
      )}

      {/* Batch Modal */}
      {showBatchModal && (
        <BatchModal
          recipes={recipes}
          employees={employees}
          initialRecipeId={showBatchModal.recipeId}
          onClose={() => setShowBatchModal(false)}
          onSave={handleCreateBatch}
        />
      )}

      {/* Batch Details Modal */}
      {selectedBatch && (
        <BatchDetailsModal
          batch={selectedBatch}
          onClose={() => setSelectedBatch(null)}
          onStatusChange={handleUpdateBatchStatus}
          onComplete={handleCompleteBatch}
        />
      )}
    </div>
  );
};

export default Production;