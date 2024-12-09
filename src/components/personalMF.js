import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Wallet, Coins, ChevronRight } from 'lucide-react';
import Cookies from 'js-cookie';
import Navbar from './navbar';

const InvestmentRecommendationForm = () => {

    function formatChatbotResponse(response) {
        return response
          .replace(/\n/g, '<br>') 
          .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); 
      }

    const [formData, setFormData] = useState({
        user_age: '',
        user_risk_appetite: '',
        user_income: '',
        user_savings: '',
        user_investment_amount: ''
    });
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setRecommendation(null);

        try {
            const getCookie = Cookies.get('sessionToken');
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}recommend-mutual-funds`, 
                formData,
                {
                    headers: {
                      Authorization: `Bearer ${getCookie}`,
                      'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                  }
            );
            setRecommendation(response.data);
        } catch (error) {
            console.error('Error fetching recommendation:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
    <>
    <Navbar/>
        <div className="min-h-screen bg-gradient-to-br from-indigo-900/70 to-purple-900/70 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl bg-white/15 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20"
            >
                <h2 className="text-3xl font-bold mb-6 text-white text-center">
                    Investment Recommendation
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { 
                                name: 'user_age', 
                                label: 'Age', 
                                icon: <Users className="text-white/70" /> 
                            },
                            { 
                                name: 'user_risk_appetite', 
                                label: 'Risk Appetite', 
                                icon: <TrendingUp className="text-white/70" /> 
                            },
                            { 
                                name: 'user_income', 
                                label: 'Annual Income (₹)', 
                                icon: <Wallet className="text-white/70" /> 
                            },
                            { 
                                name: 'user_savings', 
                                label: 'Total Savings (₹)', 
                                icon: <Coins className="text-white/70" /> 
                            },
                            { 
                                name: 'user_investment_amount', 
                                label: 'Monthly Investment (₹)', 
                                icon: <Coins className="text-white/70" /> 
                            }
                        ].map((field) => (
                            <motion.div 
                                key={field.name}
                                whileFocus={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                                className="relative"
                            >
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    {field.icon}
                                </div>
                                <input
                                    type="text"
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    placeholder={field.label}
                                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                                    required
                                />
                            </motion.div>
                        ))}
                    </div>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                            w-full py-3 rounded-xl transition-all duration-300 flex items-center justify-center
                            ${loading 
                                ? 'bg-white/20 text-white/50 cursor-not-allowed' 
                                : 'bg-green-500 text-white hover:bg-green-600'}
                        `}
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating Recommendation...
                            </div>
                        ) : (
                            <>Get Recommendation <ChevronRight className="ml-2" /></>
                        )}
                    </motion.button>
                </form>

                {recommendation && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 bg-white/10 rounded-xl p-6 text-white"
                    >
                        <h3 className="text-2xl font-bold mb-4">Personalized Recommendation</h3>
                        <p className="whitespace-pre-wrap" 
                            dangerouslySetInnerHTML={{
                                __html: formatChatbotResponse(recommendation.groqRecommendation)
                            }}
                            ></p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    </>
    );
};

export default InvestmentRecommendationForm;
