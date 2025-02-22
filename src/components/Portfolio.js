import React, { useEffect, useState } from 'react';
import Balance from '../components/Balance';
import Holdings from '../components/Holdings';
import AssetAllocationChart from '../components/AssetAllocationChart';
import ConfirmationModal from './ConfirmationModal'; // Make sure path is correct
import axios from 'axios';
import Cookies from 'js-cookie';
import Navbar from './navbar';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const Portfolio = ({mail}) => {
  const [balanceData, setBalanceData] = useState(null);
  const [holdingsData, setHoldingsData] = useState([]);
  const [transactionsData, setTransactionsData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [allocationData, setAllocationData] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  // Add modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  const userId = "67b8f409f32e294c52ec60d5";

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const getCookie = Cookies.get('sessionToken');
      try {
        const endpoints = ['balance', 'holdings', 'transactions', 'performance', 'allocation'];
        const requests = endpoints.map(endpoint => 
          axios.get(`${process.env.REACT_APP_BACKEND_URL}${endpoint}?id=${userId}`, {
            headers: {
              Authorization: `Bearer ${getCookie}`,
              'Content-Type': 'application/json',
            },
          })
        );

        const [
          balanceRes,
          holdingsRes,
          transactionsRes,
          performanceRes,
          allocationRes
        ] = await Promise.all(requests);

        setBalanceData(balanceRes.data);
        setHoldingsData(holdingsRes.data);
        setTransactionsData(transactionsRes.data);
        setPerformanceData(performanceRes.data);
        setAllocationData(allocationRes.data);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      }
    };

    fetchData();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Add handlers for modal
  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

  const handleConfirmPurchase = async () => {
    try {
      // Add your purchase logic here
      console.log('Purchase confirmed:', selectedStock);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error during purchase:', error);
    }
  };

  return (
    <>
      <Navbar mail={mail}/>
      <div className="bg-gradient-to-br from-indigo-900/70 to-purple-900/70">
        <div className="w-full px-4 sm:px-6 md:px-8 py-20 sm:py-24">
          {showScrollButton && (
            <motion.button
              onClick={scrollToTop}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-blue-500/80 text-white p-2 sm:p-3 rounded-full shadow-2xl z-50 hover:bg-blue-600 transition-colors"
            >
              <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>
          )}

          <div className="max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-8 sm:mb-12"
            >
              My Portfolio
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Balance Section */}
              <div className="bg-white/15 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 border border-white/20">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-4 sm:mb-6">
                  Portfolio Performance 
                </h2>

                <div className="w-full max-w-2xl mx-auto">
                  <div className="aspect-square sm:aspect-[4/3] md:aspect-[16/9]">
                  <Balance data={balanceData} />
                  </div>
                </div>
               
                
              </div>

              {/* Asset Allocation Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/15 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 border border-white/20"
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-4 sm:mb-6">
                  Asset Allocation 
                </h2>
                <div className="w-full max-w-2xl mx-auto">
                  <div className="aspect-square sm:aspect-[4/3] md:aspect-[16/9]">
                    <AssetAllocationChart userId={userId} />
                  </div>
                </div>
              </motion.div>

              {/* Holdings Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/15 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 border border-white/20"
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-4 sm:mb-6">
                  Holdings
                </h2>
                <div className="overflow-x-auto h-160">
                  <div className="min-w-full">
                    <Holdings 
                      className="bg-white/15 backdrop-blur-xl w-full" 
                      data={holdingsData}
                      onStockSelect={handleStockSelect}
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Confirmation Modal */}
          {selectedStock && (
            <ConfirmationModal
              isOpen={isModalOpen}
              stock={selectedStock}
              onConfirm={handleConfirmPurchase}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Portfolio;
