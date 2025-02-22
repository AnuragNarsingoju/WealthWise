import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { Loader2, Wallet, PiggyBank, LineChart } from 'lucide-react';

const Balance = ({ userId }) => {
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [investedAmount, setInvestedAmount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      const getCookie = Cookies.get('sessionToken');
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}getbalance`, {
          params: { userId: userId },
          headers: {
            Authorization: `Bearer ${getCookie}`,
            'Content-Type': 'application/json',
          },
        });
        setBalanceData(response.data.user);
        let temp = 0;
        const stocks = response.data.user.stocks;
        for(let i=0; i<stocks.length; i++){
          temp += stocks[i].boughtPrice;
        }
        setInvestedAmount(temp);
      } catch (error) {
        setError('Failed to fetch balance data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchBalance();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-white/80">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-sm font-medium">Loading balance details...</p>
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

  if (!balanceData) {
    return (
      <div className="flex items-center justify-center h-64 text-white/80">
        <p className="text-sm font-medium">No balance data available</p>
      </div>
    );
  }

  const { balance, pvalue } = balanceData;
  const totalBalance = balance + pvalue;
  const investedPercentage = (investedAmount / totalBalance) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8"
    >
      <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
        <Wallet className="w-6 h-6" />
        Account Balance
      </h2>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10"
        >
          <div className="flex items-center gap-2 text-white/60 mb-2">
            <LineChart className="w-4 h-4" />
            <span className="text-sm">Total Balance</span>
          </div>
          <div className="text-2xl font-bold text-white">
            ₹{totalBalance && totalBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10"
        >
          <div className="flex items-center gap-2 text-white/60 mb-2">
            <Wallet className="w-4 h-4" />
            <span className="text-sm">Available Cash</span>
          </div>
          <div className="text-2xl font-bold text-white">
            ₹{balance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10"
        >
          <div className="flex items-center gap-2 text-white/60 mb-2">
            <PiggyBank className="w-4 h-4" />
            <span className="text-sm">Invested Amount</span>
          </div>
          <div className="text-2xl font-bold text-white">
            ₹{investedAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
        </motion.div>
      </div>

      <div className="space-y-4">
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${investedPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
          />
        </div>
        
        <div className="flex justify-between text-sm text-white/60">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>Invested ({investedPercentage.toFixed(1)}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white/20 rounded-full" />
            <span>Available ({(100 - investedPercentage).toFixed(1)}%)</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Balance;
