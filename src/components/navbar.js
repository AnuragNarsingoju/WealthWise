import React, { useState,useEffect } from 'react';
import { 
  Home, 
  Layout, 
  Settings, 
  Bell, 
  Search, 
  Activity,
  X
} from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
const Navbar = ({mail}) => {
  console.log("navbar : ",mail)
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [data,setdata] = useState({});

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
      setdata(response.data.user);
      console.log(response.data.user)
      
     
    } catch (error) {
        console.error('Error fetching recommendation:', error);
    }
  }
  useEffect(()=>{
    if(mail){
      handleProfile()
    }
    
  },[mail])
  // 

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Example mobile breakpoint

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




  const navItems = [
    { 
      icon: <Home className="w-5 h-5" />, 
      label: 'Home', 
      key: 'home' 
    },
    { 
      icon: <Layout className="w-5 h-5" />, 
      label: 'Dashboard', 
      key: 'dashboard' 
    },
    { 
      icon: <Activity className="w-5 h-5" />, 
      label: 'Analytics', 
      key: 'analytics' 
    },
    { 
      icon: <Settings className="w-5 h-5" />, 
      label: 'Settings', 
      key: 'settings' 
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <nav
          className={`fixed top-0 left-0 right-0 z-50 
            shadow-lg transform transition-all duration-300
            ${
              isMobileMenuOpen
              ? 'bg-gradient-to-br from-purple-800/75 to-blue-900/75'
              : 'bg-gradient-to-br from-white-600/80 to-blue-800/40'
            }
          `}
        >
        <div className="mx-auto py-3 px-8">
          <div className="flex items-center justify-between ">
            {/* Left Side - Logo */}
            <div className="flex items-center space-x-4" onClick={()=>{navigate('/home')}} style={{cursor:'pointer'}}>
              <img 
                src="/navlogo1.png" 
                alt="App Logo" 
                className="w-10 h-10 rounded-full"
              />
              <span className="text-xl font-bold text-white">WealthWise</span>
            </div>

            {/* Desktop Navigation - Center */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
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
                    <span 
                      className="absolute -bottom-2 left-1/2 
                      -translate-x-1/2 
                      h-1 w-1 bg-white 
                      rounded-full 
                      animate"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Right Side - Search and Interactions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              {/* <form onSubmit={handleSearch} className="relative hidden md:block">
                <div className="flex items-center">
                  <button 
                    type="button"
                    onClick={() => setIsSearchActive(!isSearchActive)}
                    className="text-white/70 hover:text-white 
                    transition-colors mr-2"
                  >
                    <Search className="w-5 h-5" />
                  </button>

                  {isSearchActive && (
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..." 
                      className="
                      bg-white/20 border border-white/30 rounded-full 
                      px-3 py-1 w-48
                      text-white 
                      placeholder-white/50
                      animate-slide-in-right
                      focus:outline-none 
                      focus:ring-2 
                      focus:ring-white/50"
                    />
                  )}
                </div> */}
              {/* </form> */}

              {/* Profile Photo */}
              <div 
                className="relative "
                onClick={handleClick}
                style={{marginRight:'5px',marginLeft:'110px'}}
              >
                 {data.profile ? (
                    <img
                      src={data.profile}
                      alt={data.name && data.name.charAt(0) ? data.name.charAt(0).toUpperCase() : 'Profile'}
                      className="w-12 h-12 rounded-full 
                        border-2 border-white/70 
                        object-cover 
                        transform transition-all duration-300 
                        group-hover:scale-110 
                        group-hover:rotate-6 
                        group-hover:shadow-lg 
                        cursor-pointer"
                    />
                  ) : (
                    <span className="text-xl font-bold text-gray-700">
                      {data.name && data.name.charAt(0) ? data.name.charAt(0).toUpperCase() : 'Profile'}
                    </span>
                  )}
                {/* <div className="absolute -top-2 -right-2 
                h-4 w-4 bg-green-500 
                rounded-full border-2 border-white 
                animate-ping 
                group-hover:animate-none"></div> */}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 
          md:hidden " 
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 
            bg-gradient-to-br from-purple-800/75 to-blue-900/75 shadow-lg rounded-t-3xl 
            animate-slide-in-up"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Close Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 
              text-red-500 hover:text-red-700"
            >
              <X className="w-6 h-6" />
            </button>

            {/* User Profile Section */}
           <div className="p-6 text-center border-b">
              <img 
                src={data.profile} 
                alt={data.name ? `${data.name && data.name.charAt(0) ? data.name.charAt(0).toUpperCase() : 'User Profile'}` : 'User Profile'} 
                className="w-16 h-16 rounded-full mx-auto mb-3"
              />
              <h2 className="text-xl text-gray-100 font-semibold">{data.name}</h2>
              <p className="text-gray-100">{data.email}</p>
            </div>

            {/* Mobile Navigation Items */}
            <div className="py-4">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveTab(item.key);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full px-6 py-3 flex items-center 
                    transition-colors text-gray-100
                    ${activeTab === item.key 
                      ? 'bg-blue-100 text-purple-500' 
                      : 'hover:bg-blue-100 hover:text-purple-900 '}
                  `}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Additional Actions */}
            <div className="p-4 border-t">
              <button 
                className="w-full py-2 
                bg-red-500 text-white 
                rounded-full 
                hover:bg-red-600 
                transition-colors"
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
