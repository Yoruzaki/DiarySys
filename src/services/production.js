const API_URL = 'http://localhost:5000/api/production';

export const getRecipes = async () => {
  const response = await fetch(`${API_URL}/recipes`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }
  
  return await response.json();
};

export const getRecipeDetails = async (recipeId) => {
  const response = await fetch(`${API_URL}/recipes/${recipeId}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch recipe details');
  }
  
  return await response.json();
};

export const addRecipe = async (recipeData) => {
  const response = await fetch(`${API_URL}/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipeData),
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to add recipe');
  }
  
  return await response.json();
};

export const addRecipeIngredient = async (recipeId, ingredientData) => {
  const response = await fetch(`${API_URL}/recipes/${recipeId}/ingredients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ingredientData),
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to add recipe ingredient');
  }
  
  return await response.json();
};

export const getBatches = async () => {
  const response = await fetch(`${API_URL}/batches`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch batches');
  }
  
  return await response.json();
};

export const getBatchDetails = async (batchId) => {
  const response = await fetch(`${API_URL}/batches/${batchId}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch batch details');
  }
  
  return await response.json();
};

export const createBatch = async (batchData) => {
  const response = await fetch(`${API_URL}/batches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(batchData),
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to create batch');
  }
  
  return await response.json();
};

export const updateBatchStatus = async (batchId, status) => {
  const response = await fetch(`${API_URL}/batches/${batchId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to update batch status');
  }
  
  return await response.json();
};

export const completeBatch = async (batchId, actualQuantity) => {
  const response = await fetch(`${API_URL}/batches/${batchId}/complete`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ actual_quantity: actualQuantity }),
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to complete batch');
  }
  
  return await response.json();
};

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  return await response.json();
};

export const getRawMaterials = async () => {
  const response = await fetch(`${API_URL}/raw-materials`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch raw materials');
  }
  
  return await response.json();
};

export const getEmployees = async () => {
  const response = await fetch(`${API_URL}/employees`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch employees');
  }
  
  return await response.json();
};