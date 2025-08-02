import React, { useState } from 'react';
import { format } from 'date-fns';

const BatchDetailsModal = ({ batch, onClose, onStatusChange, onComplete }) => {
  const [actualQuantity, setActualQuantity] = useState(batch.actual_quantity || '');
  const [showCompleteForm, setShowCompleteForm] = useState(false);

  const handleComplete = () => {
    if (!actualQuantity || parseFloat(actualQuantity) <= 0) {
      return;
    }
    onComplete(batch.id, parseFloat(actualQuantity));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Batch Details: {batch.batch_number}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Recipe</h4>
              <p className="text-gray-900">{batch.recipe_name}</p>
              
              <h4 className="text-sm font-medium text-gray-500 mt-4 mb-2">Product</h4>
              <p className="text-gray-900">{batch.product_name}</p>
              
              <h4 className="text-sm font-medium text-gray-500 mt-4 mb-2">Supervisor</h4>
              <p className="text-gray-900">{batch.supervisor_name || 'Not assigned'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
              <p className="text-gray-900 capitalize">{batch.status.replace('_', ' ')}</p>
              
              <h4 className="text-sm font-medium text-gray-500 mt-4 mb-2">Planned Quantity</h4>
              <p className="text-gray-900">{batch.planned_quantity}</p>
              
              <h4 className="text-sm font-medium text-gray-500 mt-4 mb-2">Actual Quantity</h4>
              <p className="text-gray-900">{batch.actual_quantity || 'Not completed'}</p>
              
              <h4 className="text-sm font-medium text-gray-500 mt-4 mb-2">Start Date</h4>
              <p className="text-gray-900">{format(new Date(batch.start_date), 'MMM dd, yyyy HH:mm')}</p>
              
              {batch.end_date && (
                <>
                  <h4 className="text-sm font-medium text-gray-500 mt-4 mb-2">End Date</h4>
                  <p className="text-gray-900">{format(new Date(batch.end_date), 'MMM dd, yyyy HH:mm')}</p>
                </>
              )}
            </div>
          </div>
          
          {batch.ingredients && batch.ingredients.length > 0 && (
            <div className="mb-8">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Ingredients Used</h4>
              <div className="border rounded-md divide-y">
                {batch.ingredients.map((ingredient, index) => (
                  <div key={index} className="p-3">
                    <p className="font-medium">{ingredient.name}</p>
                    <p className="text-sm text-gray-500">
                      {ingredient.quantity_used} {ingredient.unit}
                      {ingredient.stock_date && ` (from stock on ${format(new Date(ingredient.stock_date), 'MMM dd, yyyy')})`}
                    </p>
                    {ingredient.notes && <p className="text-sm text-gray-500 mt-1">{ingredient.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {batch.notes && (
            <div className="mb-8">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Notes</h4>
              <p className="text-gray-900 whitespace-pre-line">{batch.notes}</p>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            {batch.status === 'planned' && (
              <button
                onClick={() => onStatusChange(batch.id, 'in_progress')}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
              >
                Start Production
              </button>
            )}
            
            {batch.status === 'in_progress' && !showCompleteForm && (
              <button
                onClick={() => setShowCompleteForm(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Complete Batch
              </button>
            )}
            
            {showCompleteForm && (
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={actualQuantity}
                  onChange={(e) => setActualQuantity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Actual quantity"
                  step="0.01"
                  min="0"
                />
                <button
                  onClick={handleComplete}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowCompleteForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            )}
            
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchDetailsModal;