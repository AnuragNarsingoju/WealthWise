import React, { useState, useRef } from 'react';
import axios from 'axios';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Users, TrendingUp, Wallet, Coins, ChevronRight, ArrowUp } from 'lucide-react';
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

    const [errors, setErrors] = useState({});
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);


    const validateForm = () => {
        const newErrors = {};
        const currentYear = new Date().getFullYear();

        const age = parseInt(formData.user_age);
        if (isNaN(age) || age < 18 || age > 100) {
            newErrors.user_age = 'Please enter a valid age between 18 and 100';
        }

        const riskOptions = ['low', 'medium', 'high'];
        if (!riskOptions.includes(formData.user_risk_appetite.toLowerCase())) {
            newErrors.user_risk_appetite = 'Risk appetite must be Low, Medium, or High';
        }

        const income = parseInt(formData.user_income);
        if (isNaN(income) || income < 0 || income > 10000000) {
            newErrors.user_income = 'Please enter a valid annual income';
        }

        const savings = parseInt(formData.user_savings);
        if (isNaN(savings) || savings < 0 || savings > 100000000) {
            newErrors.user_savings = 'Please enter a valid savings amount';
        }

        const investmentAmount = parseInt(formData.user_investment_amount);
        if (isNaN(investmentAmount) || investmentAmount < 1000 || investmentAmount > 500000) {
            newErrors.user_investment_amount = 'Monthly investment should be between ₹1,000 and ₹500,000';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        const processedValue = name === 'user_risk_appetite' 
            ? value 
            : value.replace(/[^0-9]/g, '');

        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

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
            
            setTimeout(() => {
                const recommendationElement = document.getElementById('recommendation-section');
                if (recommendationElement) {
                    recommendationElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }
            }, 500);
        } catch (error) {
            console.error('Error fetching recommendation:', error);
            setErrors(prev => ({
                ...prev,
                submission: 'Unable to fetch recommendation. Please try again later.'
            }));
        } finally {
            setLoading(false);
        }
    };


    const renderInputField = (field, index) => (
        <motion.div 
            key={field.name}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            whileFocus={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="relative"
        >
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                {field.icon}
            </div>
            <input
                type={field.name === 'user_risk_appetite' ? 'text' : 'text'}
                inputMode="numeric"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.label}
                className={`
                    w-full pl-12 pr-4 py-3 
                    bg-white/10 border 
                    ${errors[field.name] 
                        ? 'border-red-500 focus:ring-red-500/50' 
                        : 'border-white/30 focus:border-white/50 focus:ring-green-500/50'}
                    rounded-xl text-white placeholder-white/50 
                    focus:outline-none focus:ring-2 
                    transition-all duration-300
                `}
                required
            />
            {errors[field.name] && (
                <div className="text-red-400 text-sm mt-1 ml-3">
                    {errors[field.name]}
                </div>
            )}
        </motion.div>
    );

    return (
    <>
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
                        label: 'Risk Appetite (Low/Medium/High)', 
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
                ].map(renderInputField)}
            </div>

            {errors.submission && (
                <div className="text-red-400 text-center mb-4">
                    {errors.submission}
                </div>
            )}
        </form>
    </>
    );
};

export default InvestmentRecommendationForm;
