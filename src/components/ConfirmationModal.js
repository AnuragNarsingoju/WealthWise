import React, { useState } from "react";
import { X } from "lucide-react";

const ConfirmationModal = ({ 
  isOpen, 
  stock, 
  onConfirm, 
  onClose, 
  action = "buy", 
  currentPrice
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  if (!isOpen || !stock) return null;
  
  // Calculate total cost based on quantity and action type
  const totalCost = (action === "buy" ? currentPrice : stock.boughtPrice) * quantity;
  const potentialProfit = action === "sell" ? (currentPrice - stock.boughtPrice) * quantity : 0;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    await onConfirm(stock, quantity, totalCost);
    
    setIsProcessing(false);
    setQuantity(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">
            {action === "buy" ? "Buy Stock" : "Sell Stock"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-lg">{stock.symbol}</h4>
              {stock.name && <p className="text-gray-600">{stock.name}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <p className="mt-1 font-medium">
                  ${action === "buy" ? currentPrice?.toFixed(2) : stock.boughtPrice?.toFixed(2)}
                </p>
              </div>
              
              {action === "sell" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Current Price
                  </label>
                  <p className="mt-1 font-medium">
                    ${currentPrice?.toFixed(2)}
                  </p>
                </div>
              )}
              
              {action === "sell" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Available
                  </label>
                  <p className="mt-1 font-medium">
                    {stock.quantity} shares
                  </p>
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                min={1}
                max={action === "sell" ? stock.quantity : undefined}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total {action === "buy" ? "Cost" : "Value"}
              </label>
              <p className="mt-1 text-lg font-bold">${totalCost.toFixed(2)}</p>
              
              {action === "sell" && potentialProfit !== 0 && (
                <p className={`text-sm font-medium ${potentialProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {potentialProfit > 0 ? 'Profit: ' : 'Loss: '}
                  ${Math.abs(potentialProfit).toFixed(2)}
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                action === "buy" 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-red-600 hover:bg-red-700"
              }`}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : action === "buy" ? "Buy" : "Sell"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmationModal;
