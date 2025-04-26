import React, { useEffect, useState } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import axios from "axios";
import Cookies from "js-cookie";

const Balance = ({ userId }) => {
  const [performanceData, setPerformanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const getCookie = Cookies.get("sessionToken");
      
      try {
        // Get portfolio profit/loss data
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}portfolio-profit-loss`,
          {
            params: { email: userId },
            headers: {
              Authorization: `Bearer ${getCookie}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        // Get user balance data
        const balanceResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}getbalance`,
          {
            params: { userId },
            headers: {
              Authorization: `Bearer ${getCookie}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        // Get portfolio value
        const valueResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}getvalue`,
          {
            params: { email: userId },
            headers: {
              Authorization: `Bearer ${getCookie}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        // Generate mock performance data (in a real app, this would come from the backend)
        const currentTime = new Date();
        const totalProfitLoss = response.data.totalProfitOrLoss || 0;
        const userBalance = balanceResponse.data.user.balance || 0;
        const portfolioValue = valueResponse.data.amount || 0;
        const initialInvestment = portfolioValue - totalProfitLoss;
        
        // Create a historical performance simulation
        // In a real application, this would use actual historical data
        const mockData = [];
        
        // Starting 30 days ago
        for (let i = 30; i >= 0; i--) {
          const date = new Date();
          date.setDate(currentTime.getDate() - i);
          
          // Create a slight randomness but trending toward the current value
          const trend = i / 30; // 0 to 1 as we get closer to today
          const randomFactor = 0.05; // 5% random variation
          
          // For the starting value, calculate as if the profit/loss accumulated gradually
          const portfolioAtDay = initialInvestment + (totalProfitLoss * trend) + 
                               (Math.random() * randomFactor * 2 - randomFactor) * initialInvestment;
          
          mockData.push({
            date: date.toLocaleDateString(),
            value: Math.max(0, portfolioAtDay.toFixed(2)), // Ensure no negative values
          });
        }
        
        // Add the exact current value as the last point
        mockData[mockData.length - 1].value = portfolioValue;
        
        setPerformanceData(mockData);
      } catch (error) {
        console.error("Error fetching performance data:", error);
        setError("Failed to load performance data");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const formatCurrency = (value) => {
    return `₹${value}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded-lg shadow-lg">
          <p className="text-white font-medium">{label}</p>
          <p className="text-green-400 font-medium">
            {`Portfolio Value: ${formatCurrency(payload[0].value)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  // Calculate if overall portfolio is positive or negative
  const isPositive = performanceData.length >= 2 && 
                    Number(performanceData[performanceData.length - 1].value) >= 
                    Number(performanceData[0].value);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={performanceData}
        margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis 
          dataKey="date" 
          tick={{ fill: "white" }} 
          tickLine={{ stroke: "white" }}
          axisLine={{ stroke: "white" }}
          tickFormatter={(value) => {
            // Show fewer x-axis labels on smaller screens
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }}
        />
        <YAxis 
          tick={{ fill: "white" }} 
          tickLine={{ stroke: "white" }}
          axisLine={{ stroke: "white" }}
          tickFormatter={formatCurrency}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={isPositive ? "#4ade80" : "#f87171"} // Green if positive, red if negative
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 8, fill: isPositive ? "#4ade80" : "#f87171", stroke: "white" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Balance;
