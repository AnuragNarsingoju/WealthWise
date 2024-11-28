import React, { useState, useEffect } from 'react';
import { Routes, Route ,useNavigate} from 'react-router-dom';
import Login from './components/login';
import HashLoader from "react-spinners/HashLoader";


const App = () => {
  const [log, setLog] = useState(false);
  const [mail, setMail] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(async (user) => {
  //     try {
  //       setLoading(true); 
  
  //       if (user) {
  //         setMail(user.email);
  //       } else {
  //         setMail('');
  //         await auth.signOut();
  //       }
  
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Error during authentication state change:', error);
  //       setLoading(false); 
  //     }
  //   });
  
  //   return () => unsubscribe(); 
  // }, []);
  

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
        <Route path="/" element={<Login/>} />
      </Routes>
    </div>
  );
};

export default App;
