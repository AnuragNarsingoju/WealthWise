import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import 'font-awesome/css/font-awesome.min.css';

const Home = ({ mail = 'User' }) => {

    const StocksData = () => {  
        const [activeButton, setActiveButton] = useState(null);
        const personalizeButtons = [
            { 
              name: 'Personalized Stocks', 
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1116.5 16h-11z" />
                </svg>
              )
            },
            { 
              name: 'Personalized FD', 
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm4-1a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              )
            },
            { 
              name: 'Personalized Mutual Funds', 
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              )
            },
            { 
              name: 'Chatbot', 
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                </svg>
              )
            }
          ];
        const investments = [
        {
            type: 'Stocks',
            items: [
              { name: 'Reliance Industries', code: 'RELIANCE', return: 12.5, icon: '₹' },
              { name: 'HDFC Bank', code: 'HDFCBANK', return: 15.3, icon: '₹' },
              { name: 'TCS', code: 'TCS', return: 10.2, icon: '₹' },
              { name: 'Infosys', code: 'INFY', return: 11.8, icon: '₹' },
            //   { name: 'ICICI Bank', code: 'ICICIBANK', return: 13.6, icon: '₹' }
            ]
          },
          {
            type: 'Fixed Deposits',
            items: [
              { name: 'SBI FD', code: 'SBIFD', return: 7.5, icon: '₹' },
              { name: 'HDFC FD', code: 'HDFCFD', return: 7.2, icon: '₹' },
              { name: 'ICICI FD', code: 'ICICFD', return: 7.8, icon: '₹' }
            ]
          },
          {
            type: 'Mutual Funds',
            items: [
              { name: 'HDFC Bluechip', code: 'HDFCBLUE', return: 16.5, icon: '₹' },
              { name: 'Axis Midcap', code: 'AXISMID', return: 18.3, icon: '₹' },
              { name: 'SBI Largecap', code: 'SBILARGE', return: 15.2, icon: '₹' },
              { name: 'ICICI Prudential', code: 'ICICIPRu', return: 17.1, icon: '₹' }
            ]
          },
          {
            type: 'Investment Videos',
            items: [
              { 
                name: 'Stock Market Basics', 
                thumbnail: '/api/placeholder/300/200', 
                duration: '12:45',
                views: '1.2M'
              },
              { 
                name: 'Investment Strategies', 
                thumbnail: '/api/placeholder/300/200', 
                duration: '18:30',
                views: '890K'
              },
              { 
                name: 'Mutual Funds Explained', 
                thumbnail: '/api/placeholder/300/200', 
                duration: '15:15',
                views: '1.5M'
              }
            ]
          }
      ];
      
    return  (
        <div className="bg-gray-900 text-white p-4  overflow-hidden" style={{width:'60%',justifyContent:'center',alignItems:'center',margin:'auto'}}>
          <div 
            className="grid grid-cols-2 gap-4 mb-6 pb-2" style={{marginTop:'20px',marginBottom:'40px'}}
            >
            {personalizeButtons.map((button) => (
                <button 
                key={button.name}
                onClick={() => setActiveButton(button.name)}
                className={`
                    flex items-center space-x-2 px-4 py-2 
                    transform transition-all duration-300
                    ${activeButton === button.name 
                    ? 'bg-green-600 text-white scale-105 shadow-lg' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}
                `}

                style={{margin:'10px',height:'90px',borderRadius:'15px'}}
                >
                
                <span 
                    className="flex items-center justify-center text-sm font-medium mx-auto"
                    >
                    {button.icon}&nbsp;&nbsp;{button.name}
                </span>
                </button>
            ))}
            </div>
    
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Top Investments & Learning
          </h2>
    
          {investments.map((category, categoryIndex) => (
            <div key={category.type} className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-300">{category.type}</h3>
              
              <div 
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide whitespace-nowrap scroll-smooth"
                style={{
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {category.items.map((investment, index) => {

                  const bgIntensity = Math.max(700 - (index * 50), 800);
                  
                  return category.type === 'Investment Videos' ? (
                    <div 
                      key={investment.name}
                      className={`flex-shrink-0 w-64 bg-gray-${bgIntensity} rounded-lg p-4 
                        transform transition-all duration-300 
                        hover:scale-105 hover:shadow-lg
                        scroll-snap-align: start;`}
                    >
                      <div className="relative mb-3">
                        <img 
                          src={investment.thumbnail} 
                          alt={investment.name} 
                          className="w-full h-40 object-cover rounded-md"
                        />
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 rounded">
                          {investment.duration}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg line-clamp-2">{investment.name}</h4>
                        <p className="text-sm text-gray-400">{investment.views} views</p>
                      </div>
                    </div>
                  ) : (
                    <div 
                      key={investment.code || investment.name} 
                      className={`flex-shrink-0 w-64 bg-gray-${bgIntensity} rounded-lg p-4 
                        transform transition-all duration-300 
                        hover:scale-105 hover:shadow-lg
                        scroll-snap-align: start;`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h4 className="font-bold text-lg">{investment.name}</h4>
                          <p className="text-sm text-gray-400">{investment.code}</p>
                        </div>
                        <span className="text-green-500 font-bold text-xl">₹</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="bg-green-900 text-green-400 px-2 py-1 rounded-full text-sm">
                          +{investment.return}%
                        </div>
                        <span className="text-sm text-gray-500">Annual Return</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      );
      };
      

      
  const [messages, setMessages] = useState([
    {
      id: 0,
      text: "Hello! I'm your AI Financial Advisor. How can I help you today?",
      sender: 'bot',
      type: 'welcome',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false); 
  const messagesEndRef = useRef(null);

  const generateFinancialResponse = (userInput) => {
    const lowercaseInput = userInput.toLowerCase();

    if (lowercaseInput.includes('invest')) {
      return "Great question! Consider diversifying your portfolio across different asset classes. Index funds and ETFs can be good starting points for most investors.";
    } else if (lowercaseInput.includes('savings')) {
      return "For savings, aim to build an emergency fund covering 3-6 months of expenses. Look into high-yield savings accounts to earn better interest.";
    } else if (lowercaseInput.includes('retirement')) {
      return "For retirement planning, maximize contributions to tax-advantaged accounts like 401(k) and IRAs. The earlier you start, the more you can benefit from compound interest.";
    } else if (lowercaseInput.includes('debt')) {
      return "When managing debt, prioritize high-interest debt first. Consider the debt avalanche method: pay minimums on all debts, then put extra money towards the highest interest debt.";
    } else {
      return "I can help with investment, savings, retirement, and debt questions. What specific financial advice are you looking for?";
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length,
      text: input,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);


    setTimeout(() => {
      const botResponse = {
        id: messages.length + 1,
        text: generateFinancialResponse(input),
        sender: 'bot',
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const toggleChatbot = () => {
    setIsChatbotVisible((prev) => !prev);
  };

  

  return (
    <div className='bg-gray-900 ' >
    <div className="bg-gray-900 text-white" style={{justifyContent:'center',alignContent:'center',textAlign:'center',paddingTop:'50px',paddingBottom:'20px'}}><h1>WealthWise</h1></div>

    <StocksData/>
  
    <div>
      <button
        onClick={toggleChatbot}
        className="chatbot-toggle-button"
        aria-label="Toggle Chatbot"
        >
        <i class="fa fa-comments"></i> 
        </button>

      {isChatbotVisible && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h2>Financial Advisor</h2>
          </div>

          <div className="chatbot-message-container">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`chatbot-message ${message.sender}`}
                >
                  <div className={`message-bubble ${message.sender}`}>
                    {message.text}
                    {message.type === 'welcome' && (
                      <div className="welcome-icons">
                        <span>💡 Smart Advice</span>
                        <span>💰 Financial Guidance</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="chatbot-message bot"
                >
                  <div className="message-bubble bot typing">
                    <div className="typing-indicator">
                      <span>Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>

          <form onSubmit={handleSubmit} className="chatbot-input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a financial question..."
              className="chatbot-input"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="chatbot-submit-button"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}





      <style jsx>{`
        .chatbot-toggle-button {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background-color: #10B881;
          color: white;
          padding: 15px;
          border-radius: 50%;
          width: 60px; 
          height: 60px;
          border: none;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          display: flex; 
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .chatbot-container {
          position: fixed;
          bottom: 80px;
          right: 30px;
          width: 350px;
          border-radius: 10px;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          z-index: 999;
        }

        .chatbot-header {
          background-color: #10B881;
          color: white;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .chatbot-message-container {
          height: 450px;
          overflow-y: auto;
          padding: 15px;
          background-color: #d1d5db;
        }

        .chatbot-message {
          display: flex;
          margin-bottom: 10px;
        }

        .message-bubble {
          max-width: 80%;
          padding: 10px 15px;
          border-radius: 15px;
          line-height: 1.4;
        }

        .message-bubble.user {
          background-color: #6a1b9a;
          color: white;
          align-self: flex-end;
          margin-left: auto;
        }

        .message-bubble.bot {
          background-color: white;
          color: black;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .welcome-icons {
          display: flex;
          gap: 10px;
          margin-top: 5px;
          font-size: 0.8em;
          opacity: 0.7;
        }

        .chatbot-input-container {
          display: flex;
          background-color: #d1d5db;
          padding: 10px;
          border-top: 1px solid #e0e0e0;
        }

        .chatbot-input {
          flex-grow: 1;
          padding: 10px;
          border: 1px solid #e0e0e0;
          border-radius: 20px;
          margin-right: 10px;
        }

        .chatbot-submit-button {
          background-color: #0D9D6A;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chatbot-submit-button:disabled {
          opacity: 0.5;
        }

        .typing-indicator {
          animation: typing 1.4s infinite;
        }

        @keyframes typing {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        /* Responsive */
        @media (max-width: 600px) {
          .chatbot-container {
            width: 280px;
          }
          .chatbot-toggle-button {
            bottom: 20px;
            right: 20px;
          }
        }
      `}</style>
    </div>
    </div>

  );
};

export default Home;