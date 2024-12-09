import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const generateColorPalette = () => {
  const hue = Math.floor(Math.random() * 360);
  return {
    primary: `hsl(${hue}, 70%, 50%)`,
    light: `hsl(${hue}, 70%, 90%)`,
    dark: `hsl(${hue}, 70%, 30%)`,
    text: `hsl(${hue}, 70%, 20%)`
  };
};

const StockMarketPattern = React.memo(() => (
  <>
    <style>
    {`
      body, html {
        overflow: hidden;
        margin: 0;
        height: 100%;
        
      }
      .video-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        
        height: 100vh;
        z-index: -1; /* Keep the video in the background */
      }
      .video-container video {
        width: 100%;
        
        height: 100%;
        object-fit: cover; /* Ensures the video covers the screen properly */\
      }
    `}
  </style>
    <defs>
      <pattern
        id="stock-pattern"
        x="0"
        y="0"
        width="100%"
        height="100%"
        patternUnits="userSpaceOnUse"
      >
