import React, { useState, useEffect } from "react";
import Navbar from './navbar';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const ExpenseDate = ({ mail }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const getCookie = Cookies.get('sessionToken');
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}getData`, 
        { 
          params: { "email": mail },
          headers: {
            Authorization: `Bearer ${getCookie}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );



      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (mail) {
      fetchData();
    }
  }, [mail]);

  // Loading state
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="
          min-h-screen 
          w-full 
          bg-gradient-to-br 
          from-blue-600/90 
          to-purple-600/90 
          overflow-x-hidden
          flex 
          items-center 
          justify-center
        ">
          <div className="flex items-center justify-center">
            <div className="animate-spin w-16 h-16 border-4 border-white border-t-transparent border-opacity-50 rounded-full">
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <Navbar />
      <div className="
        min-h-screen 
        w-full 
        bg-gradient-to-br 
        from-blue-600/90 
        to-purple-600/90 
        overflow-x-hidden
        flex 
        items-center 
        justify-center
      ">
        <div 
          className="
            container 
            mx-auto 
            px-4 
            py-12 
            md:px-8 
            lg:px-16
          "
          style={{ marginTop: data.length > 6 ? '90px' : '0px' }}
        >
          <div className={data.length < 6 && window.innerWidth > 600
          ? "flex flex-row justify-center items-center gap-4 md:gap-6 lg:gap-8"
          : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8"
        }>
            {data.map((dateItem, index) => {
              const date = new Date(dateItem.date.slice(0,10));         
              return (
                <div 
                  key={index} 
                  className="
                    w-full 
                    bg-white/15 
                    backdrop-blur-lg 
                    rounded-2xl 
                    p-4 
                    md:p-6 
                    flex 
                    flex-col 
                    justify-center 
                    items-center 
                    text-center 
                    transform 
                    transition-all 
                    duration-500 
                    hover:scale-105 
                    hover:shadow-2xl
                    shadow-lg
                    border 
                    border-white/20
                    group
                    relative 
                    overflow-hidden
                    cursor-pointer
                  "
                  onClick={() => {navigate('/expenseTracker',{state: {data: dateItem, mail: mail}}) }}
                >
                  {/* Rest of your existing render code remains the same */}
                  <div className="
                    text-4xl 
                    md:text-5xl 
                    lg:text-6xl 
                    font-bold 
                    text-white 
                    mb-2
                    drop-shadow-lg
                    relative
                    z-10
                    transform 
                    transition-transform 
                    group-hover:-translate-y-2
                  ">
                    {date.getDate()}
                  </div>
                  
                  <div className="
                    text-sm 
                    md:text-base 
                    font-medium 
                    text-white/80 
                    uppercase 
                    tracking-wider
                    relative
                    z-10
                    transform 
                    transition-transform 
                    group-hover:scale-105
                  ">
                    {date.toLocaleString('default', { month: 'short' })} {date.getFullYear()}
                  </div>
                  
                  <div className="
                    text-xs 
                    md:text-sm 
                    text-white/70 
                    mt-1
                    mb-3
                    relative
                    z-10
                    transform 
                    transition-transform 
                    group-hover:scale-105
                  ">
                    {date.toLocaleString('default', { weekday: 'long' })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpenseDate;
