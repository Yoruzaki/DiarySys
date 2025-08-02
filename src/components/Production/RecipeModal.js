import React, { useState } from 'react';

const RecipeModal = ({ products, rawMaterials, onClose, onSave }) => {
  const [recipeData, setRecipeData] = useState({
    name: '',
    product_id: '',
    description: '',
    instructions: '',
    yield_quantity: '',
    yield_unit: 'kg',
    ingredients: []
  });
  
  const [newIngredient, setNewIngredient] = useState({
    ingredient_type: 'raw_material',
    raw_material_id: '',
    product_id: '',
    quantity: '',
    unit: 'kg',
    notes: ''
  });
  
  const [showIngredientForm, setShowIngredientForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [ingredientError, setIngredientError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipeData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleIngredientChange = (e) => {
    const { name, value } = e.target;
    
    // Clear any existing ingredient error
    if (ingredientError) setIngredientError('');
    
    // When ingredient type changes, clear the other ID
    if (name === 'ingredient_type') {
      setNewIngredient(prev => ({
        ...prev,
        [name]: value,
        raw_material_id: value === 'raw_material' ? prev.raw_material_id : '',
        product_id: value === 'product' ? prev.product_id : '',
        // Reset unit when type changes
        unit: 'kg'
      }));
    } else {
      setNewIngredient(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateRecipe = () => {
    const errors = {};
    let isValid = true;

    if (!recipeData.name.trim()) {
      errors.name = 'Recipe name is required';
      isValid = false;
    }

    if (!recipeData.product_id) {
      errors.product_id = 'Product is required';
      isValid = false;
    }

    if (!recipeData.yield_quantity || isNaN(recipeData.yield_quantity) || parseFloat(recipeData.yield_quantity) <= 0) {
      errors.yield_quantity = 'Valid yield quantity is required';
      isValid = false;
    }

    if (recipeData.ingredients.length === 0) {
      errors.ingredients = 'At least one ingredient is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const validateIngredient = () => {
    if (!newIngredient.quantity || isNaN(newIngredient.quantity) || parseFloat(newIngredient.quantity) <= 0) {
      setIngredientError('Valid quantity is required');
      return false;
    }

    if (newIngredient.ingredient_type === 'raw_material' && !newIngredient.raw_material_id) {
      setIngredientError('Raw material is required');
      return false;
    }

    if (newIngredient.ingredient_type === 'product' && !newIngredient.product_id) {
      setIngredientError('Product is required');
      return false;
    }

    return true;
  };

  const handleAddIngredient = () => {
    if (!validateIngredient()) return;
    
    // Create a clean ingredient object with only the relevant ID
    const ingredientToAdd = {
      ingredient_type: newIngredient.ingredient_type,
      quantity: parseFloat(newIngredient.quantity),
      unit: newIngredient.unit,
      notes: newIngredient.notes
    };
    
    // Add the correct ID based on type
    if (newIngredient.ingredient_type === 'raw_material') {
      ingredientToAdd.raw_material_id = parseInt(newIngredient.raw_material_id);
    } else {
      ingredientToAdd.product_id = parseInt(newIngredient.product_id);
    }
    
    setRecipeData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, ingredientToAdd]
    }));
    
    // Reset the form
    setNewIngredient({
      ingredient_type: 'raw_material',
      raw_material_id: '',
      product_id: '',
      quantity: '',
      unit: 'kg',
      notes: ''
    });
    
    setShowIngredientForm(false);
    setIngredientError('');
  };

  const handleRemoveIngredient = (index) => {
    setRecipeData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
    
    // Clear ingredients error if this was the last one
    if (recipeData.ingredients.length === 1 && formErrors.ingredients) {
      setFormErrors(prev => ({ ...prev, ingredients: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateRecipe()) return;
    
    // Prepare the data for submission
    const submissionData = {
      ...recipeData,
      yield_quantity: parseFloat(recipeData.yield_quantity),
      product_id: parseInt(recipeData.product_id)
    };
    
    onSave(submissionData);
  };

  const getAvailableUnits = () => {
    if (newIngredient.ingredient_type === 'raw_material' && newIngredient.raw_material_id) {
      const material = rawMaterials.find(rm => rm.id === parseInt(newIngredient.raw_material_id));
      return material ? [material.unit, ...['kg', 'g', 'L', 'ml', 'piece']] : ['kg', 'g', 'L', 'ml', 'piece'];
    }
    
    if (newIngredient.ingredient_type === 'product' && newIngredient.product_id) {
      const product = products.find(p => p.id === parseInt(newIngredient.product_id));
      return product ? [product.unit, ...['kg', 'g', 'L', 'ml', 'piece']] : ['kg', 'g', 'L', 'ml', 'piece'];
    }
    
    return ['kg', 'g', 'L', 'ml', 'piece'];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Add New Recipe</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipe Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={recipeData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                  required
                />
                {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product *
                </label>
                <select
                  name="product_id"
                  value={recipeData.product_id}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.product_id ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                  required
                >
                  <option value="">Select Product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                {formErrors.product_id && <p className="mt-1 text-sm text-red-600">{formErrors.product_id}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yield Quantity *
                </label>
                <input
                  type="number"
                  name="yield_quantity"
                  value={recipeData.yield_quantity}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.yield_quantity ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                  step="0.01"
                  min="0.01"
                  required
                />
                {formErrors.yield_quantity && <p className="mt-1 text-sm text-red-600">{formErrors.yield_quantity}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yield Unit *
                </label>
                <select
                  name="yield_unit"
                  value={recipeData.yield_unit}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={recipeData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions
                </label>
                <textarea
                  name="instructions"
                  value={recipeData.instructions}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-700">Ingredients *</h4>
                <button
                  type="button"
                  onClick={() => setShowIngredientForm(true)}
                  className="px-3 py-1 bg-primary text-white text-sm rounded-md hover:bg-primary-dark"
                >
                  Add Ingredient
                </button>
              </div>
              
              {formErrors.ingredients && <p className="mb-2 text-sm text-red-600">{formErrors.ingredients}</p>}
              
              {recipeData.ingredients.length === 0 ? (
                <p className="text-sm text-gray-500">No ingredients added yet</p>
              ) : (
                <div className="border rounded-md divide-y">
                  {recipeData.ingredients.map((ingredient, index) => (
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
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {showIngredientForm && (
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-4">Add New Ingredient</h4>
                
                {ingredientError && <p className="mb-2 text-sm text-red-600">{ingredientError}</p>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ingredient Type *
                    </label>
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
                      {newIngredient.ingredient_type === 'raw_material' ? 'Raw Material *' : 'Product *'}
                    </label>
                    <select
                      name={newIngredient.ingredient_type === 'raw_material' ? 'raw_material_id' : 'product_id'}
                      value={newIngredient.ingredient_type === 'raw_material' ? newIngredient.raw_material_id : newIngredient.product_id}
                      onChange={handleIngredientChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      required
                    >
                      <option value="">Select {newIngredient.ingredient_type === 'raw_material' ? 'Raw Material' : 'Product'}</option>
                      {(newIngredient.ingredient_type === 'raw_material' ? rawMaterials : products).map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.unit})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={newIngredient.quantity}
                      onChange={handleIngredientChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      step="0.01"
                      min="0.01"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit *
                    </label>
                    <select
                      name="unit"
                      value={newIngredient.unit}
                      onChange={handleIngredientChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      required
                    >
                      {getAvailableUnits().map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
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
                    type="button"
                    onClick={() => {
                      setShowIngredientForm(false);
                      setIngredientError('');
                    }}
                    className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="px-3 py-1 bg-primary text-white text-sm rounded-md hover:bg-primary-dark"
                  >
                    Add Ingredient
                  </button>
                </div>
              </div>
            )}
            
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
                Save Recipe
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;