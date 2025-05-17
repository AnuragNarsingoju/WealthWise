import React, { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, DollarSign, AlertTriangle, ArrowRight, ChevronDown, ChevronUp, X, Loader, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

const StockSearch = ({ email, onSuccess }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showTrending, setShowTrending] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const searchRef = useRef(null);
  
  // Example trending stocks (replace with actual trending data if available)
  const trendingStocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.' },
    { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.' },
    { symbol: 'INFY', name: 'Infosys Ltd.' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.' },
    { symbol: 'SBIN', name: 'State Bank of India' }
  ];

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  // Search for stocks by symbol
  const searchStock = async () => {
    if (!searchTerm.trim()) {
      setShowTrending(true);
      setSearchResults([]);
      setShowResults(true);
      return;
    }
    
    setLoading(true);
    setError(null);
    setShowTrending(false);
    
    try {
      // For demo purposes, we'll simulate a search result
      // In a real app, you would call an API endpoint to search for stocks
      const simulatedResults = trendingStocks.filter(
        stock => stock.symbol.includes(searchTerm.toUpperCase()) || 
                stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setSearchResults(simulatedResults);
      setShowResults(true);
    } catch (err) {
      setError('Failed to search for stocks. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Get stock price
  const getStockPrice = async (symbol) => {
    setLoading(true);
    setError(null);
    
    try {
       const getCookie = Cookies.get('sessionToken');
       const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}stock/price?symbol=${symbol}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch stock price');
      }
      
      const data = await response.json();
      setSelectedStock(data);
      setShowResults(false);
    } catch (err) {
      setError('Error fetching stock price. Please try again.');
      // For demo purposes, set mock data
      setSelectedStock({
        symbol: symbol,
        name: trendingStocks.find(s => s.symbol === symbol)?.name || symbol,
        price: Math.random() * 2000 + 500 // Random price between 500 and 2500
      });
    } finally {
      setLoading(false);
    }
  };

  // Buy stock
  const buyStock = async () => {
    if (!email || !selectedStock || quantity <= 0) {
      setNotification({
        type: 'error',
        message: 'Please enter a valid email, select a stock, and specify a quantity'
      });
      return;
    }
    
    setPurchasing(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5001/api/stock/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          symbol: selectedStock.symbol,
          quantity
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to buy stock');
      }
      
      setNotification({
        type: 'success',
        message: `Successfully purchased ${quantity} shares of ${selectedStock.symbol}`
      });
      
      // Reset the form
      setSelectedStock(null);
      setQuantity(1);
      
      // Notify parent component that purchase was successful
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to buy stock. Please try again.'
      });
    } finally {
      setPurchasing(false);
    }
  };

  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(value);
  };

  // Handle notification timeout
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Handle pressing Enter in search input
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchStock();
    }
  };

  return (

<div className="w-full bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 relative" ref={searchRef} style={{ zIndex: 40 }}>    {/* Notification */}
      {notification && (
        <div className={`absolute top-0 right-0 m-4 p-3 rounded-lg shadow-lg z-50 flex items-center max-w-md ${
          notification.type === 'error' ? 'bg-red-500/90' : 'bg-green-500/90'
        } text-white`}>
          {notification.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
          ) : (
            <ShoppingCart className="w-5 h-5 mr-2 flex-shrink-0" />
          )}
          <p>{notification.message}</p>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Search className="w-5 h-5 mr-2" />
        Search & Buy Stocks
      </h2>
      
      {/* Search Input Section */}
      <div className="mb-6">
        <div className="flex items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onClick={() => {
                if (searchTerm.trim() === '') {
                  setShowTrending(true);
                  setShowResults(true);
                }
              }}
              className="w-full bg-white/5 backdrop-blur-sm rounded-lg border border-white/20 py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
              placeholder="Search by symbol or company name"
            />
            {searchTerm && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSearchResults([]);
                  setShowResults(false);
                  setShowTrending(false);
                }}
                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <button
            onClick={searchStock}
            className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Search Results Dropdown */}
        {showResults && (
  <div className="absolute z-50 left-0 right-0 bg-gray-800/95 backdrop-blur-sm mt-1 rounded-lg border border-white/20 shadow-xl max-h-80 overflow-y-auto mx-0">
            {loading ? (
              <div className="p-4 flex justify-center">
                <Loader className="w-6 h-6 animate-spin text-indigo-400" />
              </div>
            ) : error ? (
              <div className="p-4 text-red-400">{error}</div>
            ) : searchResults.length > 0 ? (
              <ul>
                {searchResults.map((stock) => (
                  <li 
                    key={stock.symbol}
                    className="border-b border-white/10 last:border-b-0"
                  >
                    <button
                      onClick={() => getStockPrice(stock.symbol)}
                      className="w-full text-left py-3 px-4 hover:bg-white/10 flex items-center justify-between group"
                    >
                      <div>
                        <span className="font-medium text-indigo-300">{stock.symbol}</span>
                        <p className="text-sm text-gray-300">{stock.name}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : showTrending ? (
              <div>
                <div className="p-3 border-b border-white/10 bg-white/5">
                  <h3 className="font-medium flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-indigo-400" />
                    Trending Stocks
                  </h3>
                </div>
                <ul>
                  {trendingStocks.map((stock) => (
                    <li 
                      key={stock.symbol}
                      className="border-b border-white/10 last:border-b-0"
                    >
                      <button
                        onClick={() => getStockPrice(stock.symbol)}
                        className="w-full text-left py-3 px-4 hover:bg-white/10 flex items-center justify-between group"
                      >
                        <div>
                          <span className="font-medium text-indigo-300">{stock.symbol}</span>
                          <p className="text-sm text-gray-300">{stock.name}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-4 text-gray-300">No results found. Try searching for a different term.</div>
            )}
          </div>
        )}
      </div>
      
      {/* Selected Stock Information */}
      {selectedStock && (
        <div className="bg-white/5 rounded-lg p-4 border border-indigo-500/20 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-xl">{selectedStock.symbol}</h3>
              <p className="text-gray-300">{selectedStock.name}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-300 text-sm">Current Price</p>
              <p className="text-xl font-bold text-indigo-300">{formatCurrency(selectedStock.price)}</p>
            </div>
          </div>
          
          {/* Buy Form */}
          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="flex flex-col sm:flex-row items-end gap-4">
              <div className="w-full sm:w-1/3">
                <label className="block mb-2 text-sm text-gray-300">Quantity</label>
                <div className="flex">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-700 hover:bg-gray-600 py-2 px-3 rounded-l-md"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    min="1" 
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                    className="bg-gray-800 text-center py-2 px-2 w-full focus:outline-none border-t border-b border-gray-700"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-gray-700 hover:bg-gray-600 py-2 px-3 rounded-r-md"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="w-full sm:w-1/3">
                <p className="mb-2 text-sm text-gray-300">Total Cost</p>
                <p className="bg-gray-800/50 py-2 px-4 rounded-md font-bold">
                  {formatCurrency(selectedStock.price * quantity)}
                </p>
              </div>
              
              <div className="w-full sm:w-1/3">
                <button
                  onClick={buyStock}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md flex items-center justify-center"
                  disabled={purchasing}
                >
                  {purchasing ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Disclaimer */}
      <p className="text-xs text-gray-400 mt-2">
        Market data is delayed. Trading in securities involves risk and may result in loss of capital. 
        Make sure to research thoroughly before investing.
      </p>
    </div>
  );
};

export default StockSearch;
