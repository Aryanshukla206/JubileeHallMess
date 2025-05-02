import React from 'react';
import { Minus, Plus } from 'lucide-react';

const QuantitySelector = ({ name, quantity, setQuantity, max, min = 0, disabled = false }) => {
  // Define the maximum allowed quantity for each dish type if not provided
  const getDefaultMax = () => {
    switch (name.toLowerCase()) {
      case 'rice': return 5;
      case 'dal': return 3;
      case 'sabji': return 3;
      case 'roti': return 6;
      default: return 3;
    }
  };

  const maxQuantity = max || getDefaultMax();

  const handleDecrease = () => {
    if (quantity > min) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="w-20 text-gray-700">{name}</span>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleDecrease}
          disabled={quantity <= min || disabled}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors 
            ${disabled 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
        >
          <Minus size={16} />
        </button>
        
        <span className="w-10 text-center">{quantity}</span>
        
        <button
          type="button"
          onClick={handleIncrease}
          disabled={quantity >= maxQuantity || disabled}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors 
            ${disabled 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;