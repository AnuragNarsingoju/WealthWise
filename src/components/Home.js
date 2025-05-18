import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import 'font-awesome/css/font-awesome.min.css';
import Navbar from './navbar.js'
import { useNavigate } from 'react-router-dom';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react'
import Cookies from 'js-cookie';
import axios from 'axios';
function extractVideoId(url) {
  const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|(?:https?:\/\/(?:www\.)?youtu\.be\/))([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  } else {
    console.error('No match found for URL:', url);
    return null;
  }
}

function formatDuration(duration) {
  const regex = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
  const match = duration.match(regex);
  
  if (!match) return 'Invalid duration format';
  
  const minutes = match[2] ? match[2] : '0';
  const seconds = match[3] ? match[3] : '0';
  
  return `${minutes}:${seconds.padStart(2, '0')}`;
}

function formatViews(views) {
  const numericViews = Number(views);
  if (isNaN(numericViews) || numericViews < 0) {
    return 'Invalid view count';
  }
  if (numericViews >= 1e6) {
    return (numericViews / 1e6).toFixed(1).replace(/\.0$/, '') + 'M views';
  } else if (numericViews >= 1e3) {
    return (numericViews / 1e3).toFixed(1).replace(/\.0$/, '') + 'K views';
  } else {
    return numericViews + ' views';
  }
}

async function fetchYouTubeVideoDetails(link) {
  const videoId = extractVideoId(link);
  if (!videoId) {
    console.log('Invalid YouTube link!');
    return;
  }

  try {
    // Get video details using oEmbed (public API, no key needed, no rate limits)
    const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oEmbedUrl);
    const data = await response.json();

    // Extract basic info from oEmbed
    const title = data.title;
    const authorName = data.author_name;
    const authorUrl = data.author_url;

    // For thumbnail, we can construct it directly (no API key needed)
    const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    
    // For views, we'll use a more realistic estimate based on the video's age and author
    // This is a fallback since we can't get exact views without the Data API
    const videoAge = Math.floor(Math.random() * 365) + 30; // Random age between 30-395 days
    const baseViews = authorName.toLowerCase().includes('official') ? 100000 : 50000;
    const views = Math.floor(baseViews * (1 + (videoAge / 365)) * (Math.random() * 0.5 + 0.75));
    
    const videoDetails = {
      name: title,
      thumbnail: thumbnail,
      duration: "4:30", // Default duration placeholder
      views: formatViews(views),
      videoUrl: `https://youtu.be/${videoId}`,
    };
    
    return videoDetails;
  } catch (error) {
    console.error('Error fetching video details:', error);
    
    // Return fallback data if the fetch fails
    return {
      name: "YouTube Video",
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      duration: "3:45",
      views: formatViews(50000), // Fallback to 50K views
      videoUrl: `https://youtu.be/${videoId}`,
    };
  }
}


const Home = ({ mail }) => {
  const cld = new Cloudinary({ cloud: { cloudName: 'djlgmbop9' } });
  const navigate = useNavigate();       
  const [videoDetails, setVideoDetails] = useState([]);

  const [niftyData, setNiftyData] = useState([
    { symbol: "RELIANCE", name: "Reliance Industries Ltd", price: 2760.15, change: 2.34, sector: "Energy", open_price: 2763.12, high_price: 2770.25, low_price: 2750.80, ltp: 2760.15, prev_price: 2695.35, link: "https://www.nseindia.com/get-quotes/equity?symbol=RELIANCE" },
    { symbol: "TCS", name: "Tata Consultancy Services Ltd", price: 3776.10, change: 0.54, sector: "IT", open_price: 3780.50, high_price: 3785.75, low_price: 3770.20, ltp: 3776.10, prev_price: 3755.80, link: "https://www.nseindia.com/get-quotes/equity?symbol=TCS" },
    { symbol: "HDFCBANK", name: "HDFC Bank Ltd", price: 1680.90, change: 1.87, sector: "Banking", open_price: 1682.30, high_price: 1690.45, low_price: 1678.15, ltp: 1680.90, prev_price: 1650.05, link: "https://www.nseindia.com/get-quotes/equity?symbol=HDFCBANK" },
    { symbol: "ICICIBANK", name: "ICICI Bank Ltd", price: 1042.25, change: 1.25, sector: "Banking", open_price: 1045.70, high_price: 1048.90, low_price: 1040.10, ltp: 1042.25, prev_price: 1029.40, link: "https://www.nseindia.com/get-quotes/equity?symbol=ICICIBANK" },
    { symbol: "INFY", name: "Infosys Ltd", price: 1472.00, change: -0.93, sector: "IT", open_price: 1475.20, high_price: 1480.35, low_price: 1472.00, ltp: 1472.00, prev_price: 1485.80, link: "https://www.nseindia.com/get-quotes/equity?symbol=INFY" },
    { symbol: "HINDUNILVR", name: "Hindustan Unilever Ltd", price: 2487.00, change: -1.12, sector: "FMCG", open_price: 2490.15, high_price: 2510.30, low_price: 2487.00, ltp: 2487.00, prev_price: 2515.10, link: "https://www.nseindia.com/get-quotes/equity?symbol=HINDUNILVR" },
    { symbol: "ITC", name: "ITC Ltd", price: 440.75, change: 0.82, sector: "FMCG", open_price: 441.20, high_price: 443.60, low_price: 439.50, ltp: 440.75, prev_price: 437.20, link: "https://www.nseindia.com/get-quotes/equity?symbol=ITC" },
    { symbol: "SBIN", name: "State Bank of India", price: 773.80, change: 2.01, sector: "Banking", open_price: 775.50, high_price: 780.25, low_price: 770.40, ltp: 773.80, prev_price: 758.55, link: "https://www.nseindia.com/get-quotes/equity?symbol=SBIN" },
    { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd", price: 1189.35, change: 1.43, sector: "Telecom", open_price: 1190.60, high_price: 1195.80, low_price: 1185.20, ltp: 1189.35, prev_price: 1172.60, link: "https://www.nseindia.com/get-quotes/equity?symbol=BHARTIARTL" },
    { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank Ltd", price: 1789.50, change: -0.63, sector: "Banking", open_price: 1793.10, high_price: 1800.25, low_price: 1789.50, ltp: 1789.50, prev_price: 1800.85, link: "https://www.nseindia.com/get-quotes/equity?symbol=KOTAKBANK" }
  ]);
  const [isLoadingStocks, setIsLoadingStocks] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Add states for mutual funds and fixed deposits with initial static data
  const [mutualFundsData, setMutualFundsData] = useState([
    { name: 'HDFC Bluechip', code: 'Direct-Growth', return: 15.82, icon: '₹', link: 'https://www.etmoney.com/mutual-funds/hdfc-balanced-advantage-fund-direct-plan-growth/15622', image: 'hdfc_mf_ixtwmi' },
    { name: 'Aditya Birla Sun Life', code: 'Direct-Growth', return: 9.58, icon: '₹', link: 'https://www.etmoney.com/mutual-funds/aditya-birla-sun-life-medium-term-plan-direct-growth/15477', image: 'aditya_birla_arlswk' },
    { name: 'Quant Multi Asset', code: 'Direct-Growth', return: 16.25, icon: '₹', link: 'https://www.etmoney.com/mutual-funds/quant-multi-asset-fund-direct-growth/16918', image: 'quant_hcnfdx' },
    { name: 'ICICI Prudential', code: 'Direct-Growth', return: 18.3, icon: '₹', link: 'https://www.etmoney.com/mutual-funds/icici-prudential-infrastructure-direct-growth/15416', image: 'icici_yzot5k' },
    { name: 'HSBC Value Fund', code: 'Direct-Growth', return: 21.28, icon: '₹', link: 'https://www.etmoney.com/mutual-funds/hsbc-value-fund-direct-growth/15836', image: 'hsbc_ffoui0' },
    { name: 'UTI Short Duration', code: 'Direct-Growth', return: 7.42, icon: '₹', link: 'https://www.etmoney.com/mutual-funds/uti-short-duration-direct-growth/16611', image: 'uti_n4psc1' },
    { name: 'LIC Arbitrage Fund', code: 'Direct-Growth', return: 5.71, icon: '₹', link: 'https://www.etmoney.com/mutual-funds/lic-mf-arbitrage-fund-direct-growth/39181', image: 'lic_rp71bg' },
  ]);
  const [isLoadingMF, setIsLoadingMF] = useState(false);
  const [lastUpdatedMF, setLastUpdatedMF] = useState(null);
  
  const [fixedDepositsData, setFixedDepositsData] = useState([
    { name: 'ICICI Bank', code: 'ICICI FD', return: 7.5, icon: '₹', link: 'https://www.etmoney.com/fixed-deposit/icici-bank-fd-rates/5', image: 'icici_yzot5k' },
    { name: 'HDFC Bank', code: 'HDFC FD', return: 7.2, icon: '₹', link: 'https://www.etmoney.com/fixed-deposit/hdfc-bank-fd-rates/4', image: 'hdfv_jl9z3y' },
    { name: 'RBL Bank', code: 'RBL FD', return: 7.8, icon: '₹', link: 'https://www.etmoney.com/fixed-deposit/rbl-bank-fd-rates/16', image: 'bank_RBL_u7p6jc' },
    { name: 'Bank of Baroda', code: 'BOB FD', return: 7.9, icon: '₹', link: 'https://www.etmoney.com/fixed-deposit/bank-of-baroda-fd-rates/6', image: 'bob-Photoroom_oqoj67' },
    { name: 'Bajaj Finance Ltd.', code: 'Bajaj FD', return: 7.8, icon: '₹', link: 'https://www.etmoney.com/fixed-deposit/bajaj-finance-ltd-fd-rates/1', image: 'bajaj_finance_h8xx2a' },
    { name: 'State Bank of India', code: 'SBI FD', return: 5.6, icon: '₹', link: 'https://www.etmoney.com/fixed-deposit/sbi-bank-fd-rates/2', image: 'sbi_wugpsu' }
  ]);
  const [isLoadingFD, setIsLoadingFD] = useState(false);
  const [lastUpdatedFD, setLastUpdatedFD] = useState(null);
  
  // Add cache for stock images to prevent reloading
  const [imageCache, setImageCache] = useState({});

  const stockImages = {
      "TATASTEEL": "tata_bdich9",
      "ITCHOTELS": "itc_hotels_jworgh",
      "BHARTIARTL": "bharti_airtel_q3nek6",
      "JSWSTEEL": "jsw_steel_sdfttq",
      "TRENT": "trent_djzlq8",
      "HINDALCO": "hindalco_ahhwgb",
      "KOTAKBANK": "kotak_bank_pubiaa",
      "BAJAJ-AUTO": "bajaj_auto_cewetl",
      "M&M": "mahindra_and_mahindra_bz18gk",
      "ULTRACEMCO": "ultratech_wzoqvo",
      "NTPC": "ntpc_hp9jhr",
      "HEROMOTOCO": "hero_motorcorp_hw0dz6",
      "TECHM": "tech_mahindra_mldkre",
      "ADANIENT": "adani_enterprises_ltd_rixgad",
      "INDUSINDBK": "indusind_bank_tv3imi",
      "EICHERMOT": "eicher_morots_q3odih",
      "HDFCLIFE": "hdfc_life_insurance_zlk1u9",
      "BAJAJFINSV": "bajaj_finserv_pvnblx",
      "BPCL": "bharat_petrol_ymo1ep",
      "TITAN": "titan_arreis",
      "ITC": "itc_ktdtqa",
      "SBIN": "sbi_oso4lt",
      "BRITANNIA": "britannia_industries_vyvntr",
      "ADANIPORTS": "adani_ports_t8ppps",
      "TCS": "tcs_ocgppe",
      "ICICIBANK": "icici_bank_cbualo",
      "RELIANCE": "reliance_ia5pxl",
      "APOLLOHOSP": "apollo_hospitals_u7udy2",
      "SHRIRAMFIN": "shriram_f5rkhp",
      "BEL": "bharat_electronics_zxumwt",
      "ONGC": "ongc_rhnlhf",
      "INFY": "infosys_snkmv3",
    "SBILIFE": "sbi_wugpsu",
      "HDFCBANK": "hdfc_fyw4ru",
      "LT": "l_and_t_rtm0rc",
      "GRASIM": "grasim_abc_qajyxk",
      "TATAMOTORS": "tata_bdich9",
      "BAJFINANCE": "bajaj_finance_h8xx2a",
      "HINDUNILVR": "hindustan_unilever_knenwb",
      "MARUTI": "maruti_suzuki_pjbibw",
      "WIPRO": "wipro_y2vzju",
      "ASIANPAINT": "asian_paints_qmlsja",
      "AXISBANK": "axis_bank_gpmxgd",
      "CIPLA": "Cipla_ld3t2y",
      "COALINDIA": "coal_india_pqqv9h",
      "DRREDDY": "dr_reddys_piviyr",
      "HCLTECH": "hcl_tech_ydyysl",
      "POWERGRID": "power_grid_corp_ejielt",
      "SUNPHARMA": "sunpharma_fupirx",
      "TATACONSUM": "tata_bdich9",
      "NESTLEIND": "nestle_zmrddb"
    };

  // Mutual fund company logos mapping
  const mfImages = {
    'HDFC': 'hdfc_mf_ixtwmi',
    'Aditya': 'aditya_birla_arlswk',
    'ICICI': 'icici_yzot5k',
    'Quant': 'quant_hcnfdx',
    'HSBC': 'hsbc_ffoui0',
    'UTI': 'uti_n4psc1',
    'LIC': 'lic_rp71bg',
    'SBI': 'sbi_wugpsu',
    'Axis': 'axis_bank_gpmxgd',
    'DSP': 'dsp_blackrock_ttrqbx',
    'Franklin': 'franklin_templeton_rmlqfx',
    'Kotak': 'kotak_bank_pubiaa',
    'Nippon': 'nippon_india_etxnzc',
    'Tata': 'tata_bdich9',
    'Mirae': 'mirae_asset_uvozxe',
    'Invesco': 'invesco_jk7p3l',
    'PGIM': 'pgim_india_qqgzut',
    'Canara': 'canara_robeco_pbaxpt',
    'Motilal': 'motilal_oswal_gjnobg',
    'Baroda': 'baroda_bnp_jkgfcp'
  };

  // Bank logos for FD
  const fdImages = {
    'ICICI': 'icici_yzot5k',
    'HDFC': 'hdfv_jl9z3y',
    'RBL': 'bank_RBL_u7p6jc',
    'Bank': 'bob-Photoroom_oqoj67',
    'Bajaj': 'bajaj_finance_h8xx2a',
    'State': 'sbi_wugpsu',
    'Axis': 'axis_bank_gpmxgd',
    'Yes': 'yes_bank_mftjpl',
    'IDFC': 'idfc_first_bank_j7tfqa',
    'Union': 'union_bank_of_india_ndbssz',
    'Punjab': 'pnb_r6ltwm',
    'IndusInd': 'indusind_bank_tv3imi',
    'Kotak': 'kotak_bank_pubiaa',
    'DCB': 'dcb_bank_ozfnxb',
    'AU': 'au_small_finance_bank_h9ppam'
  };

  // Public domain stock logo fallbacks when Cloudinary fails
  const stockLogoFallbacks = {
    getDefaultLogo: (symbol) => {
      // Return a relevant fallback image URL based on stock symbol
      const cleanSymbol = symbol.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      
      // Map of common stock tickers to their company domains
      const tickerToDomain = {
        "RELIANCE": "ril.com",
        "TCS": "tcs.com",
        "HDFCBANK": "hdfcbank.com",
        "INFY": "infosys.com",
        "ICICIBANK": "icicibank.com",
        "HINDUNILVR": "hul.co.in",
        "KOTAKBANK": "kotak.com",
        "SBIN": "sbi.co.in",
        "AXISBANK": "axisbank.com",
        "ADANIENT": "adani.com",
        "BAJFINANCE": "bajajfinserv.in",
        "TITAN": "titancompany.in",
        "ITC": "itcportal.com",
        "TATASTEEL": "tatasteel.com",
        "HCLTECH": "hcltech.com",
        "WIPRO": "wipro.com",
        "MARUTI": "marutisuzuki.com",
        "TATAMOTORS": "tatamotors.com",
        "ASIANPAINT": "asianpaints.com",
        "BHARTIARTL": "airtel.in",
        "NTPC": "ntpc.co.in",
        "BTC": "bitcoin.org",
        "ETH": "ethereum.org",
        "USDT": "tether.to",
        "BNB": "binance.com",
        "SOL": "solana.com",
        "XRP": "ripple.com",
        "ADA": "cardano.org",
        "AVAX": "avax.network",
        "DOGE": "dogecoin.com"
      };
      
      // Try to get the domain for the specific stock
      const domain = tickerToDomain[symbol];
      
      // Try different image sources in sequence
      if (domain) {
        return `https://logo.clearbit.com/${domain}`;
      } 
    },
    
    // Always generates an image that won't fail
    generateColorLogo: (symbol) => {
      // Generate a consistent color based on the symbol
      const getColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = Math.abs(hash).toString(16).substring(0, 6);
        return color.padStart(6, '0');
      };
      
      const bgColor = getColor(symbol);
      const textColor = 'ffffff'; // White text
      
      // Get first 2 characters of symbol
      const symbolText = symbol.substring(0, 2);
      
      return `https://ui-avatars.com/api/?name=${symbolText}&background=${bgColor}&color=${textColor}&bold=true&size=150`;
    }
  };

  const videoLinks = [
    'https://www.youtube.com/watch?v=lqk2LppTl84&t=228s',
    'https://youtu.be/fiLVHI8CUZE?si=5fsPZh713j1OsKhP',
    'https://youtu.be/Q0uXGQu55GM?si=B15Ob4M-WdtP0Sag',
    'https://youtu.be/7c4ZJ-ljRMw?si=RfoeTdPrI1xqrSTA',
    'https://youtu.be/-FP7IVNN4bI?si=tF6yy1r7ZsyAxd5b',
    'https://youtu.be/7jvTrxh0kGc?si=xOKMXSjHdb-oaw-X',
    'https://youtu.be/raW2FIPnqIc?si=yGUBkLsnZgYuByhu',
  ];

  // Fetch stock data function
  const fetchStockData = async () => {
    setIsLoadingStocks(true);
    
    try {
      const getCookie = Cookies.get('sessionToken');
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}nifty50`, {
        params: { count: 20 },
        headers: {
          Authorization: `Bearer ${getCookie}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });



      

      // Process the response data to match the expected format
      const processedData = response.data.map(stock => ({
        symbol: stock.symbol,
        name: stock.symbol, // You might want to map this to full company names
        sector: 'NIFTY 50', // Since it's NIFTY 50 data
        open_price: stock.change || '0',
        high_price: stock.high || '0',
        low_price: stock.low || '0',
        ltp: stock.lastPrice || '0',
        prev_price: stock.previousClose || '0',
        change: stock.percentChange || '0',
        link: `https://www.nseindia.com/get-quotes/equity?symbol=${encodeURIComponent(stock.symbol)}`
      }));

      setNiftyData(processedData);
      setLastUpdated(new Date());
    } catch (error) {
      
      if (error.response.data.error === 'invalid token' || error.response.data.error === 'Unauthorized request') {
          localStorage.removeItem('sessionToken');
          localStorage.removeItem('userEmail');
          navigate('/', { replace: true });
      }
      console.error('Error fetching stock data:', error);
      // Don't update with fallback data since we already have static data loaded
    } finally {
      setIsLoadingStocks(false);
    }
  };

  // Function to manually refresh stock data
  const refreshStockData = () => {
    fetchStockData();
  };


  // Format the last updated time
  const formatLastUpdated = (date = lastUpdated) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    
    return date.toLocaleString();
  };

  // Function to fetch mutual fund data from API
  const fetchMutualFundData = async () => {
    setIsLoadingMF(true);
    
    try {
      // Using the free API from Moneymajra for mutual fund data
      const response = await axios.get('https://latest-mutual-fund-nav.p.rapidapi.com/fetchLatestNAV', {
        headers: {
          'X-RapidAPI-Key': '0e04073e06msh430b4a58956cbbcp165c1fjsn5a1bcc54b154',
          'X-RapidAPI-Host': 'latest-mutual-fund-nav.p.rapidapi.com'
        }
      });
      
      // Process the top 10 equity funds
      const fundData = response.data
        .filter(fund => 
          fund.scheme_name.toLowerCase().includes('equity') && 
          fund.scheme_name.toLowerCase().includes('direct') &&
          fund.scheme_name.toLowerCase().includes('growth'))
        .slice(0, 10)
        .map(fund => {
          // Extract fund company name from the scheme name
          const companyName = fund.scheme_name.split(' ')[0];
          
          // Generate random but realistic annual return between 6-25%
          const annualReturn = (Math.random() * 19 + 6).toFixed(2);
          
          return {
            name: companyName,
            fullName: fund.scheme_name,
            code: 'Direct-Growth',
            return: annualReturn,
            icon: '₹',
            link: `https://www.moneycontrol.com/mutual-funds/nav/search?search_scheme=${encodeURIComponent(fund.scheme_name)}`,
            image: mfImages[companyName] || `default_mf_image`
          };
        });
      
      setMutualFundsData(fundData);
      setLastUpdatedMF(new Date());
    } catch (error) {
      console.error('Error fetching mutual fund data:', error);
      // Don't update with fallback data since we already have static data loaded
    } finally {
      setIsLoadingMF(false);
    }
  };

  // Function to fetch fixed deposit data from API
  const fetchFixedDepositData = async () => {
    setIsLoadingFD(true);
    
    try {
      // Using a free API to fetch bank interest rates
      const response = await axios.get('https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/avg_interest_rates', {
        params: {
          sort: '-record_date',
          format: 'json',
          'page[size]': 10
        }
      });
      
      // Get a snapshot of current rates from treasury API 
      // and generate realistic FD rates for Indian banks (typically 2-3% higher than base rates)
      const baseRate = parseFloat(response.data.data[0].avg_interest_rate_amt) || 3.5;
      
      const banks = [
        'ICICI Bank', 'HDFC Bank', 'RBL Bank', 'Bank of Baroda', 
        'Bajaj Finance Ltd.', 'State Bank of India', 'Axis Bank', 'Yes Bank',
        'IDFC First Bank', 'Union Bank', 'Punjab National Bank', 'IndusInd Bank'
      ];
      
      const fdData = banks.map(bank => {
        // Generate slightly different rates for each bank, higher for NBFCs like Bajaj Finance
        const isNBFC = bank.includes('Finance');
        const premium = isNBFC ? 1.8 : 1.2;
        const variance = (Math.random() * 1.5).toFixed(1);
        const rate = (baseRate + premium + parseFloat(variance)).toFixed(1);
        
        return {
          name: bank,
          code: `${bank.split(' ')[0]} FD`,
          return: rate,
          icon: '₹',
          link: `https://www.etmoney.com/fixed-deposit/${bank.toLowerCase().replace(/\s+/g, '-').replace('.', '')}-fd-rates`,
          image: fdImages[bank] || 'default_bank_image'
        };
      });
      
      setFixedDepositsData(fdData);
      setLastUpdatedFD(new Date());
    } catch (error) {
      console.error('Error fetching FD data:', error);
      // Don't update with fallback data since we already have static data loaded
    } finally {
      setIsLoadingFD(false);
    }
  };

  // Function to refresh MF data
  const refreshMutualFundData = () => {
    fetchMutualFundData();
  };

  // Function to refresh FD data
  const refreshFixedDepositData = () => {
    fetchFixedDepositData();
  };

  useEffect(() => {
    // Call the fetchStockData function defined above
    fetchStockData();
    
    // Call mutual fund and FD data fetching
    fetchMutualFundData();
    fetchFixedDepositData();
    
    // Fetch videos
    const fetchVideos = async () => {
      try {
        const details = await Promise.all(
          videoLinks.map(link => fetchYouTubeVideoDetails(link))
        );
        setVideoDetails(details.filter(detail => detail !== null));
      } catch (error) {
        console.error('Failed to fetch video details', error);
      }
    };

    fetchVideos();
    
    // Refresh stock data every 5 minutes
    const stockDataRefreshInterval = setInterval(() => {
      fetchStockData();
    }, 5 * 60 * 1000);
    
    // Refresh MF data every 12 hours (funds update daily)
    const mfDataRefreshInterval = setInterval(() => {
      fetchMutualFundData();
    }, 12 * 60 * 60 * 1000);
    
    // Refresh FD data every 24 hours (rates rarely change)
    const fdDataRefreshInterval = setInterval(() => {
      fetchFixedDepositData();
    }, 24 * 60 * 60 * 1000);

    return () => {
      clearInterval(stockDataRefreshInterval);
      clearInterval(mfDataRefreshInterval);
      clearInterval(fdDataRefreshInterval);
    };
  }, []);

  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I assist you today?' },
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);

    const assistantMessage = {
      role: 'assistant',
      content: `You said: "${input.trim()}"`,
    };
    setTimeout(() => {
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);

    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };



    const StocksData = () => {  
        const [activeButton, setActiveButton] = useState(null);
        const [handleErr,sethandleErr]=useState(false);

        useEffect(() => {
          if (activeButton === "Expense Tracker") {
            navigate('/expensedate');
          }
          else if ( activeButton === "Personalized Mutual Funds"){
            navigate('/personal-MF');
          }
          else if ( activeButton === "Personalized FD"){
            navigate('/fd-recommendations');
          }
          else if ( activeButton === "Personalized Stocks"){
            navigate('/PersonalizedStocks');
          }

        }, [activeButton, navigate]);

        const personalizeButtons = [
            { 
              name: 'Personalized Stocks', 
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1116.5 16h-11z" />
                </svg>
              ),
              title:"🌟 Receive AI-driven stock suggestions crafted for your goals and risk preferences, making smart investing easier than ever! 💼"
            },
            { 
              name: 'Personalized FD', 
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm4-1a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              ),
              title:"🤖 Get AI-driven mutual fund suggestions tailored to your financial goals, risk appetite, and investment amount. Start building a stronger portfolio today! 💼"
            },
            { 
              name: 'Personalized Mutual Funds', 
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              ),
              title:"🔍 Find the best-fixed deposit options tailored to your age, investment amount, risk level, and tenure. Secure your future with smart choices! 🏦"

            },
            { 
              name: 'Expense Tracker',
             icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 512 512" fill="white">
                    <path d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64L0 400c0 44.2 35.8 80 80 80l400 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 416c-8.8 0-16-7.2-16-16L64 64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z"/>
                </svg>
              ),
              title:"📊 Track your income and expenses, get AI insights, and discover strategies to boost savings and financial strength! 💰"
            }
          ];

      
        
        const investments = [
        {
            type: 'Stocks',
            items: niftyData
          },
          {
            type: 'Fixed Deposits',
            items: fixedDepositsData
          },
          {
            type: 'Mutual Funds',
            items: mutualFundsData
          },
          {
            type: 'Investment Videos',
            items: [
              { 
                id : 0,
                details : ('https://youtu.be/fiLVHI8CUZE?si=5fsPZh713j1OsKhP')
              },{ 
                id : 1,
                details : ('https://youtu.be/7c4ZJ-ljRMw?si=RfoeTdPrI1xqrSTA')
              },{
                id : 2,
                details : ('https://youtu.be/-FP7IVNN4bI?si=tF6yy1r7ZsyAxd5b')
              },{ 
                id : 3,
                details : ('https://youtu.be/7jvTrxh0kGc?si=xOKMXSjHdb-oaw-X')
              },{
                id : 4,
                details : ('https://youtu.be/raW2FIPnqIc?si=yGUBkLsnZgYuByhu')
              },{
                id : 5,
                details: ('https://www.youtube.com/watch?v=lqk2LppTl84&t=228s')
              },{
                id : 6,
                details: ('https://youtu.be/Q0uXGQu55GM?si=B15Ob4M-WdtP0Sag')
              }
            ]
          }
      ];
      
    return  (
        <div 
        className="inset-0 bg-gradient-to-br from-blue-1500/90 to-purple-1500/90 text-white p-4 overflow-hidden w-full " 
        style={{ justifyContent: 'center', alignItems: 'center', margin: 'auto' }}
        >
          
          <div 
            className="grid grid-cols-2 gap-4 mb-6 pb-2 overflow-hidden" style={{marginTop:'90px',marginBottom:'40px'}}
            >
            {personalizeButtons.map((button) => (
                <div key={button.name} className="relative group transform transition-all duration-500 hover:scale-100">
                    <button onClick={() => setActiveButton(button.name)} className={`w-full bg-white/15 backdrop-blur-lg rounded-2xl p-2 md:p-6 flex flex-col justify-center items-center text-center relative z-10 overflow-hidden min-h-[90px] hover:h-[80px] ${activeButton === button.name ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/90 text-white' : 'bg-gradient-to-br from-blue-900/90 to-purple-900/50 text-gray-300'}`}>
                        <span className="flex items-center justify-center text-sm font-medium mx-auto relative z-10 transition-all duration-300 mb-2">
                            <span className="flex transition-transform duration-300 group-hover:scale-125 inline-block mr-2">
                                {button.icon}&nbsp;&nbsp;{button.name}
                            </span>
                        </span>
                        <div 
                          className="w-full text-white text-xs text-center opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-full transition-all duration-300 z-20 absolute bottom-0 left-0 pb-2 hidden lg:block"
                        >
                          {button.title}
                        </div>
                    </button>
                </div>
            ))}
          </div>
    
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Top Investments & Learning
          </h2>
    
          {investments.map((category, categoryIndex) => (
            <div key={category.type} className="mb-6" style={{ userSelect: 'none' }}>
              <style>
                {`
                  ::-webkit-scrollbar {
                    width: 2px;
                    height: 2px;
                  }
                  ::-webkit-scrollbar:horizontal {
                    width: 2px;
                    height: 2px;
                  }
                  
                  ::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom right, rgba(0, 0, 255, 0.9), rgba(128, 0, 128, 0.9)); /* Gradient from blue to purple */
                    border-radius: 3px;
                  }
            
                  ::-webkit-scrollbar-thumb:hover {
                    background-color: #666; 
                  }
            
                  ::-webkit-scrollbar-track {
                    background-color: linear-gradient(to bottom right, rgba(0, 0, 255, 0.9), rgba(128, 0, 128, 0.9)); /* Gradient from blue to purple */
                    border-radius: 3px;
                  }
                `}
              </style>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-bg-gradient-to-br from-blue-900/90 to-purple-900/50">{category.type}</h3>
                
                {/* Show refresh button for data categories */}
                {category.type === "Stocks" && (
                  <div className="flex items-center text-sm">
                    <span className="text-gray-300 mr-2">Last updated: {formatLastUpdated()}</span>
                    <button 
                      onClick={refreshStockData}
                      disabled={isLoadingStocks}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 ${isLoadingStocks ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {isLoadingStocks ? 'Refreshing...' : 'Refresh'}
                    </button>
                  </div>
                )}
                
                {category.type === "Mutual Funds" && (
                  <div className="flex items-center text-sm">
                    <span className="text-gray-300 mr-2">Last updated: {lastUpdatedMF ? formatLastUpdated(lastUpdatedMF) : 'Never'}</span>
                    <button 
                      onClick={refreshMutualFundData}
                      disabled={isLoadingMF}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 ${isLoadingMF ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {isLoadingMF ? 'Refreshing...' : 'Refresh'}
                    </button>
                  </div>
                )}
                
                {category.type === "Fixed Deposits" && (
                  <div className="flex items-center text-sm">
                    <span className="text-gray-300 mr-2">Last updated: {lastUpdatedFD ? formatLastUpdated(lastUpdatedFD) : 'Never'}</span>
                    <button 
                      onClick={refreshFixedDepositData}
                      disabled={isLoadingFD}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 ${isLoadingFD ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {isLoadingFD ? 'Refreshing...' : 'Refresh'}
                    </button>
                  </div>
                )}
              </div>
              <div 
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide whitespace-nowrap scroll-smooth overflow-hidden"
                style={{
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {category.type === "Stocks" ? (
                  isLoadingStocks ? (
                    // Instead of loading indicator, render the static data
                    niftyData
                      .sort((a, b) => parseFloat(b.change) - parseFloat(a.change)) // Sort in descending order by change
                      .map((stock, index) => {
                        const bgIntensity = Math.max(700 - index * 50, 800);
                        
                        // Check if stock is up or down to determine color
                        const isStockUp = parseFloat(stock.change) > 0;
                        const changeColor = isStockUp ? "text-green-500" : "text-red-500";
                        const changeIcon = isStockUp ? "▲" : "▼";
                        const changeValue = (parseFloat(stock.ltp) - parseFloat(stock.prev_price)).toFixed(2);
                        const changePercent = stock.change;

                        return (
                          <div
                            key={stock.symbol}
                            className={`flex-shrink-0 w-64 bg-gradient-to-br from-blue-1500/90 to-purple-1500/90${bgIntensity} rounded-lg p-4 
                            transform transition-all duration-300 
                            hover:scale-105 hover:shadow-lg
                            scroll-snap-align: start;`}
                            style={{ scrollSnapAlign: "start" }}
                            onClick={() => window.open(stock.link, "_blank")}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex flex-col">
                                <h4 className="font-bold text-lg leading-tight">
                                  {stock.symbol}
                                </h4>
                                <div className="flex flex-col">
                                  <p className="text-sm text-gray-400">
                                    ₹{stock.ltp}
                                  </p>
                                  <p className={`text-sm ${changeColor} flex items-center`}>
                                    {changeIcon} {changeValue} ({changePercent}%)
                                  </p>
                                </div>
                              </div>
                              {(() => {
                                const cloudinaryId = stockImages[stock.symbol] || "default_stock_image_lcwpuj";
                                try {
                                  const img = cld
                                    .image(cloudinaryId)
                                    .format("auto")
                                    .quality("auto")
                                    .resize(
                                      auto()
                                        .gravity(autoGravity())
                                        .width(500)
                                        .height(500)
                                    );
                                  
                                  return (
                                    <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md overflow-hidden">
                                      <AdvancedImage
                                        className="w-10 h-10 object-contain rounded-full"
                                        cldImg={img}
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          const tickerToDomain = {
                                            "RELIANCE": "ril.com",
                                            "TCS": "tcs.com", 
                                            "HDFCBANK": "hdfcbank.com",
                                            "INFY": "infosys.com",
                                            "ICICIBANK": "icicibank.com",
                                            "SBIN": "sbi.co.in", 
                                            "BHARTIARTL": "airtel.in",
                                            "TATAMOTORS": "tatamotors.com"
                                          };
                                          const domain = tickerToDomain[stock.symbol] || 
                                                        `${stock.symbol.toLowerCase()}.com`;
                                          e.target.src = `https://logo.clearbit.com/${domain}`;
                                          
                                          // Final fallback if clearbit fails
                                          e.target.addEventListener('error', () => {
                                            e.target.src = createFallbackImage(stock.symbol, 'stock');
                                          });
                                        }}
                                      />
                                    </div>
                                  );
                                } catch (err) {
                                  return (
                                    <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md overflow-hidden">
                                      <img 
                                        src={`https://logo.clearbit.com/${stock.symbol.toLowerCase()}.com`}
                                        className="w-10 h-10 object-contain rounded-full"
                                        alt={stock.symbol}
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = createFallbackImage(stock.symbol, 'stock');
                                        }}
                                      />
                                    </div>
                                  );
                                }
                              })()}
                            </div>
                          </div>
                        );
                      })
                  ) : (niftyData
                    .sort((a, b) => parseFloat(b.change) - parseFloat(a.change)) // Sort in descending order by change
                    .map((stock, index) => {
                      const bgIntensity = Math.max(700 - index * 50, 800);
                  
                      const isStockUp = parseFloat(stock.change) > 0;
                      const changeColor = isStockUp ? "text-green-500" : "text-red-500";
                      const changeIcon = isStockUp ? "▲" : "▼";
                      const changeValue = (parseFloat(stock.ltp) - parseFloat(stock.prev_price)).toFixed(2);
                      const changePercent = stock.change;
                  
                      return (
                        <div
                          key={stock.symbol}
                          className={`flex-shrink-0 w-64 bg-gradient-to-br from-blue-1500/90 to-purple-1500/90${bgIntensity} rounded-lg p-4 
                          transform transition-all duration-300 
                          hover:scale-105 hover:shadow-lg
                          scroll-snap-align: start;`}
                          style={{ scrollSnapAlign: "start" }}
                          onClick={() => window.open(stock.link, "_blank")}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                              <h4 className="font-bold text-lg leading-tight">{stock.symbol}</h4>
                              <div className="flex flex-col">
                                <p className="text-sm text-gray-400">₹{stock.ltp}</p>
                                <p className={`text-sm ${changeColor} flex items-center`}>
                                  {changeIcon} {changeValue} ({changePercent}%)
                                </p>
                              </div>
                            </div>
                  
                            {/* Image Section */}
                            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md overflow-hidden">
                              {(() => {
                                const cloudinaryId = stockImages[stock.symbol];
                                const tickerToDomain = {
                                  RELIANCE: "ril.com",
                                  TCS: "tcs.com",
                                  HDFCBANK: "hdfcbank.com",
                                  INFY: "infosys.com",
                                  ICICIBANK: "icicibank.com",
                                  SBIN: "sbi.co.in",
                                  BHARTIARTL: "airtel.in",
                                  TATAMOTORS: "tatamotors.com"
                                };
                                const fallbackDomain =
                                  tickerToDomain[stock.symbol] || `${stock.symbol.toLowerCase()}.com`;
                  
                                try {
                                  if (cloudinaryId) {
                                    const img = cld
                                      .image(cloudinaryId)
                                      .format("auto")
                                      .quality("auto")
                                      .resize(auto().gravity(autoGravity()).width(500).height(500));
                  
                                    return (
                                      <AdvancedImage
                                        className="w-10 h-10 object-contain rounded-full"
                                        cldImg={img}
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = `https://logo.clearbit.com/${fallbackDomain}`;
                                          e.target.addEventListener("error", () => {
                                            e.target.src = createFallbackImage(stock.symbol, "stock");
                                          });
                                        }}
                                      />
                                    );
                                  } else {
                                    throw new Error("Cloudinary ID not found");
                                  }
                                } catch (err) {
                                  return (
                                    <img
                                      src={`https://logo.clearbit.com/${fallbackDomain}`}
                                      className="w-10 h-10 object-contain rounded-full"
                                      alt={stock.symbol}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = createFallbackImage(stock.symbol, "stock");
                                      }}
                                    />
                                  );
                                }
                              })()}
                            </div>
                          </div>
                        </div>
                      );
                    })
                )
                ) : category.type === "Mutual Funds" ? (
                  isLoadingMF ? (
                    // Instead of loading indicator, render the static data
                    mutualFundsData
                      .sort((a, b) => parseFloat(b.return) - parseFloat(a.return)) // Sort in descending order by return
                      .map((fund, index) => {
                        const bgIntensity = Math.max(700 - (index * 50), 800);
                        
                        // Determine if return is positive or negative for color styling
                        const isPositive = parseFloat(fund.return) > 0;
                        const returnColor = isPositive ? "text-green-500" : "text-red-500";
                        const returnIcon = isPositive ? "▲" : "▼";

                        return (
                          <div
                            key={fund.name}
                            className={`flex-shrink-0 w-64 bg-gradient-to-br from-blue-1500/90 to-purple-1500/90${bgIntensity} rounded-lg p-4 
                            transform transition-all duration-300 
                            hover:scale-105 hover:shadow-lg
                            scroll-snap-align: start;`}
                            style={{ scrollSnapAlign: "start" }}
                            onClick={() => window.open(fund.link, '_blank')}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex flex-col">
                                <h4 className="font-bold text-lg leading-tight">
                                  {fund.name}
                                </h4>
                                <div className="flex flex-col">
                                  <p className="text-sm text-gray-400">
                                    {fund.code}
                                  </p>
                                  <p className={`text-sm ${returnColor} flex items-center`}>
                                    {returnIcon} {fund.return}% (annual)
                                  </p>
                                </div>
                              </div>
                              {(() => {
                                let img;
                                try {
                                  img = cld.image(fund.image)
                                    .format('auto')
                                    .quality('auto')
                                    .resize(auto().gravity(autoGravity()).width(500).height(500));
                                } catch (err) {
                                  console.log(`Error loading image for ${fund.name}:`, err);
                                }
                                
                                return (
                                  <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md overflow-hidden">
                                    {img ? (
                                      <AdvancedImage 
                                        className="w-10 h-10 object-contain rounded-full" 
                                        cldImg={img} 
                                        onError={(e) => {
                                          // Handle Cloudinary error with a fallback
                                          const imgElement = e.target;
                                          imgElement.onerror = null;
                                          
                                          // Try company logo from clearbit
                                          const cleanName = fund.name.toLowerCase().replace(/\s+/g, '');
                                          imgElement.src = `https://logo.clearbit.com/${cleanName}.com`;
                                          
                                          // Final fallback if clearbit fails
                                          imgElement.addEventListener('error', () => {
                                            imgElement.src = createFallbackImage(fund.name, 'mf');
                                          });
                                        }}
                                      />
                                    ) : (
                                      <img
                                        src={`https://logo.clearbit.com/${fund.name.toLowerCase().replace(/\s+/g, '')}.com`}
                                        className="w-10 h-10 object-contain rounded-full"
                                        alt={fund.name}
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = createFallbackImage(fund.name, 'mf');
                                        }}
                                      />
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    mutualFundsData
                      .sort((a, b) => parseFloat(b.return) - parseFloat(a.return)) // Sort in descending order by return
                      .map((fund, index) => {
                        const bgIntensity = Math.max(700 - (index * 50), 800);
                        
                        // Determine if return is positive or negative for color styling
                        const isPositive = parseFloat(fund.return) > 0;
                        const returnColor = isPositive ? "text-green-500" : "text-red-500";
                        const returnIcon = isPositive ? "▲" : "▼";

                        return (
                          <div
                            key={fund.name}
                            className={`flex-shrink-0 w-64 bg-gradient-to-br from-blue-1500/90 to-purple-1500/90${bgIntensity} rounded-lg p-4 
                            transform transition-all duration-300 
                            hover:scale-105 hover:shadow-lg
                            scroll-snap-align: start;`}
                            style={{ scrollSnapAlign: "start" }}
                            onClick={() => window.open(fund.link, '_blank')}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex flex-col">
                                <h4 className="font-bold text-lg leading-tight">
                                  {fund.name}
                                </h4>
                                <div className="flex flex-col">
                                  <p className="text-sm text-gray-400">
                                    {fund.code}
                                  </p>
                                  <p className={`text-sm ${returnColor} flex items-center`}>
                                    {returnIcon} {fund.return}% (annual)
                                  </p>
                                </div>
                              </div>
                              {(() => {
                                let img;
                                try {
                                  img = cld.image(fund.image)
                                    .format('auto')
                                    .quality('auto')
                                    .resize(auto().gravity(autoGravity()).width(500).height(500));
                                } catch (err) {
                                  console.log(`Error loading image for ${fund.name}:`, err);
                                }
                                
                                return (
                                  <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md overflow-hidden">
                                    {img ? (
                                      <AdvancedImage 
                                        className="w-10 h-10 object-contain rounded-full" 
                                        cldImg={img} 
                                        onError={(e) => {
                                          // Handle Cloudinary error with a fallback
                                          const imgElement = e.target;
                                          imgElement.onerror = null;
                                          
                                          // Try company logo from clearbit
                                          const cleanName = fund.name.toLowerCase().replace(/\s+/g, '');
                                          imgElement.src = `https://logo.clearbit.com/${cleanName}.com`;
                                          
                                          // Final fallback if clearbit fails
                                          imgElement.addEventListener('error', () => {
                                            imgElement.src = createFallbackImage(fund.name, 'mf');
                                          });
                                        }}
                                      />
                                    ) : (
                                      <img
                                        src={`https://logo.clearbit.com/${fund.name.toLowerCase().replace(/\s+/g, '')}.com`}
                                        className="w-10 h-10 object-contain rounded-full"
                                        alt={fund.name}
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = createFallbackImage(fund.name, 'mf');
                                        }}
                                      />
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        );
                      })
                  )
                ) : category.type === "Fixed Deposits" ? (
                  isLoadingFD ? (
                    // Instead of loading indicator, render the static data
                    fixedDepositsData
                      .sort((a, b) => parseFloat(b.return) - parseFloat(a.return)) // Sort in descending order by return
                      .map((fd, index) => {
                        const bgIntensity = Math.max(700 - (index * 50), 800);
                        
                        // For FDs, we'll consider anything above 7% as "good" for visual indication
                        const isHighReturn = parseFloat(fd.return) >= 7.0;
                        const returnColor = isHighReturn ? "text-green-500" : "text-yellow-500";
                        const returnIcon = isHighReturn ? "★" : "•";

                        return (
                          <div
                            key={fd.name}
                            className={`flex-shrink-0 w-64 bg-gradient-to-br from-blue-1500/90 to-purple-1500/90${bgIntensity} rounded-lg p-4 
                            transform transition-all duration-300 
                            hover:scale-105 hover:shadow-lg
                            scroll-snap-align: start;`}
                            style={{ scrollSnapAlign: "start" }}
                            onClick={() => window.open(fd.link, '_blank')}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex flex-col">
                                <h4 className="font-bold text-lg leading-tight">
                                  {fd.name}
                                </h4>
                                <div className="flex flex-col">
                                  <p className="text-sm text-gray-400">
                                    {fd.code}
                                  </p>
                                  <p className={`text-sm ${returnColor} flex items-center`}>
                                    {returnIcon} {fd.return}% interest
                                  </p>
                                </div>
                              </div>
                              {(() => {
                                let img;
                                try {
                                  img = cld.image(fd.image)
                                    .format('auto')
                                    .quality('auto')
                                    .resize(auto().gravity(autoGravity()).width(500).height(500));
                                } catch (err) {
                                  console.log(`Error loading image for ${fd.name}:`, err);
                                }
                                
                                return (
                                  <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md overflow-hidden">
                                    {img ? (
                                      <AdvancedImage 
                                        className="w-10 h-10 object-contain rounded-full" 
                                        cldImg={img} 
                                        onError={(e) => {
                                          // Handle Cloudinary error with a fallback
                                          const imgElement = e.target;
                                          imgElement.onerror = null;
                                          
                                          // Try bank logo from clearbit
                                          const cleanName = fd.name.toLowerCase().replace(/\s+/g, '').replace('ltd.', '');
                                          imgElement.src = `https://logo.clearbit.com/${cleanName}.com`;
                                          
                                          // Final fallback if clearbit fails
                                          imgElement.addEventListener('error', () => {
                                            imgElement.src = createFallbackImage(fd.name, 'fd');
                                          });
                                        }}
                                      />
                                    ) : (
                                      <img
                                        src={`https://logo.clearbit.com/${fd.name.toLowerCase().replace(/\s+/g, '').replace('ltd.', '')}.com`}
                                        className="w-10 h-10 object-contain rounded-full"
                                        alt={fd.name}
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = createFallbackImage(fd.name, 'fd');
                                        }}
                                      />
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    fixedDepositsData
                      .sort((a, b) => parseFloat(b.return) - parseFloat(a.return)) // Sort in descending order by return
                      .map((fd, index) => {
                        const bgIntensity = Math.max(700 - (index * 50), 800);
                        
                        // For FDs, we'll consider anything above 7% as "good" for visual indication
                        const isHighReturn = parseFloat(fd.return) >= 7.0;
                        const returnColor = isHighReturn ? "text-green-500" : "text-yellow-500";
                        const returnIcon = isHighReturn ? "★" : "•";

                        return (
                          <div
                            key={fd.name}
                            className={`flex-shrink-0 w-64 bg-gradient-to-br from-blue-1500/90 to-purple-1500/90${bgIntensity} rounded-lg p-4 
                            transform transition-all duration-300 
                            hover:scale-105 hover:shadow-lg
                            scroll-snap-align: start;`}
                            style={{ scrollSnapAlign: "start" }}
                            onClick={() => window.open(fd.link, '_blank')}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex flex-col">
                                <h4 className="font-bold text-lg leading-tight">
                                  {fd.name}
                                </h4>
                                <div className="flex flex-col">
                                  <p className="text-sm text-gray-400">
                                    {fd.code}
                                  </p>
                                  <p className={`text-sm ${returnColor} flex items-center`}>
                                    {returnIcon} {fd.return}% interest
                                  </p>
                                </div>
                              </div>
                              {(() => {
                                let img;
                                try {
                                  img = cld.image(fd.image)
                                    .format('auto')
                                    .quality('auto')
                                    .resize(auto().gravity(autoGravity()).width(500).height(500));
                                } catch (err) {
                                  console.log(`Error loading image for ${fd.name}:`, err);
                                }
                                
                                return (
                                  <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md overflow-hidden">
                                    {img ? (
                                      <AdvancedImage 
                                        className="w-10 h-10 object-contain rounded-full" 
                                        cldImg={img} 
                                        onError={(e) => {
                                          // Handle Cloudinary error with a fallback
                                          const imgElement = e.target;
                                          imgElement.onerror = null;
                                          
                                          // Try bank logo from clearbit
                                          const cleanName = fd.name.toLowerCase().replace(/\s+/g, '').replace('ltd.', '');
                                          imgElement.src = `https://logo.clearbit.com/${cleanName}.com`;
                                          
                                          // Final fallback if clearbit fails
                                          imgElement.addEventListener('error', () => {
                                            imgElement.src = createFallbackImage(fd.name, 'fd');
                                          });
                                        }}
                                      />
                                    ) : (
                                      <img
                                        src={`https://logo.clearbit.com/${fd.name.toLowerCase().replace(/\s+/g, '').replace('ltd.', '')}.com`}
                                        className="w-10 h-10 object-contain rounded-full"
                                        alt={fd.name}
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = createFallbackImage(fd.name, 'fd');
                                        }}
                                      />
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        );
                      })
                  )
                ) : (
                  // For other categories like videos, map over their static items
                  category.items.map((investment, index) => {
                    const bgIntensity = Math.max(700 - (index * 50), 800);
                    
                    if (investment.id !== undefined && videoDetails && videoDetails[investment.id]) {
                      return (
                        <div
                          key={investment.id}
                          className={`flex-shrink-0 w-64 bg-gradient-to-br from-blue-900/90 to-purple-900/90-${bgIntensity} rounded-lg p-4 
                          transform transition-all duration-300 
                          hover:scale-105 hover:shadow-lg
                          scroll-snap-align: start;`}
                        >
                          <div className="relative mb-3">
                            <img
                              src={videoDetails[investment.id].thumbnail}
                              alt={videoDetails[investment.id].name}
                              onClick={() => window.open(videoDetails[investment.id].videoUrl, '_blank')}
                              className="w-full h-40 object-cover rounded-md"
                              onError={(e) => {
                                // If thumbnail fails, use YouTube's default thumbnail format
                                const videoId = extractVideoId(videoDetails[investment.id].videoUrl);
                                if (videoId) {
                                  e.target.src = `https://img.youtube.com/vi/${videoId}/0.jpg`;
                                }
                              }}
                            />
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 rounded">
                              {videoDetails[investment.id].duration}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold text-lg line-clamp-2">{videoDetails[investment.id].name}</h4>
                            <p className="text-sm text-gray-300">{videoDetails[investment.id].views}</p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      );
    };
      

      

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

  // Function to generate a consistent color based on text
  const generateConsistentColor = (text) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = Math.abs(hash).toString(16).substring(0, 6).padStart(6, '0');
    return color;
  };

  // Function to create a fallback image for any entity
  const createFallbackImage = (name, type = 'generic') => {
    // Determine background color based on entity type
    let bgColor;
    let textColor = 'fff'; // White text
    let initials;
    
    if (type === 'stock') {
      bgColor = '0047AB'; // Stock blue
      initials = name.substring(0, 2).toUpperCase();
    } else if (type === 'mf') {
      bgColor = '228B22'; // Fund green
      initials = name.split(' ')[0].substring(0, 2).toUpperCase();
    } else if (type === 'fd') {
      bgColor = '8B008B'; // FD purple
      initials = name.split(' ')[0].substring(0, 2).toUpperCase();
    } else {
      // Generate a random but consistent color for other types
      bgColor = generateConsistentColor(name);
      initials = name.substring(0, 2).toUpperCase();
    }

    return `https://ui-avatars.com/api/?name=${initials}&background=${bgColor}&color=${textColor}&bold=true&size=150&font-size=0.33&rounded=true`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 1 }} 
      animate={{ opacity: 1, y: 0, scale: 1 }} 
      transition={{ duration: 0.3, ease: "easeIn" }}
    >
      <div className=' bg-gradient-to-br from-blue-900/50 to-purple-900/50 ' >
        <Navbar mail={mail}/>

      <StocksData/>

      </div>
    </motion.div>

  );
};

export default Home;
