import React, { useState, useEffect } from 'react';
import { Routes, Route ,useNavigate} from 'react-router-dom';
import Login from './components/login';
import Home from './components/Home';
import { auth} from "./firebase";

import HashLoader from "react-spinners/HashLoader";
import Psinfo from './components/Psinfo';
import ChatBot from './components/ChatBot';
import FileUpload from './components/FileUpload';
import InvestmentRecommendationForm from './components/personalMF';
import PageNotFound from './components/PageNotFound';

const App = () => {
  const [log, setLog] = useState(false);
  const [mail, setMail] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();



 useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {

        setLoading(true);   
        if (user) {
          setMail(user.email);
          console.log("user email : " ,user.email)
        } else {
          setMail('');
          await auth.signOut();
        }
  
        setLoading(false);
      } catch (error) {
        console.error('Error during authentication state change:', error);
        setLoading(false); 
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  if (loading) {
    
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
       <HashLoader color="white" />
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login user1={setLog} email={setMail} />} />
        <Route path="*" element={auth.currentUser && mail !== '' ? <PageNotFound /> : <Login user1={setLog} email={setMail} />} />
        <Route path="/home" element={auth.currentUser && mail !== '' ? <Home mail={mail} /> : <Login user1={setLog} email={setMail} />} />
        <Route path="/foam" element={auth.currentUser && mail !== '' ? <Psinfo mail={mail} /> : <Login user1={setLog} email={setMail} />} />
        <Route path="/chatbot" element={auth.currentUser && mail !== '' ? <ChatBot mail={mail} /> : <Login user1={setLog} email={setMail} />} />
        <Route path="/fileupload" element={auth.currentUser && mail === 'anuragnarsingoju@gmail.com' ? <FileUpload /> : auth.currentUser && mail !== '' ? <PageNotFound /> : <Login user1={setLog} email={setMail} />} />
        <Route path="/personal-MF" element={auth.currentUser && mail !== '' ? <InvestmentRecommendationForm /> : <Login user1={setLog} email={setMail} />} />
      </Routes>
    </div>
  );
};

export default App;
