import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, AlertTriangle, Plus, Minus, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import Navbar from './navbar';
// Stock market data with realistic values
const STOCKS = [
  { 
    symbol: 'RELIANCE', 
    name: 'Reliance Industries Ltd', 
    sector: 'Energy',
    dayRange: { low: 2960.25, high: 3010.80 },
    yearRange: { low: 2180.00, high: 3120.50 }
  },
  { 
    symbol: 'SBI', 
    name: 'State Bank of India', 
    sector: 'Banking',
    dayRange: { low: 759.10, high: 771.80 },
    yearRange: { low: 520.30, high: 798.95 }
  },
  { 
    symbol: 'HDFC', 
    name: 'HDFC Bank Ltd', 
    sector: 'Banking',
    dayRange: { low: 1705.20, high: 1732.90 },
    yearRange: { low: 1425.35, high: 1920.80 }
  },
  { 
    symbol: 'BHARTIARTL', 
    name: 'Bharti Airtel Ltd', 
    sector: 'Telecom',
    dayRange: { low: 1308.40, high: 1328.75 },
    yearRange: { low: 890.25, high: 1394.20 }
  }
];

// Helper functions for localStorage
const saveBalance = (balance) => localStorage.setItem('userBalance', balance.toString());
const getBalance = () => parseFloat(localStorage.getItem('userBalance') || '10000');
const savePortfolio = (portfolio) => localStorage.setItem('userPortfolio', JSON.stringify(portfolio));
const getPortfolio = () => JSON.parse(localStorage.getItem('userPortfolio') || '[]');

const StockTradingApp = () => {
  const [balance, setBalance] = useState(getBalance());
  const [portfolio, setPortfolio] = useState(getPortfolio());
  const [stockPrices, setStockPrices] = useState({});
  const [notification, setNotification] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState('buy');

  // Fetch realistic stock prices
  const [priceChanges, setPriceChanges] = useState({});
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchCurrentPrices = () => {
    setIsLoading(true);
    
    // Simulating API call to fetch real-time stock prices
    const getRealisticStockPrices = () => {
      const result = {};
      
      // Base prices are from real market data (as of April 2025 simulation)
      const basePrices = {
        'RELIANCE': 2984.75,
        'SBI': 765.40,
        'HDFC': 1721.65,
        'BHARTIARTL': 1320.85
      };      
      return basePrices;
    };
    
    // Track old prices to calculate changes
    const oldPrices = {...stockPrices};
    const newPrices = getRealisticStockPrices();
    
    // Calculate price changes for visual indicators
    const changes = {};
    Object.keys(newPrices).forEach(symbol => {
      if (oldPrices[symbol]) {
        changes[symbol] = newPrices[symbol] - oldPrices[symbol];
      } else {
        changes[symbol] = 0;
      }
    });
    
    setStockPrices(newPrices);
    setPriceChanges(changes);
    setLastUpdated(new Date());
    setIsLoading(false);
  };
  
  useEffect(() => {
    // Initial price fetch
    fetchCurrentPrices();
    
    // Update prices every 15 seconds to simulate real-time market movement
    const interval = setInterval(() => {
      fetchCurrentPrices();
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  // Show notification message
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Open modal for buy/sell action
  const openModal = (stock, action) => {
    setSelectedStock(stock);
    setModalAction(action);
    setQuantity(1);
    setModalOpen(true);
  };

  // Handle buy transaction
  const handleBuy = () => {
    if (!selectedStock || quantity <= 0) {
      showNotification('Please select a valid quantity', 'error');
      return;
    }

    const price = stockPrices[selectedStock.symbol];
    const totalCost = price * quantity;

    if (totalCost > balance) {
      showNotification('Insufficient balance for this purchase', 'error');
      return;
    }

    // Update portfolio
    const existingPosition = portfolio.find(item => item.symbol === selectedStock.symbol);
    let newPortfolio = [...portfolio];

    if (existingPosition) {
      // Update existing position with average price
      const totalShares = existingPosition.quantity + quantity;
      const totalInvestment = (existingPosition.quantity * existingPosition.avgPrice) + (quantity * price);
      const newAvgPrice = totalInvestment / totalShares;

      newPortfolio = portfolio.map(item => 
        item.symbol === selectedStock.symbol 
          ? { ...item, quantity: totalShares, avgPrice: parseFloat(newAvgPrice.toFixed(2)) }
          : item
      );
    } else {
      // Add new position
      newPortfolio.push({
        symbol: selectedStock.symbol,
        name: selectedStock.name,
        quantity: quantity,
        avgPrice: price,
        sector: selectedStock.sector
      });
    }

    // Update balance and portfolio
    const newBalance = balance - totalCost;
    setBalance(newBalance);
    setPortfolio(newPortfolio);
    saveBalance(newBalance);
    savePortfolio(newPortfolio);

    showNotification(`Successfully purchased ${quantity} shares of ${selectedStock.symbol}`);
    setModalOpen(false);
  };

  // Handle sell transaction
  const handleSell = () => {
    if (!selectedStock || quantity <= 0) {
      showNotification('Please select a valid quantity', 'error');
      return;
    }

    const existingPosition = portfolio.find(item => item.symbol === selectedStock.symbol);
    
    if (!existingPosition || existingPosition.quantity < quantity) {
      showNotification('You do not own enough shares to sell', 'error');
      return;
    }

    const price = stockPrices[selectedStock.symbol];
    const saleProceeds = price * quantity;
    let newPortfolio = [...portfolio];

    if (existingPosition.quantity === quantity) {
      // Remove the position completely
      newPortfolio = portfolio.filter(item => item.symbol !== selectedStock.symbol);
    } else {
      // Reduce the position
      newPortfolio = portfolio.map(item => 
        item.symbol === selectedStock.symbol 
          ? { ...item, quantity: item.quantity - quantity }
          : item
      );
    }

    // Update balance and portfolio
    const newBalance = balance + saleProceeds;
    setBalance(newBalance);
    setPortfolio(newPortfolio);
    saveBalance(newBalance);
    savePortfolio(newPortfolio);

    showNotification(`Successfully sold ${quantity} shares of ${selectedStock.symbol}`);
    setModalOpen(false);
  };

  // Calculate portfolio value
  const calculatePortfolioValue = () => {
    return portfolio.reduce((total, position) => {
      const currentPrice = stockPrices[position.symbol] || 0;
      return total + (position.quantity * currentPrice);
    }, 0);
  };

  // Calculate total profit/loss
  const calculateTotalPnL = () => {
    return portfolio.reduce((total, position) => {
      const currentPrice = stockPrices[position.symbol] || 0;
      const positionValue = position.quantity * currentPrice;
      const costBasis = position.quantity * position.avgPrice;
      return total + (positionValue - costBasis);
    }, 0);
  };

  // Reset everything (for testing)
  const resetPortfolio = () => {
    if (window.confirm('This will reset your balance to ₩10,000 and clear your portfolio. Continue?')) {
      setBalance(10000);
      setPortfolio([]);
      saveBalance(10000);
      savePortfolio([]);
      showNotification('Portfolio has been reset', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
      {/* Header */}
      <Navbar/>

      {/* Notification */}
      {notification && (
        <div 
          className={`fixed top-16 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center ${
            notification.type === "error" ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          {notification.type === "error" ? (
            <AlertTriangle className="w-5 h-5 mr-2" />
          ) : (
            null
          )}
          <p>{notification.message}</p>
        </div>
      )}

      <main className="container mx-auto px-4 py-8 mt-12">
        {/* Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl">
            <h2 className="text-lg font-medium mb-2">Cash Balance</h2>
            <p className="text-2xl font-bold">₩{balance.toFixed(2)}</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl">
            <h2 className="text-lg font-medium mb-2">Portfolio Value</h2>
            <p className="text-2xl font-bold">₩{calculatePortfolioValue().toFixed(2)}</p>
          </div>
          
          <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl 
            ${calculateTotalPnL() > 0 ? 'text-green-400' : calculateTotalPnL() < 0 ? 'text-red-400' : ''}`}>
            <h2 className="text-lg font-medium mb-2 text-white">Total P&L</h2>
            <p className="text-2xl font-bold flex items-center">
              {calculateTotalPnL() > 0 ? '+' : ''}{calculateTotalPnL().toFixed(2)}
              <TrendingUp className={`ml-2 h-5 w-5 ${calculateTotalPnL() >= 0 ? 'rotate-0' : 'rotate-180'}`} />
            </p>
          </div>
        </div>

        {/* Available Stocks Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Available Stocks</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-4 px-6 text-left">Symbol</th>
                  <th className="py-4 px-6 text-left">Name</th>
                  <th className="py-4 px-6 text-right">Current Price</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {STOCKS.map((stock) => {
                  const priceChange = priceChanges[stock.symbol] || 0;
                  const priceChangeClass = 
                    priceChange > 0 ? 'text-green-400' : 
                    priceChange < 0 ? 'text-red-400' : '';
                  
                  return (
                    <tr key={stock.symbol} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-4 px-6 font-medium">{stock.symbol}</td>
                      <td className="py-4 px-6">{stock.name}</td>
                      <td className={`py-4 px-6 text-right ${priceChangeClass}`}>
                        <div className="flex items-center justify-end">
                          ₩{stockPrices[stock.symbol]?.toFixed(2) || 'Loading...'}
                          
                          {priceChange !== 0 && (
                            <span className="ml-2 flex items-center text-xs">
                              {priceChange > 0 ? (
                                <ArrowUp className="w-3 h-3 mr-1" />
                              ) : (
                                <ArrowDown className="w-3 h-3 mr-1" />
                              )}
                              {Math.abs(priceChange).toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          Day: ₩{stock.dayRange.low.toFixed(2)} - ₩{stock.dayRange.high.toFixed(2)}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => openModal(stock, 'buy')} 
                          className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md mr-2 inline-flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Buy
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Portfolio Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">My Portfolio</h2>
          {portfolio.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="mb-4 p-4 bg-indigo-900/50 rounded-lg border border-indigo-400/30">
                <h3 className="font-semibold mb-2 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Portfolio Performance Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-300">Total Investment</div>
                    <div className="text-lg font-bold">
                      ₩{portfolio.reduce((sum, pos) => sum + (pos.avgPrice * pos.quantity), 0).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-300">Current Value</div>
                    <div className="text-lg font-bold">
                      ₩{portfolio.reduce((sum, pos) => sum + ((stockPrices[pos.symbol] || 0) * pos.quantity), 0).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-300">Overall Return</div>
                    <div className={`text-lg font-bold flex items-center ${calculateTotalPnL() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {calculateTotalPnL() >= 0 ? '+' : ''}
                      ₩{calculateTotalPnL().toFixed(2)}
                      <span className="text-sm ml-2">
                        ({((calculateTotalPnL() / portfolio.reduce((sum, pos) => sum + (pos.avgPrice * pos.quantity), 0)) * 100).toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <table className="w-full bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="py-4 px-6 text-left">Symbol</th>
                    <th className="py-4 px-6 text-left">Name</th>
                    <th className="py-4 px-6 text-right">Quantity</th>
                    <th className="py-4 px-6 text-right">Avg. Price</th>
                    <th className="py-4 px-6 text-right">Current Price</th>
                    <th className="py-4 px-6 text-center">Status</th>
                    <th className="py-4 px-6 text-right">P&L</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((position) => {
                    const currentPrice = stockPrices[position.symbol] || 0;
                    const pnl = (currentPrice - position.avgPrice) * position.quantity;
                    const pnlPercent = ((currentPrice / position.avgPrice) - 1) * 100;
                    const isProfitable = currentPrice > position.avgPrice;
                    const isBreakEven = currentPrice === position.avgPrice;
                    
                    // Get stock details for additional info
                    const stockDetails = STOCKS.find(s => s.symbol === position.symbol);
                    
                    // Calculate position relative to day and year ranges
                    const dayRangePercent = stockDetails ? 
                      ((currentPrice - stockDetails.dayRange.low) / (stockDetails.dayRange.high - stockDetails.dayRange.low)) * 100 : 50;
                    
                    const yearRangePercent = stockDetails ? 
                      ((currentPrice - stockDetails.yearRange.low) / (stockDetails.yearRange.high - stockDetails.yearRange.low)) * 100 : 50;
                    
                    return (
                      <tr key={position.symbol} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-4 px-6 font-medium">{position.symbol}</td>
                        <td className="py-4 px-6">{position.name}</td>
                        <td className="py-4 px-6 text-right">{position.quantity}</td>
                        <td className="py-4 px-6 text-right">₩{position.avgPrice.toFixed(2)}</td>
                        <td className={`py-4 px-6 text-right ${
                          isProfitable ? 'text-green-400' : 
                          isBreakEven ? '' : 'text-red-400'
                        }`}>
                          <div className="flex items-center justify-end gap-2">
                            ₩{currentPrice.toFixed(2)}
                            {isProfitable && <ArrowUp className="w-4 h-4" />}
                            {!isBreakEven && !isProfitable && <ArrowDown className="w-4 h-4" />}
                          </div>
                          
                          {/* Day range position indicator */}
                          <div className="mt-1 w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500" 
                              style={{ width: `${Math.min(100, Math.max(0, dayRangePercent))}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Day: {dayRangePercent.toFixed(0)}%
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          {isProfitable ? (
                            <div className="flex flex-col items-center">
                              <span className="inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/30 text-green-300 border border-green-500/50">
                                PROFIT
                              </span>
                              <div className="text-xs mt-1 text-green-300">
                                Above buy price
                              </div>
                              <div className="mt-2 text-xs">
                                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                                Good time to sell
                              </div>
                            </div>
                          ) : isBreakEven ? (
                            <span className="inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium bg-gray-500/30 text-gray-300 border border-gray-500/50">
                              BREAK EVEN
                            </span>
                          ) : (
                            <div className="flex flex-col items-center">
                              <span className="inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/30 text-red-300 border border-red-500/50">
                                LOSS
                              </span>
                              <div className="text-xs mt-1 text-red-300">
                                Below buy price
                              </div>
                              <div className="mt-2 text-xs">
                                <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                                Consider holding
                              </div>
                            </div>
                          )}
                        </td>
                        <td className={`py-4 px-6 text-right ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          <div className="font-bold">
                            {pnl >= 0 ? '+' : ''}₩{pnl.toFixed(2)}
                          </div>
                          <div className="text-sm">
                            ({pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%)
                          </div>
                          
                          {/* Year range position indicator */}
                          <div className="mt-1 w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${pnl >= 0 ? 'bg-green-500' : 'bg-red-500'}`} 
                              style={{ width: `${Math.min(100, Math.max(0, yearRangePercent))}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            52-week: {yearRangePercent.toFixed(0)}%
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button 
                            onClick={() => openModal(position, 'sell')} 
                            className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md inline-flex items-center"
                          >
                            <Minus className="w-4 h-4 mr-1" />
                            Sell
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center">
              <p className="text-lg">Your portfolio is empty.</p>
              <p className="mt-2">Buy stocks to get started!</p>
            </div>
          )}
        </div>

        {/* Reset button for testing */}
        <div className="mt-8 text-center">
          <button 
            onClick={resetPortfolio}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md"
          >
            Reset Portfolio
          </button>
        </div>
      </main>

      {/* Transaction Modal */}
      {modalOpen && selectedStock && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-xl font-bold mb-4">
              {modalAction === 'buy' ? 'Buy' : 'Sell'} {selectedStock.name}
            </h3>
            
            <div className="mb-4">
              <p className="mb-2">Current Price: ₩{stockPrices[selectedStock.symbol]?.toFixed(2)}</p>
              {modalAction === 'sell' && (
                <p className="mb-2">
                  Shares Owned: {portfolio.find(p => p.symbol === selectedStock.symbol)?.quantity || 0}
                </p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block mb-2">Quantity:</label>
              <div className="flex items-center">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-l-md"
                >-</button>
                <input 
                  type="number" 
                  min="1" 
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                  className="bg-gray-800 text-center py-2 px-4 w-20 focus:outline-none border-t border-b border-gray-700"
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-r-md"
                >+</button>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-lg font-medium">
                Total: ₩{(stockPrices[selectedStock.symbol] * quantity).toFixed(2)}
              </p>
              {modalAction === 'buy' && (
                <p className={`text-sm ${(stockPrices[selectedStock.symbol] * quantity) > balance ? 'text-red-400' : ''}`}>
                  {(stockPrices[selectedStock.symbol] * quantity) > balance 
                    ? 'Insufficient balance for this transaction'
                    : `Remaining balance after purchase: ₩${(balance - (stockPrices[selectedStock.symbol] * quantity)).toFixed(2)}`
                  }
                </p>
              )}
            </div>
            
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setModalOpen(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              <button 
                onClick={modalAction === 'buy' ? handleBuy : handleSell}
                className={`${
                  modalAction === 'buy' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                } text-white py-2 px-4 rounded-md`}
                disabled={
                  modalAction === 'buy' 
                    ? (stockPrices[selectedStock.symbol] * quantity) > balance
                    : (portfolio.find(p => p.symbol === selectedStock.symbol)?.quantity || 0) < quantity
                }
              >
                Confirm {modalAction === 'buy' ? 'Purchase' : 'Sale'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockTradingApp;
