import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react';

const ExpenseComparison = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const expenses = [
    { category: 'Food at Home', amount: 10000 },
    { category: 'Food Away From Home', amount: 8500 },
    { category: 'Housing', amount: 11000 },
    { category: 'Transportation', amount: 6000 },
    { category: 'Healthcare', amount: 5000 },
    { category: 'Personal Finance', amount: 3000 },
    { category: 'Savings', amount: 1500 },
    { category: 'Entertainment', amount: 2000 },
    { category: 'Personal Care', amount: 5040 },
    { category: 'Education', amount: 4540 },
    { category: 'Apparel and Services', amount: 7040 },
    { category: 'Tobacco Products', amount: 7540 },
    { category: 'Alcoholic Beverages', amount: 7040 },
    { category: 'Other Expenses', amount: 7020 },
  ];

  const averageExpenses = {
    "Food at Home": 9985,
    "Food Away From Home": 8500,  
    "Housing": 2436,
    "Transportation": 13174,
    "Healthcare": 6159,
    "Education": 1656,
    "Entertainment": 3635,
    "Personal Care": 950,  
    "Alcoholic Beverages": 637,  
    "Tobacco Products": 370, 
    "Personal Finance": 3000, 
    "Savings": 1500, 
    "Apparel and Services": 700,  
    "Other Expenses": 700, 
};

  const userExpensesByCategory = {};
  expenses.forEach(expense => {
    userExpensesByCategory[expense.category] = (userExpensesByCategory[expense.category] || 0) + expense.amount;
  });

  const data = Object.keys(averageExpenses).map(category => ({
    category,
    'Your Expenses': userExpensesByCategory[category] || 0,
    'Average Expenses': averageExpenses[category],
    difference: ((userExpensesByCategory[category] || 0) - averageExpenses[category])
  }));

  const formatCurrency = (value) => {
    if (window.innerWidth < 600) {
      return `${(value / 1000).toFixed(1)}K`;
    } else {
      return `$${value.toLocaleString()}`;
    }
  };
  


  const formatXAxisLabel = (label) => {
    return label
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className='w-full max-w-6xl mx-auto p-4' style={{marginTop:'90px',marginBottom:'30px'}}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
        className="w-full max-w-6xl  rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-extrabold text-white text-center tracking-tight"
          >
            Expense Breakdown Comparison
          </motion.h1>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-3 gap-8 p-8">
          {/* Bar Chart */}
          <div className="md:col-span-2 min-h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 10, left: 10, bottom: 40 }} 
                onMouseMove={(state) => {
                  if (state.isTooltipActive) {
                    const categoryIndex = state.activeTooltipIndex;
                    setSelectedCategory(data[categoryIndex]?.category);
                  }
                }}
                onMouseLeave={() => setSelectedCategory(null)}
              >
                <CartesianGrid 
                  stroke="#e6e6e6" 
                  strokeDasharray="3 3" 
                  vertical={false}
                />
                <XAxis 
                  dataKey="category" 
                  angle={window.innerWidth < 600 ? -90 : -45}
                  textAnchor="end"
                  interval={0}
                  tick={{ 
                    fill: 'white', 
                    fontSize: '0.75rem', 
                    fontWeight: 600 
                  }}
                  tickFormatter={formatXAxisLabel}
                  height={80} 
                />
                <YAxis 
                  tickFormatter={formatCurrency}
                  tick={{ fill: 'white' }}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  formatter={(value, name) => [formatCurrency(value), name]}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e0e0e0', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    color:'white'
                     
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  wrapperStyle={{ color: "#FFFFFF" }} 
                  height={36}
                />
                <Bar 
                  dataKey="Your Expenses"
                  fill="#F43F5E"
       
                  barSize={40}
                  opacity={selectedCategory === null ? 1 : 0.3}
                  animationBegin={0}
                  animationDuration={1500}
                />
                <Bar 
                  dataKey="Average Expenses" 
                  fill="#10B981"
                  barSize={40}
                  opacity={selectedCategory === null ? 1 : 0.3}
                  animationBegin={500}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Insights Panel */}
          <div className="space-y-6">
            <motion.h2 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-gray-100"
            >
              Key Insights
            </motion.h2>
            <AnimatePresence>
              {data.map((item, index) => {
                const difference = item['Your Expenses'] - item['Average Expenses'];
                const percentDiff = ((difference / item['Average Expenses']) * 100).toFixed(1);
                const isHigher = difference > 0;

                return (
                  <motion.div
                    key={item.category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/30  rounded-xl shadow-md p-4"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-100">
                        {formatXAxisLabel(item.category)}
                      </span>
                      <div className="flex items-center space-x-2">
                        {isHigher ? (
                          <TrendingUpIcon className="w-5 h-5 text-red-500" />
                        ) : (
                          <TrendingDownIcon className="w-5 h-5 text-green-400" />
                        )}
                        <span 
                          className={`font-bold ${
                            isHigher ? 'text-red-500' : 'text-green-400'
                          }`}
                        >
                          {isHigher ? '+' : '-'}{Math.abs(percentDiff)}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExpenseComparison;