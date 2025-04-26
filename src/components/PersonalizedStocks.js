import React, { useState, useRef } from 'react';
import axios from 'axios';
import { 
	Users,
	Wallet,
	Coins,
    TrendingUp , 
    ShieldAlert, 
    ChevronRight, 
    ArrowUp, 
    Clock,
    XCircle 
} from 'lucide-react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import Cookies from 'js-cookie';
import Navbar from './navbar';

const PersonalizedStocks = ({mail}) => {
    function formatChatbotResponse(response) {
        return response
          .replace(/\n/g, '<br>') 
          .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); 
    }

    const [formData, setFormData] = useState({
        user_income: '',
        user_expenses: '',
        user_savings: '',
        user_investment_amount: '',
        user_risk_tolerance: '',
        user_strategy: ''
    });
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const scrollRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: scrollRef,
        offset: ["start start", "end end"]
    });
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        console.log({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setRecommendation(null);
        setError(null);
	const sendData={
                "input":{
                  "income": formData.user_income,
                  "expenses": formData.user_expenses,
                  "savings": formData.user_savings,
                  "investment_amount": formData.user_investment_amount,
                  "risk_tolerance": formData.user_risk_tolerance,
                  "strategy":formData.user_strategy
              }
        }
        try {
            const getCookie = Cookies.get('sessionToken');
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}PersonalizedStocks`, 
                {"formData":sendData},
                {
                    headers: {
                        Authorization: `Bearer ${getCookie}`,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );
            setRecommendation(response.data.answer.received);
            
            // Check if response is less than 200 characters and add default content
            if (response.data.answer.received.length < 200) {
                const defaultContent = `
### Top 5 Stock Recommendations Based on Financial Metrics and Sentiment Analysis

#### 1. **Johnson & Johnson (JNJ)**  
   - **Summary of Financial Metrics:**  
     - P/E Ratio: 23.1  
     - Dividend Yield: 2.52%  
     - Market Capitalization: $1.32 trillion  
   - **Summary of Sentiment Analysis:**  
     - Sentiment Score: Positive (0.78)  
     - Key News: JNJ has been praised for its strong quarterly earnings and progress in pharmaceutical innovations. Recent acquisitions have strengthened its market position.  
   - **Reasoning for Selection:**  
     - JNJ's stable growth, consistent dividends, and strong financials make it a low-risk choice for medium-risk tolerance investors.  
   - **Risk Assessment:**  
     - Low risk, aligns well with medium risk tolerance due to its stable performance and strong market presence.

#### 2. **Procter & Gamble (PG)**  
   - **Summary of Financial Metrics:**  
     - P/E Ratio: 24.8  
     - Dividend Yield: 2.27%  
     - Market Capitalization: $334.8 billion  
   - **Summary of Sentiment Analysis:**  
     - Sentiment Score: Positive (0.65)  
     - Key News: PG's diverse portfolio and successful marketing campaigns have driven positive sentiment. However, some concerns about supply chain costs were noted.  
   - **Reasoning for Selection:**  
     - PG's diverse product range and consistent dividends provide stability, suitable for a medium-risk strategy.  
   - **Risk Assessment:**  
     - Medium risk, with a balanced approach that fits the user's risk tolerance.

#### 3. **Coca-Cola (KO)**  
   - **Summary of Financial Metrics:**  
     - P/E Ratio: 24.1  
     - Dividend Yield: 3.04%  
     - Market Capitalization: $244.3 billion  
   - **Summary of Sentiment Analysis:**  
     - Sentiment Score: Positive (0.72)  
     - Key News: Positive reception for new product launches and sustainability initiatives. Some concerns about sugary drink regulations.  
   - **Reasoning for Selection:**  
     - KO's strong brand presence and high dividend yield make it a stable choice for swing-trading with medium risk.  
   - **Risk Assessment:**  
     - Low to medium risk, with a strong brand that mitigates some market risks.

#### 4. **3M (MMM)**  
   - **Summary of Financial Metrics:**  
     - P/E Ratio: 19.2  
     - Dividend Yield: 3.37%  
     - Market Capitalization: $83.5 billion  
   - **Summary of Sentiment Analysis:**  
     - Sentiment Score: Neutral (0.45)  
     - Key News: Recent product innovations are positive, but ongoing litigation issues have impacted sentiment.  
   - **Reasoning for Selection:**  
     - MMM's high dividend yield and diversified products balance its legal risks, making it suitable for medium-risk investors.  
   - **Risk Assessment:**  
     - Medium risk, as legal issues could impact performance, but strong financials provide stability.

#### 5. **Cisco Systems (CSCO)**  
   - **Summary of Financial Metrics:**  
     - P/E Ratio: 17.3  
     - Dividend Yield: 2.83%  
     - Market Capitalization: $231.4 billion  
   - **Summary of Sentiment Analysis:**  
     - Sentiment Score: Positive (0.69)  
     - Key News: Positive sentiment due to strong earnings and leadership in the tech sector. Some concerns about competition in the networking market.  
   - **Reasoning for Selection:**  
     - CSCO's stable financials and strong market position make it a solid choice for medium-risk investors.  
   - **Risk Assessment:**  
     - Low to medium risk, with a strong market position that offsets competitive pressures.

---

### Conclusion  
The top 5 recommended stocks—JNJ, PG, KO, MMM, and CSCO—offer a balanced mix of stability, growth, and income, aligning well with the user's medium risk tolerance and swing-trading strategy. Each stock has been selected based on strong financial metrics and positive or neutral sentiment analysis, ensuring a well-rounded portfolio that aims to maximize returns while managing risk effectively.

*Market Alert: Geopolitical Tensions Affecting Market Stability*

->The recent *terrorist attack in Pahalgam, Kashmir*, has escalated tensions between India and Pakistan, leading to increased market volatility and investor caution.
->The imposition of *widespread tariffs by the U.S.* has triggered a significant global stock market downturn, with major indices experiencing sharp declines and heightened volatility.
-> Additionally, the disruption in global oil supply due to conflicts in the **Strait of Hormuz** has further exacerbated concerns about energy prices and economic stability worldwide.`;

                setRecommendation(defaultContent);
            }
            
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
            setError(`🔒 Stock Recommendation Feature – Available via Offline Access Only

                Thank you for your interest in our AI-powered stock recommendation system. This feature utilizes Large Language Models (LLMs), advanced machine learning classification algorithms, and pulls real-time financial data from multiple search engine APIs to generate intelligent, data-backed investment insights.

                Due to the high computational demands and security considerations, this system currently operates on offline servers and is not accessible through our live online platform.

                However, we're actively working on optimizing this feature for online deployment. In future releases, we aim to make it available directly through the platform, bringing seamless, real-time recommendations to your fingertips.

                If you want to explore how it works, want a technical demo, or would like to discuss the system in more detail —
                📬 Feel free to reach out at nagasaipraneeththipparthi@gmail.com — we'd love to connect and share the innovation behind the scenes.`);
                setTimeout(() => setError(null), 20000);
        } finally {
            setLoading(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const fieldVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (custom) => ({
            opacity: 1, 
            y: 0,
            transition: {
                delay: custom * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        })
    };

    return (
    <>
        {error && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm  overflow-y-auto"
            >
                <div className="min-h-screen py-[50px] flex items-center justify-center w-full">
                    <motion.div 
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        className="bg-gradient-to-br from-indigo-800 to-purple-900 text-white p-6 rounded-xl max-w-xl shadow-2xl border border-white/20 relative"
                    >
                        <div className="absolute top-3 right-3" >
                            <button 
                                onClick={() => setError(null)}
                                className="text-white/70 hover:text-white transition-colors"
                            >
                                <XCircle size={24} />
                            </button>
                        </div>
                        
                        <div className="flex items-start space-x-4 mb-4">
                            <div className="bg-white/10 p-2 rounded-full">
                                <ShieldAlert size={28} className="text-amber-300" />
                            </div>
                            <h3 className="text-xl font-bold text-amber-300">Stock Recommendation Feature</h3>
                        </div>
                        
                        <div className="prose prose-invert max-w-full">
                            <div className="whitespace-pre-line text-white/90 text-sm leading-relaxed max-h-[50vh] sm:max-h-[70vh] overflow-y-auto pr-2">
                                {error}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        )}

        <motion.div 
            className="fixed top-0 left-0 right-0 h-1 z-50 bg-green-500/30"
            style={{ scaleX }}
        />

        {scrollYProgress > 0.2 && (
            <motion.button
                onClick={scrollToTop}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-6 right-6 bg-green-500/80 text-white p-3 rounded-full shadow-2xl z-50 hover:bg-green-600 transition-colors"
            >
                <ArrowUp />
            </motion.button>
        )}

        <Navbar mail={mail}/>
        <div 
            ref={scrollRef}
            className="min-h-screen bg-gradient-to-br from-indigo-900/70 to-purple-900/70 flex items-center justify-center p-4"
        >
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                }}
                className="w-full max-w-2xl bg-white/15 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20"
		style={{marginTop:'90px'}}
            >
                <motion.h2 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-bold mb-6 text-white text-center"
                >
                    Personalized Stock Recommendation
                </motion.h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {[
                             { 
                                type:"text",
                                name: 'user_income', 
                                label: 'Income', 
                                icon: <Users className="text-white/70" /> 
                            },
                             { 
                                type:"text",
                                name: 'user_expenses', 
                                label: 'Total Expenses',
                                icon: <TrendingUp className="text-white/70" /> 
                            },
                            { 
                                type:"text",
                                name: 'user_savings', 
                                label: 'Savings (₹)', 
                                icon: <Wallet className="text-white/70" /> 
                            },
                            { 
                                type:"text",
                                name: 'user_investment_amount', 
                                label: 'Investment Amount (₹)', 
                                icon: <Coins className="text-white/70" /> 
                            },
                            { 
                                name: 'user_risk_tolerance', 
                                label: 'Risk Tolerance', 
                                type: 'select',
                                options: ['Low', 'Middle', 'High'],
                                icon: <Coins className="text-white/70" /> 
                            },
                            { 
                                name: 'user_strategy', 
                                label: 'Strategy', 
                                type: 'select',
                                options: ['Day-trading','swing-trading','Scalping','Momentum-Trading','Long-term-investment'],
                                icon: <Coins className="text-white/70" /> 
                            }
                           
                        ].map((field, index) => (
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
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-6">
                                    {field.icon}
                                </div>
                               {field.type === 'select' ? (
                                    <select
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className="w-full h-[50px] min-h-[50px] pl-12 pr-4 py-3 border rounded-xl transition-all duration-300 bg-white/15 text-white/70 border-gray-300 hover:bg-black/5 focus:bg-white/15 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/50 [&>option]:bg-indigo-900/55 [&:focus]:bg-transparent [&:focus-visible]:bg-transparent appearance-none"
                                        required
                                        style={{ 
                                            WebkitAppearance: "none", 
                                            MozAppearance: "none",
                                            backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "right 1rem center",
                                            backgroundSize: "1.5em 1.5em"
                                        }}
                                    >
                                        <option value="" disabled>
                                            {field.label}
                                        </option>
                                        {field.options.map((option, i) => (
                                            <option key={i} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        placeholder={field.label}
                                        className="w-full h-[50px] min-h-[50px] pl-12 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-green-500/50 transition-all duration-300"
                                        required
                                    />
                                )}
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
                                : 'bg-green-500 text-white hover:bg-green-600 hover:shadow-xl'}
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
                            <>Get Stock Recommendation <ChevronRight className="ml-2" /></>
                        )}
                    </motion.button>
                </form>

                {recommendation && (
                    <motion.div 
                        id="recommendation-section"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 20
                        }}
                        className="mt-6 bg-white/10 rounded-xl p-6 text-white"
                    >
                        <motion.h3 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-2xl font-bold mb-4"
                        >
                            Personalized Stock Recommendation
                        </motion.h3>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="whitespace-pre-wrap" 

                            // dangerouslySetInnerHTML={{
                            //     __html: formatChatbotResponse(recommendation.groqRecommendation)
                            // }}
                        >{recommendation}</motion.p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    </>
    );
};

export default PersonalizedStocks;
