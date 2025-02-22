import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const AssetAllocationChart = ({ userId }) => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStocks = async () => {
      const getCookie = Cookies.get('sessionToken');
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}getstocks`, {
          params: { id: userId },
          headers: {
            Authorization: `Bearer ${getCookie}`,
            'Content-Type': 'application/json',
          },
        });
        setStockData(response.data.stocks);
      } catch (error) {
        setError('Failed to fetch stock data. Please try again later.');
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchStocks();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-white/80">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-sm font-medium">Loading asset allocation data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400">
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  if (!stockData || stockData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-white/80">
        <p className="text-sm font-medium">No asset allocation data available</p>
      </div>
    );
  }

  const labels = stockData.map(stock => stock.symbol);
  const values = stockData.map(stock => stock.boughtPrice);
  
  // Calculate percentages for the tooltip
  const total = values.reduce((acc, val) => acc + val, 0);
  const percentages = values.map(value => ((value / total) * 100).toFixed(1));

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',   // Blue
          'rgba(16, 185, 129, 0.8)',   // Green
          'rgba(245, 158, 11, 0.8)',   // Yellow
          'rgba(239, 68, 68, 0.8)',    // Red
          'rgba(168, 85, 247, 0.8)',   // Purple
          'rgba(236, 72, 153, 0.8)',   // Pink
        ],
        hoverBackgroundColor: [
          'rgba(37, 99, 235, 0.9)',    // Darker Blue
          'rgba(5, 150, 105, 0.9)',    // Darker Green
          'rgba(217, 119, 6, 0.9)',    // Darker Yellow
          'rgba(220, 38, 38, 0.9)',    // Darker Red
          'rgba(147, 51, 234, 0.9)',   // Darker Purple
          'rgba(219, 39, 119, 0.9)',   // Darker Pink
        ],
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          padding: 20,
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif',
          },
          generateLabels: (chart) => {
            const labels = ChartJS.defaults.plugins.legend.labels.generateLabels(chart);
            return labels.map((label, i) => ({
              ...label,
              text: `${label.text} (${percentages[i]}%)`,
            }));
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          family: 'Inter, system-ui, sans-serif',
        },
        bodyFont: {
          size: 12,
          family: 'Inter, system-ui, sans-serif',
        },
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="relative h-64 w-full">
      <Pie data={data} options={options} />
    </div>
  );
};

export default AssetAllocationChart;