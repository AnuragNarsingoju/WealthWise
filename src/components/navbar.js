import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Layout, 
  Settings, 
  Bell, 
  Search, 
  Activity,
  X,
  LogOut,
  Wallet
} from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { getBalance } from './Portfolio';

const Navbar = ({mail}) => {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [data, setData] = useState({});
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [balance, setBalance] = useState(getBalance());

  // Update balance when it changes in localStorage
  useEffect(() => {
    const checkBalance = () => {
      const newBalance = getBalance();
      if (newBalance !== balance) {
        console.log('Balance updated:', newBalance);
        setBalance(newBalance);
      }
    };
    
    // Check when component mounts
    checkBalance();
    
    // Set up interval to check periodically
    const intervalId = setInterval(checkBalance, 2000);
    
    // Listen for storage events (if balance is changed in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'userBalance') {
        checkBalance();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [balance]);

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleProfile = async (e) => {
    try {
      const getCookie = Cookies.get('sessionToken');
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}findemail?email=${encodeURIComponent(mail)}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      setData(response.data.user);
    } catch (error) {
      console.error('Error fetching recommendation:', error);
    }
  }

  useEffect(() => {
    if(mail){
      handleProfile()
    }
  },[mail])

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClick = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
  };

  const handleLogout = () => {
    Cookies.remove('sessionToken');
    Cookies.remove('userEmail');
    navigate('/',{ replace: true });
  };

  const navItems = [
    { 
      icon: <Home className="w-5 h-5" />, 
      label: 'Home', 
      key: 'home' 
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
        </svg>
      ),
      label: 'Chat With Niveshak',
      key: 'Chat With Niveshak'
    },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 
          shadow-lg transform transition-all duration-300
          ${
            isMobileMenuOpen
            ? 'bg-gradient-to-br from-purple-800/75 to-blue-900/75'
            : 'bg-gradient-to-br from-white-600/80 to-blue-800/40'
          }
        `}>
        <div className="mx-auto py-3 px-8">
          <div className="flex items-center justify-between">
            {/* Left Side - Logo */}
            <div className="flex items-center space-x-4" onClick={() => navigate('/home')} style={{cursor:'pointer'}}>
              <img 
                src="/navlogo1.png" 
                alt="App Logo" 
                className="w-12 h-12 rounded-full"
                style={{marginRight:'0px'}}
              />
              <span style={{marginLeft:'11px'}} className="text-xl font-bold text-white">WealthWise</span>
            </div>

            {/* Desktop Navigation - Center */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.key} 
                  onClick={() => {
                    setActiveTab(item.key);
                    if (item.key === 'home') {
                     navigate('/home',{ replace: true });
                    }
                    if (item.key === 'Chat With Niveshak') {
                      navigate('/chatbot',{ replace: true });
                    }
                  }}
                  className={`
                    group relative flex items-center 
                    transition-all duration-300 
                    ${activeTab === item.key 
                      ? 'text-white scale-110' 
                      : 'text-white/70 hover:text-white'}
                  `}
                >
                  {item.icon}
                  {activeTab === item.key && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-1 bg-white rounded-full animate"/>
                  )}
                </button>
              ))}
              
              {/* WealthWise Balance Button */}
              
            </div>

            {/* Right Side - Profile and Interactions */}
            <div className="flex items-center space-x-4 relative">
              <div 
                className="relative"
                onClick={handleClick}
                style={{marginRight:'5px', marginLeft:'110px'}}
              >
                <div 
                  onClick={() => {
                    if (!isMobile) {
                      setIsProfileDropdownOpen(!isProfileDropdownOpen);
                    }
                  }}
                  className="cursor-pointer"
                >
                  {data.profile ? (
                    <img
                      src={data.profile}
                      alt={data.name && data.name.charAt(0) ? data.name.charAt(0).toUpperCase() : 'Profile'}
                      className="w-12 h-12 rounded-full border-2 border-white/70 object-cover transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white/70 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg">
                      {data.name && data.name.charAt(0) ? (
                        
                        
                        
                        <span className="text-xl font-semibold text-gray-800">
                          {data.name.charAt(0).toUpperCase()}
                        </span>
                        
                      ) : (
                        <span className="fa fa-user-alt text-xl font-semibold text-gray-800"></span>
                      )}
                    </div>
                  )}
                </div>

                {!isMobile && isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 h-50 bg-gradient-to-br from-white-600/80 to-blue-800/40 shadow-lg rounded-lg border border-red-500 z-50 flex flex-col items-center justify-center">
                    <div className="p-4 border-b border-red-500 text-center w-full">
                      <p className="text-sm font-semibold text-gray-200 whitespace-normal">{data.name}</p>
                      <p className="text-sm font-semibold text-gray-200 mt-2 whitespace-normal">{data.email}</p>
                    </div>
                    
                    {/* Styled Wallet Section */}
                    <div className="w-full p-4 border-b border-red-500">
                      <div className="bg-gradient-to-r from-purple-600/40 to-blue-600/40 rounded-lg p-4 shadow-inner">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-300">Available Balance</span>
                          <Wallet className="w-4 h-4 text-blue-300" />
                        </div>
                        <div 
                          className="text-xl font-bold text-white"
                          onClick={() => navigate('/portfolio', { replace: true })}
                          style={{cursor: 'pointer'}}
                        >
                          {formatCurrency(balance)}
                        </div>
                        <div className="text-xs text-blue-300 mt-1">Click to manage your portfolio</div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-2 flex items-center justify-center text-red-500 hover:text-red-600"
                    >
                      <button className="w-4 h-4"/>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-br from-purple-800/75 to-blue-900/75 shadow-lg rounded-t-3xl animate-slide-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-6 text-center border-b">
              {data.profile ? (
                <img
                  src={data.profile}
                  alt={data.name && data.name.charAt(0) ? data.name.charAt(0).toUpperCase() : 'Profile'}
                  className="w-16 h-16 rounded-full mx-auto mb-3"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white/70 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg cursor-pointer mx-auto mb-3">
                  {data.name && data.name.charAt(0) ? (
                    <span className="text-xl font-semibold text-gray-800">
                      {data.name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <span className="fa fa-user-alt text-xl font-semibold text-gray-800"></span>
                  )}
                </div>
              )}
              <h2 className="text-xl text-gray-100 font-semibold">{data.name}</h2>
              <p className="text-gray-100">{data.email}</p>
              
              {/* WealthWise Balance for Mobile */}
              <div className="mt-4 w-full">
                <div className="bg-gradient-to-r from-purple-600/40 to-blue-600/40 rounded-lg p-4 shadow-inner">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-300">Available Balance</span>
                    <Wallet className="w-4 h-4 text-blue-300" />
                  </div>
                  <div 
                    className="text-xl font-bold text-white"
                    onClick={() => {
                      navigate('/portfolio', { replace: true });
                      setIsMobileMenuOpen(false);
                    }}
                    style={{cursor: 'pointer'}}
                  >
                    {formatCurrency(balance)}
                  </div>
                  <div className="text-xs text-blue-300 mt-1">Click to manage your portfolio</div>
                </div>
              </div>
            </div>

            <div className="py-4">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveTab(item.key);
                    if (item.key === 'home') {
                     navigate('/home',{ replace: true });
                    }
                    if (item.key === 'Chat With Niveshak') {
                      navigate('/chatbot',{ replace: true });
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-6 py-3 flex items-center transition-colors text-gray-100 hover:bg-blue-100 hover:text-purple-900"
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="p-4 border-t">
              <button 
                className="w-full py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
