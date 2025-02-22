import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ArrowUpRight, DollarSign, MinusCircle, PlusCircle } from 'lucide-react';

const QuantityModal = ({ stock, onConfirm, onClose, mode, availableBalance }) => {
  const [quantity, setQuantity] = useState(1);
  const totalPrice = (stock.price * quantity).toFixed(2);
  const maxBuyQuantity = Math.floor(availableBalance / stock.price);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    
    if (mode === 'sell' && newQuantity > stock.quantity) {
      setQuantity(stock.quantity);
      return;
    }
    
    if (mode === 'buy' && newQuantity > maxBuyQuantity) {
      setQuantity(maxBuyQuantity);
      return;
    }
    
    setQuantity(newQuantity);
  };

  const isConfirmDisabled = (mode === 'buy' && parseFloat(totalPrice) > availableBalance) || 
                          (mode === 'sell' && quantity > stock.quantity);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-4">
          {mode === 'buy' ? 'Buy' : 'Sell'} {stock.name}
        </h3>
        
        <div className="space-y-4">
          {mode === 'buy' && (
            <div className="flex items-center justify-between">
              <span className="text-white/70">Available Balance:</span>
              <span className="text-white font-medium">₹ {availableBalance.toFixed(2)}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-white/70">Current Price:</span>
            <span className="text-white font-medium">₹ {stock.price}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white/70">Quantity:</span>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => handleQuantityChange(quantity - 1)}
                className="text-white hover:text-blue-400 transition-colors"
              >
                <MinusCircle className="w-5 h-5" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-center"
                min="1"
                max={mode === 'buy' ? maxBuyQuantity : stock.quantity}
              />
              <button 
                onClick={() => handleQuantityChange(quantity + 1)}
                className="text-white hover:text-blue-400 transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            </div>
          </div>

          {mode === 'sell' && (
            <div className="flex items-center justify-between">
              <span className="text-white/70">Available Quantity:</span>
              <span className="text-white font-medium">{stock.quantity}</span>
            </div>
          )}

          {mode === 'buy' && (
            <div className="flex items-center justify-between">
              <span className="text-white/70">Max Buyable Quantity:</span>
              <span className="text-white font-medium">{maxBuyQuantity}</span>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <span className="text-white/70">Total {mode === 'buy' ? 'Cost' : 'Value'}:</span>
            <span className="text-white font-bold">₹ {totalPrice}</span>
          </div>

          {mode === 'buy' && parseFloat(totalPrice) > availableBalance && (
            <p className="text-red-400 text-sm">Insufficient balance for this purchase</p>
          )}
        </div>

        <div className="flex space-x-4 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-xl text-sm font-medium bg-white/10 text-white hover:bg-white/20 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(quantity, totalPrice)}
            disabled={isConfirmDisabled}
            className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              ${isConfirmDisabled 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          >
            Confirm {mode === 'buy' ? 'Purchase' : 'Sale'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Holdings = ({ data, mail, props }) => {
  const [availableBalance, setAvailableBalance] = useState(1497); // Example balance
  const [holdings, setHoldings] = useState([
    {
        id: 1,
        name: "Hindalco Industries Ltd.",
        symbol: "HINDALCO",
        quantity: 10,
        price: 652,
        value: 6521,
      },
      {
        id: 2,
        name: "Tata Steel Ltd.",
        symbol: "TATASTEEL",
        quantity: 5,
        price: 140,
        value: 703,
      },
      {
        id: 3,
        name: "Eicher Motors Ltd.",
        symbol: "EICHERMOT",
        quantity: 7,
        price: 4968,
        value: 34776,
      },
      {
        id: 4,
        name: "Larsen & Toubro Ltd.",
        symbol: "LT",
        quantity: 8,
        price: 3315,
        value: 26524,
      }
    ]);
  
  const [selectedStock, setSelectedStock] = useState(null);
  const [transactionMode, setTransactionMode] = useState(null);

  const handleBuyStock = (stock) => {
    setSelectedStock(stock);
    setTransactionMode('buy');
  };

  const handleSellStock = (stock) => {
    setSelectedStock(stock);
    setTransactionMode('sell');
  };

  const handleConfirmTransaction = (quantity, totalPrice) => {
    if (selectedStock) {
      if (transactionMode === 'buy') {
        // Check if user has enough balance
        if (parseFloat(totalPrice) > availableBalance) {
          return;
        }
        // Deduct from balance
        setAvailableBalance(prev => prev - parseFloat(totalPrice));
      } else {
        // Add to balance for sell
        setAvailableBalance(prev => prev + parseFloat(totalPrice));
      }

      setHoldings(holdings.map(holding => {
        if (holding.id === selectedStock.id) {
          const newQuantity = transactionMode === 'buy' 
            ? holding.quantity + quantity 
            : holding.quantity - quantity;
          
          return {
            ...holding,
            quantity: newQuantity,
            value: newQuantity * holding.price
          };
        }
        return holding;
      }));
      setSelectedStock(null);
      setTransactionMode(null);
    }
  };

  const closeModal = () => {
    setSelectedStock(null);
    setTransactionMode(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden"
    >
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Your Holdings</h2>
          <div className="flex items-center space-x-2">
            <span className="text-white/70">Available Balance:</span>
            <span className="text-white font-bold">₹ {availableBalance.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Asset</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Symbol</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Quantity</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Value</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Actions</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding, index) => (
              <motion.tr
                key={holding.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  border-b border-white/10 
                  ${index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}
                  hover:bg-white/10 transition-colors
                `}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-white font-medium">{holding.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-green-400 font-medium">{holding.symbol}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-white">{holding.quantity}</span>
                </td>
                <td className="px-15 py-4">
                  <div className="flex items-center space-x-1">
                    <span className="text-white font-medium">₩ {holding.price}</span>
                  </div>
                </td>
                <td className="px-15 py-4 min-w-[150px]">
                    <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">
                        ₩ {holding.value}
                        </span>
                        <ArrowUpRight className="w-5 h-5 text-green-400" />
                    </div>
                    </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleBuyStock(holding)}
                      disabled={availableBalance < holding.price}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                        ${availableBalance < holding.price 
                          ? 'bg-gray-500 cursor-not-allowed' 
                          : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                    >
                      Buy
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSellStock(holding)}
                      disabled={holding.quantity === 0}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                        ${holding.quantity === 0 
                          ? 'bg-gray-500 cursor-not-allowed' 
                          : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                    >
                      Sell
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedStock && (
          <QuantityModal
            stock={selectedStock}
            onConfirm={handleConfirmTransaction}
            onClose={closeModal}
            mode={transactionMode}
            availableBalance={availableBalance}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Holdings;
