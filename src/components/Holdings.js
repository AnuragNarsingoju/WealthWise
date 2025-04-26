import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ArrowUp, ArrowDown, DollarSign } from "lucide-react";

const Holdings = ({ data = [], onBuy, onSell }) => {
  const [currentPrices, setCurrentPrices] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'symbol', direction: 'asc' });

  useEffect(() => {
    if (data.length > 0) {
      fetchCurrentPrices();
    } else {
      setIsLoading(false);
    }
  }, [data]);

  const fetchCurrentPrices = async () => {
    setIsLoading(true);
    const getCookie = Cookies.get("sessionToken");
    
    try {
      const symbols = data.map(stock => stock.symbol);
      const requests = symbols.map(symbol => 
        axios.get(`${process.env.REACT_APP_BACKEND_URL}stock-price`, {
          params: { tickers: [symbol] },
          headers: {
            Authorization: `Bearer ${getCookie}`,
            "Content-Type": "application/json",
          },
        })
      );
      
      const responses = await Promise.all(requests);
      
      const prices = {};
      responses.forEach((response, index) => {
        prices[symbols[index]] = response.data.price[0];
      });
      
      setCurrentPrices(prices);
    } catch (error) {
      console.error("Error fetching current stock prices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    // Handle special cases for derived values
    if (sortConfig.key === 'currentPrice') {
      const aValue = currentPrices[a.symbol] || 0;
      const bValue = currentPrices[b.symbol] || 0;
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (sortConfig.key === 'profitLoss') {
      const aPL = ((currentPrices[a.symbol] || 0) - a.boughtPrice) * a.quantity;
      const bPL = ((currentPrices[b.symbol] || 0) - b.boughtPrice) * b.quantity;
      return sortConfig.direction === 'asc' ? aPL - bPL : bPL - aPL;
    }
    
    if (sortConfig.key === 'profitLossPercentage') {
      const aPLP = ((currentPrices[a.symbol] || 0) - a.boughtPrice) / a.boughtPrice * 100;
      const bPLP = ((currentPrices[b.symbol] || 0) - b.boughtPrice) / b.boughtPrice * 100;
      return sortConfig.direction === 'asc' ? aPLP - bPLP : bPLP - aPLP;
    }
    
    // Normal sorting for direct properties
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="w-4 h-4 inline-block ml-1" /> : 
      <ArrowDown className="w-4 h-4 inline-block ml-1" />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center p-6 text-white">
        <p>No stocks in your portfolio.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200/30">
        <thead>
          <tr>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('symbol')}
            >
              Symbol {getSortIcon('symbol')}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('quantity')}
            >
              Quantity {getSortIcon('quantity')}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('boughtPrice')}
            >
              Bought Price {getSortIcon('boughtPrice')}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('currentPrice')}
            >
              Current Price {getSortIcon('currentPrice')}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('profitLoss')}
            >
              P/L {getSortIcon('profitLoss')}
            </th>
            <th 
              className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200/20">
          {sortedData.map((stock) => {
            const currentPrice = currentPrices[stock.symbol] || 0;
            const profitLoss = (currentPrice - stock.boughtPrice) * stock.quantity;
            const profitLossPercentage = ((currentPrice - stock.boughtPrice) / stock.boughtPrice) * 100;
            
            return (
              <tr key={stock.symbol} className="hover:bg-white/10">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-white">{stock.symbol}</div>
                  {stock.name && <div className="text-sm text-gray-300">{stock.name}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  {stock.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  ${stock.boughtPrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  ${currentPrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`font-medium ${profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${Math.abs(profitLoss).toFixed(2)}
                    <span className="ml-1 text-xs">
                      ({profitLoss >= 0 ? '+' : '-'}{Math.abs(profitLossPercentage).toFixed(2)}%)
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onBuy && onBuy(stock)}
                    className="text-green-400 hover:text-green-300 mr-3"
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => onSell && onSell(stock)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Sell
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Holdings;
