import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, AlertTriangle, ArrowUp, ArrowDown, RefreshCw, ChevronDown,ChevronUp, Briefcase, PieChart, Award, XCircle, Minus, CheckCircle, AlertCircle } from 'lucide-react';
import StockSearch from './StockSearch';
import Navbar from './navbar';

const Portfolio = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSection, setExpandedSection] = useState('portfolio');
  const [emailId, setEmailId] = useState(localStorage.getItem("userEmail")); // Get email from localStorage
  
  // State for sell modal
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchPortfolioData();
  }, []);



  
export const saveBalance = (balance) => {
  try {
    localStorage.setItem('userBalance', balance.toString());
    console.log('Balance saved to localStorage:', balance);
  } catch (error) {
    console.error('Error saving balance to localStorage:', error);
  }
};

export const getBalance = () => {
  try {
    const storedBalance = localStorage.getItem('userBalance');
    if (storedBalance === null) {
      return 10000; // Default initial balance
    }
    const parsedBalance = parseFloat(storedBalance);
    return isNaN(parsedBalance) ? 10000 : parsedBalance;
  } catch (error) {
    console.error('Error retrieving balance from localStorage:', error);
    return 10000;
  }
};

export const savePortfolio = (portfolio) => {
  try {
    localStorage.setItem('userPortfolio', JSON.stringify(portfolio));
    console.log('Portfolio saved to localStorage');
  } catch (error) {
    console.error('Error saving portfolio to localStorage:', error);
  }
};

export const getPortfolio = () => {
  try {
    const storedPortfolio = localStorage.getItem('userPortfolio');
    if (!storedPortfolio) {
      return [];
    }
    return JSON.parse(storedPortfolio);
  } catch (error) {
    console.error('Error retrieving portfolio from localStorage:', error);
    return [];
  }
};

  

  const fetchPortfolioData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}portfolio?email=${emailId}`
      );
      const data = response.data;
      setPortfolioData(data);
      setError(null);
    } catch (err) {
      setError('Error fetching portfolio data. Please try again later.');
      // For demo purposes, set mock data when API fails
      setPortfolioData({});
    } finally {
      setLoading(false);
    }
  };

  // Open sell modal with selected stock
  const openSellModal = (stock) => {
    setSelectedStock(stock);
    setSellQuantity(1);
    setSellModalOpen(true);
    setTransactionResult(null);
  };

  // Handle stock selling process
  const handleSellStock = async () => {
    if (!selectedStock || !emailId || sellQuantity <= 0) {
      return;
    }

    setIsProcessing(true);
    
    try {
      const response = await axios.post(process.env.REACT_APP_BACKEND_URL + "stock/sell", {
          email: emailId,
          symbol: selectedStock.symbol,
          quantity: parseInt(sellQuantity),
        });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to sell stock');
      }
      
      setTransactionResult({
        success: true,
        message: data.message,
        details: data.transaction,
        newBalance: data.newBalance,
        portfolioValue: data.portfolioValue
      });
      
      // Refresh portfolio data after successful transaction
      setTimeout(() => {
        fetchPortfolioData();
      }, 2000);
      
    } catch (error) {
      setTransactionResult({
        success: false,
        message: error.message || 'Failed to sell stock. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePurchaseSuccess = (data) => {
    // Show notification
    setNotification({
      message: data.message || 'Stock purchased successfully!',
      type: 'success'
    });
    
    // Refresh portfolio data
    fetchPortfolioData();
    
    // Clear notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const closeSellModal = () => {
    if (!isProcessing) {
      setSellModalOpen(false);
      setSelectedStock(null);
      setTransactionResult(null);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(value);
  };

  // Format percentage values
  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Get status color based on profit/loss
  const getStatusColor = (value) => {
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-gray-400';
  };

  // Get background color based on status
  const getStatusBgColor = (status) => {
    switch (status) {
      case 'Positive': return 'bg-green-100 text-green-800 border-green-300';
      case 'Negative': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="w-12 h-12 animate-spin text-indigo-300" />
          <p className="text-xl font-medium">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  if (error && !portfolioData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-md text-center border border-red-400/30">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Connection Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={fetchPortfolioData}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg flex items-center justify-center mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center ${
            notification.type === "error" ? "bg-red-500" : "bg-green-500"
          } text-white max-w-md`}>
            {notification.type === "error" ? (
              <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
            ) : (
              <TrendingUp className="w-5 h-5 mr-2 flex-shrink-0" />
            )}
            <p>{notification.message}</p>
          </div>
        )}
        
        {/* Email Input */}
        <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-auto flex-1">
            <input
              type="email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
          </div>
          <button
            onClick={fetchPortfolioData}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg flex items-center justify-center"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Portfolio
          </button>
        </div>

        {/* Stock Search Component */}
        <div className="mb-6">
          <StockSearch email={emailId} onSuccess={handlePurchaseSuccess} />
        </div>
        

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Balance Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-300 font-medium">Cash Balance</h3>
              <DollarSign className="w-5 h-5 text-indigo-300" />
            </div>
            <p className="text-2xl font-bold mt-2">{formatCurrency(portfolioData.balance || 0)}</p>
          </div>

          {/* Portfolio Value Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-300 font-medium">Portfolio Value</h3>
              <Briefcase className="w-5 h-5 text-indigo-300" />
            </div>
            <p className="text-2xl font-bold mt-2">{formatCurrency(portfolioData.totalValue || 0)}</p>
          </div>

          {/* Total Investment Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-300 font-medium">Total Investment</h3>
              <PieChart className="w-5 h-5 text-indigo-300" />
            </div>
            <p className="text-2xl font-bold mt-2">{formatCurrency(portfolioData.totalInvestment || portfolioData.totalValue || 0)}</p>
          </div>

          {/* Profit/Loss Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-300 font-medium">Total P&L</h3>
              <TrendingUp className="w-5 h-5 text-indigo-300" />
            </div>
            <div className="flex items-center mt-2">
              <p className={`text-2xl font-bold ${getStatusColor(portfolioData.insights?.totalProfitLoss || 0)}`}>
                {formatCurrency(portfolioData.insights?.totalProfitLoss || 0)}
              </p>
              <span className={`ml-2 text-sm ${getStatusColor(portfolioData.insights?.overallProfitLossPercentage || 0)}`}>
                {(portfolioData.insights?.overallProfitLossPercentage > 0) && '+'}
                {(portfolioData.insights?.overallProfitLossPercentage || 0).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Overview Card */}
        {portfolioData.insights && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 mb-6 overflow-hidden">
            <div 
              className="p-6 cursor-pointer flex justify-between items-center"
              onClick={() => toggleSection('overview')}
            >
              <h2 className="text-xl font-semibold flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Portfolio Overview
              </h2>
              {expandedSection === 'overview' ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
            
            {expandedSection === 'overview' && (
              <div className="p-6 pt-0 border-t border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Overall Status */}
                  <div className="flex flex-col">
                    <span className="text-gray-300 text-sm mb-1">Status</span>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      portfolioData.insights.overallStatus === 'Positive' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                      portfolioData.insights.overallStatus === 'Negative' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                      'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {portfolioData.insights.overallStatus}
                    </div>
                  </div>
                  
                  {/* Profitable/Loss Stocks */}
                  <div className="flex flex-col">
                    <span className="text-gray-300 text-sm mb-1">Stocks Performance</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span>Profit: {portfolioData.insights.profitableStocks}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span>Loss: {portfolioData.insights.lossStocks}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Total Worth */}
                  <div className="flex flex-col">
                    <span className="text-gray-300 text-sm mb-1">Total Worth</span>
                    <span className="text-xl font-bold">
                      {formatCurrency((portfolioData.balance || 0) + (portfolioData.totalValue || 0))}
                    </span>
                  </div>
                </div>
                
                {/* Best & Worst Performers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Best Performer */}
                  {portfolioData.insights.bestPerformer && (
                    <div className="bg-white/5 rounded-lg p-4 border border-green-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium flex items-center">
                          <Award className="w-4 h-4 mr-2 text-green-400" />
                          Best Performer
                        </h3>
                        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                          {portfolioData.insights.bestPerformer.symbol}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-400">Bought</span>
                          <p>{formatCurrency(portfolioData.insights.bestPerformer.boughtPrice)}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Current</span>
                          <p>{formatCurrency(portfolioData.insights.bestPerformer.currentPrice)}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">P&L</span>
                          <p className={getStatusColor(portfolioData.insights.bestPerformer.profitLoss)}>
                            {formatCurrency(portfolioData.insights.bestPerformer.profitLoss)}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">P&L %</span>
                          <p className={getStatusColor(portfolioData.insights.bestPerformer.profitLossPercentage)}>
                            {portfolioData.insights.bestPerformer.profitLossPercentage > 0 && '+'}
                            {portfolioData.insights.bestPerformer.profitLossPercentage.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Worst Performer */}
                  {portfolioData.insights.worstPerformer && (
                    <div className="bg-white/5 rounded-lg p-4 border border-red-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium flex items-center">
                          <XCircle className="w-4 h-4 mr-2 text-red-400" />
                          Worst Performer
                        </h3>
                        <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">
                          {portfolioData.insights.worstPerformer.symbol}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-400">Bought</span>
                          <p>{formatCurrency(portfolioData.insights.worstPerformer.boughtPrice)}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Current</span>
                          <p>{formatCurrency(portfolioData.insights.worstPerformer.currentPrice)}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">P&L</span>
                          <p className={getStatusColor(portfolioData.insights.worstPerformer.profitLoss)}>
                            {formatCurrency(portfolioData.insights.worstPerformer.profitLoss)}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">P&L %</span>
                          <p className={getStatusColor(portfolioData.insights.worstPerformer.profitLossPercentage)}>
                            {portfolioData.insights.worstPerformer.profitLossPercentage > 0 && '+'}
                            {portfolioData.insights.worstPerformer.profitLossPercentage.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Portfolio Holdings */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 mb-6 overflow-hidden">
          <div 
            className="p-6 cursor-pointer flex justify-between items-center"
            onClick={() => toggleSection('portfolio')}
          >
            <h2 className="text-xl font-semibold flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              Portfolio Holdings
            </h2>
            {expandedSection === 'portfolio' ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
          
          {expandedSection === 'portfolio' && (
            <div className="overflow-x-auto">
              {portfolioData.portfolio && portfolioData.portfolio.length > 0 ? (
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr className="text-sm text-gray-300">
                      <th className="py-3 px-6 text-left">Stock</th>
                      <th className="py-3 px-6 text-right">Quantity</th>
                      <th className="py-3 px-6 text-right">Bought Price</th>
                      <th className="py-3 px-6 text-right">Current Price</th>
                      <th className="py-3 px-6 text-right">Value</th>
                      <th className="py-3 px-6 text-right">P&L</th>
                      <th className="py-3 px-6 text-right">P&L %</th>
                      <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioData.portfolio.map((stock, index) => (
                      <tr 
                        key={stock.symbol} 
                        className={`${index !== portfolioData.portfolio.length - 1 ? 'border-b border-white/10' : ''} hover:bg-white/5`}
                      >
                        <td className="py-4 px-6 font-medium">{stock.symbol}</td>
                        <td className="py-4 px-6 text-right">{stock.quantity}</td>
                        <td className="py-4 px-6 text-right">{formatCurrency(stock.boughtPrice)}</td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end">
                            {formatCurrency(stock.currentPrice)}
                            {stock.currentPrice > stock.boughtPrice && (
                              <ArrowUp className="ml-1 w-4 h-4 text-green-400" />
                            )}
                            {stock.currentPrice < stock.boughtPrice && (
                              <ArrowDown className="ml-1 w-4 h-4 text-red-400" />
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right font-medium">{formatCurrency(stock.value)}</td>
                        <td className={`py-4 px-6 text-right font-medium ${getStatusColor(stock.profitLoss)}`}>
                          {stock.profitLoss > 0 && '+'}
                          {formatCurrency(stock.profitLoss)}
                        </td>
                        <td className={`py-4 px-6 text-right ${getStatusColor(stock.profitLossPercentage)}`}>
                          {stock.profitLossPercentage > 0 && '+'}
                          {stock.profitLossPercentage.toFixed(2)}%
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => openSellModal(stock)}
                            className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded inline-flex items-center text-sm transition-colors"
                          >
                            <Minus className="w-3 h-3 mr-1" />
                            Sell
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-300">Your portfolio is empty. Start investing to see your holdings here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sell Stock Modal */}
      {sellModalOpen && selectedStock && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeSellModal}
        >
          <div 
            className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-md p-6 shadow-xl animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold flex items-center mb-4">
              <Minus className="w-5 h-5 mr-2 text-red-400" />
              Sell {selectedStock.symbol} Stock
            </h3>

            {!transactionResult ? (
              <>
                <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-gray-400 text-sm">Current Price</span>
                      <p className="font-medium">{formatCurrency(selectedStock.currentPrice)}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">You Own</span>
                      <p className="font-medium">{selectedStock.quantity} shares</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Bought At</span>
                      <p className="font-medium">{formatCurrency(selectedStock.boughtPrice)}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">P&L Per Share</span>
                      <p className={`font-medium ${getStatusColor(selectedStock.currentPrice - selectedStock.boughtPrice)}`}>
                        {formatCurrency(selectedStock.currentPrice - selectedStock.boughtPrice)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-gray-300 text-sm block mb-2">Quantity to Sell</label>
                    <div className="flex">
                      <button 
                        className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-l-md"
                        onClick={() => setSellQuantity(Math.max(1, sellQuantity - 1))}
                        disabled={isProcessing}
                      >−</button>
                      <input
                        type="number"
                        min="1"
                        max={selectedStock.quantity}
                        value={sellQuantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          setSellQuantity(Math.min(selectedStock.quantity, Math.max(1, val)));
                        }}
                        className="bg-gray-800 border-y border-gray-700 text-center py-2 px-4 w-full focus:outline-none"
                        disabled={isProcessing}
                      />
                      <button 
                        className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-r-md"
                        onClick={() => setSellQuantity(Math.min(selectedStock.quantity, sellQuantity + 1))}
                        disabled={isProcessing}
                      >+</button>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400">Total Sale Amount:</span>
                      <span className="font-bold">{formatCurrency(selectedStock.currentPrice * sellQuantity)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Expected P&L:</span>
                      <span className={getStatusColor((selectedStock.currentPrice - selectedStock.boughtPrice) * sellQuantity)}>
                        {formatCurrency((selectedStock.currentPrice - selectedStock.boughtPrice) * sellQuantity)}
                        <span className="text-sm ml-1">
                          ({((selectedStock.currentPrice / selectedStock.boughtPrice - 1) * 100).toFixed(2)}%)
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeSellModal}
                    className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSellStock}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Minus className="w-4 h-4 mr-2" />
                        Confirm Sell
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className={`mb-6 p-4 rounded-lg ${
                  transactionResult.success 
                    ? 'bg-green-900/30 border border-green-700' 
                    : 'bg-red-900/30 border border-red-700'
                }`}>
                  <div className="flex items-start">
                    {transactionResult.success ? (
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium">
                        {transactionResult.success ? 'Transaction Successful' : 'Transaction Failed'}
                      </p>
                      <p className="text-sm mt-1">{transactionResult.message}</p>
                      
                      {transactionResult.success && transactionResult.details && (
                        <div className="mt-3 space-y-2 text-sm bg-gray-800/50 p-3 rounded">
                          <div className="flex justify-between">
                            <span>Stock:</span>
                            <span className="font-medium">{transactionResult.details.symbol}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Quantity:</span>
                            <span className="font-medium">{transactionResult.details.quantity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total:</span>
                            <span className="font-medium">{formatCurrency(transactionResult.details.total)}</span>
                          </div>
                        </div>
                      )}
                      
                      {transactionResult.success && (
                        <div className="mt-4 p-3 bg-indigo-900/30 border border-indigo-700 rounded">
                          <div className="text-sm mb-2 font-medium">Updated Account</div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-400">New Balance</span>
                              <p className="font-medium">{formatCurrency(transactionResult.newBalance)}</p>
                            </div>
                            <div>
                              <span className="text-gray-400">Portfolio Value</span>
                              <p className="font-medium">{formatCurrency(transactionResult.portfolioValue)}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={closeSellModal}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                  >
                    {transactionResult.success ? "Done" : "Close"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
