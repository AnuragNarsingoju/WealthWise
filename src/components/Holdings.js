import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ArrowUpRight, DollarSign } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

const Holdings = () => {
  const [markedStocks, setMarkedStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);

  const holdings = [
    { id: 1, name: 'Apple Inc.', symbol: 'AAPL', quantity: 10, price: 150.25, value: 1502.50 },
    { id: 2, name: 'Tesla Inc.', symbol: 'TSLA', quantity: 5, price: 700.50, value: 3502.50 },
    { id: 3, name: 'SPDR S&P 500 ETF', symbol: 'SPY', quantity: 20, price: 450.75, value: 9015.00 },
   
  ];

  const handleBuyStock = (stock) => {
    setSelectedStock(stock);
  };

  const confirmPurchase = () => {
    if (selectedStock) {
      setMarkedStocks([...markedStocks, selectedStock.id]);
      setSelectedStock(null);
    }
  };

  const closeModal = () => {
    setSelectedStock(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden"
    >
      <div className="overflow-x-auto ">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Asset</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Symbol</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Quantity</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Value</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Action</th>
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
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <span className="text-white font-medium">{holding.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-blue-400 font-medium">{holding.symbol}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-white">{holding.quantity}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <span className="text-white font-medium">₹ {holding.price.toFixed(2)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    
                    <span className="text-white font-medium">₹ {holding.value.toFixed(2)}</span>
                    <ArrowUpRight className="w-4 h-4 text-green-400" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBuyStock(holding)}
                    disabled={markedStocks.includes(holding.id)}
                    className={`
                      px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                      ${markedStocks.includes(holding.id)
                        ? 'bg-white/20 text-white/50 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-blue-500/25'
                      }
                    `}
                  >
                    {markedStocks.includes(holding.id) ? 'Bought' : 'Buy'}
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedStock && (
          <ConfirmationModal
            stock={selectedStock}
            onConfirm={confirmPurchase}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Holdings;
