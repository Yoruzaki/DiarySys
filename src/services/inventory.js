const API_URL = 'http://localhost:5000/api/inventory';

export const getRawMaterialStock = async () => {
  const response = await fetch(`${API_URL}/raw-materials/stock`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch raw material stock');
  }
  
  return await response.json();
};

export const getProductStock = async () => {
  const response = await fetch(`${API_URL}/products/stock`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch product stock');
  }
  
  return await response.json();
};

export const getRawMaterialMovements = async (materialId, limit = 100) => {
  const response = await fetch(`${API_URL}/raw-materials/movements?material_id=${materialId}&limit=${limit}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch raw material movements');
  }
  
  return await response.json();
};

export const getProductMovements = async (productId, limit = 100) => {
  const response = await fetch(`${API_URL}/products/movements?product_id=${productId}&limit=${limit}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch product movements');
  }
  
  return await response.json();
};

export const addRawMaterialMovement = async (movementData) => {
  const response = await fetch(`${API_URL}/raw-materials/movements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(movementData),
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to add raw material movement');
  }
  
  return await response.json();
};

export const addProductMovement = async (movementData) => {
  const response = await fetch(`${API_URL}/products/movements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(movementData),
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to add product movement');
  }
  
  return await response.json();
};

export const updateRawMaterialLevels = async (materialId, levels) => {
  const response = await fetch(`${API_URL}/raw-materials/${materialId}/update-levels`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(levels),
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to update raw material levels');
  }
  
  return await response.json();
};

export const updateProductLevels = async (productId, levels) => {
  const response = await fetch(`${API_URL}/products/${productId}/update-levels`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(levels),
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to update product levels');
  }
  
  return await response.json();
};
export const addRawMaterial = async (materialData) => {
  const response = await fetch(`${API_URL}/raw-materials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(materialData),
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to add raw material');
  }
  
  return await response.json();
};

export const addProduct = async (productData) => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to add product');
  }
  
  return await response.json();
};
export const getSuppliersForInventory = async () => {
  const response = await fetch(`${API_URL}/suppliers`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch suppliers');
  }
  
  return await response.json();
};

export const getClientsForInventory = async () => {
  const response = await fetch(`${API_URL}/clients`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch clients');
  }
  
  return await response.json();
};