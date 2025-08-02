import React, { useState } from 'react';

const RecipeDetailsModal = ({
  recipe,
  products,
  rawMaterials,
  isEditing,
  onClose,
  onEdit,
  onCancelEdit,
  onSave,
  onAddIngredient,
  onUpdateIngredient,
  onDeleteIngredient
}) => {
  const [editedRecipe, setEditedRecipe] = useState({ ...recipe });
  const [newIngredient, setNewIngredient] = useState({
    ingredient_type: 'raw_material',
    raw_material_id: '',
    product_id: '',
    quantity: '',
    unit: 'kg',
    notes: ''
  });
  const [showAddIngredient, setShowAddIngredient] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedRecipe(prev => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (e) => {
    const { name, value } = e.target;
    setNewIngredient(prev => ({ ...prev, [name]: value }));
  };

  const handleAddIngredient = () => {
    if ((newIngredient.ingredient_type === 'raw_material' && !newIngredient.raw_material_id) ||
        (newIngredient.ingredient_type === 'product' && !newIngredient.product_id) ||
        !newIngredient.quantity) {
      return;
    }

    const ingredientToAdd = {
      ...newIngredient,
      quantity: parseFloat(newIngredient.quantity)
    };

    if (newIngredient.ingredient_type === 'raw_material') {
      delete ingredientToAdd.product_id;
    } else {
      delete ingredientToAdd.raw_material_id;
    }

    onAddIngredient(ingredientToAdd);
    setNewIngredient({
      ingredient_type: 'raw_material',
      raw_material_id: '',
      product_id: '',
      quantity: '',
      unit: 'kg',
      notes: ''
    });
    setShowAddIngredient(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? 'Edit Recipe' : 'Recipe Details'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <i className="fas fa-times"></i>
            </button>
          </div>

          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={editedRecipe.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
                <select
                  name="product_id"
                  value={editedRecipe.product_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  required
                >
                  {products.map(product => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yield Quantity *</label>
                <input
                  type="number"
                  name="yield_quantity"
                  value={editedRecipe.yield_quantity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yield Unit *</label>
                <select
                  name="yield_unit"
                  value={editedRecipe.yield_unit}
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={editedRecipe.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                <textarea
                  name="instructions"
                  value={editedRecipe.instructions}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-sm text-gray-900">{recipe.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <p className="text-sm text-gray-900">{recipe.product_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yield</label>
                <p className="text-sm text-gray-900">{recipe.yield_quantity} {recipe.yield_unit}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                <p className="text-sm text-gray-900">{new Date(recipe.updated_at).toLocaleString()}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-sm text-gray-900">{recipe.description || 'No description'}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                <p className="text-sm text-gray-900 whitespace-pre-line">{recipe.instructions || 'No instructions'}</p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-700">Ingredients</h4>
              {isEditing && (
                <button
                  onClick={() => setShowAddIngredient(true)}
                  className="px-3 py-1 bg-primary text-white text-sm rounded-md hover:bg-primary-dark"
                >
                  Add Ingredient
                </button>
              )}
            </div>

            {recipe.ingredients.length === 0 ? (
              <p className="text-sm text-gray-500">No ingredients</p>
            ) : (
              <div className="border rounded-md divide-y">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {ingredient.ingredient_type === 'raw_material'
                          ? rawMaterials.find(rm => rm.id === ingredient.raw_material_id)?.name
                          : products.find(p => p.id === ingredient.product_id)?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {ingredient.quantity} {ingredient.unit}
                        {ingredient.notes && ` (${ingredient.notes})`}
                      </p>
                    </div>
                    {isEditing && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onDeleteIngredient(ingredient.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {showAddIngredient && (
              <div className="bg-gray-50 p-4 rounded-md mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      name="ingredient_type"
                      value={newIngredient.ingredient_type}
                      onChange={handleIngredientChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    >
                      <option value="raw_material">Raw Material</option>
                      <option value="product">Product</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {newIngredient.ingredient_type === 'raw_material' ? 'Raw Material' : 'Product'}
                    </label>
                    <select
                      name={newIngredient.ingredient_type === 'raw_material' ? 'raw_material_id' : 'product_id'}
                      value={newIngredient.ingredient_type === 'raw_material' ? newIngredient.raw_material_id : newIngredient.product_id}
                      onChange={handleIngredientChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    >
                      <option value="">Select {newIngredient.ingredient_type === 'raw_material' ? 'Raw Material' : 'Product'}</option>
                      {(newIngredient.ingredient_type === 'raw_material' ? rawMaterials : products).map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={newIngredient.quantity}
                      onChange={handleIngredientChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <select
                      name="unit"
                      value={newIngredient.unit}
                      onChange={handleIngredientChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="L">L</option>
                      <option value="ml">ml</option>
                      <option value="piece">piece</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <input
                      type="text"
                      name="notes"
                      value={newIngredient.notes}
                      onChange={handleIngredientChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAddIngredient(false)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddIngredient}
                    className="px-3 py-1 bg-primary text-white text-sm rounded-md hover:bg-primary-dark"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            {!isEditing ? (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
                <button
                  onClick={onEdit}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                  Edit Recipe
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onCancelEdit}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onSave(editedRecipe)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailsModal;