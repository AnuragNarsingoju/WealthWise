import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown, ModalHeader } from 'react-bootstrap'; 
// import { auth } from '../firebase.config';
import toast from 'react-hot-toast';
const Navbar = (user) => {
  const navigate = useNavigate();
  const [collapseOpen, setCollapseOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(user => {
//       if (user) {
//         setIsLoggedIn(true);
//       } else {
//         setIsLoggedIn(false);
//         // auth.signOut(); 
//       }
//     });
//     return () => unsubscribe();
//   }, []);

  const handleNavLinkClick = (path) => {

    if (isLoggedIn) {
      navigate(path);
      setCollapseOpen(false);
    } else {
      toast.error("Login failed");
    }
  };

  const handlelogout=async () => {
      try {
        // await auth.signOut(); 
        handleNavLinkClick('/')
      } catch (error) {
        console.error('Error signing out:', error);
      }
  
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-gradient-to-br from-blue-900/90 to-purple-900/80  text-white scale-15 shadow-lg">
      <div className="container-fluid">
        <a className="navbar-brand" onClick={() => handleNavLinkClick(user.mail!="shireesha@nbjshop.in" && user.mail != "rathnakar@nbjshop.in" ? '/silver' : '/GiriviSearch')} style={{cursor: 'pointer'}}>
          <img src="./navlogo1.png" style={{ maxHeight: '70px', width: '50px', maxWidth: '100%', height: 'auto', marginLeft: '5px' ,background:'transparent',borderRadius:'10px',padding:'4px',boxShadow: 'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',}} alt="Navbar Logo" />
        </a>
        <h1 style={{ fontWeight: 'bolder' }}>WealthWise</h1>
        <button className="navbar-toggler" type="button" onClick={() => setCollapseOpen(!collapseOpen)}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${collapseOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav mr-auto">
        
         {user.mail !== "shireesha@nbjshop.in" && user.mail !== "rathnakar@nbjshop.in" &&(
            <Dropdown style={{ marginLeft: '10px', backgroundColor: 'transparent' }}>
              <Dropdown.Toggle variant="transparent" id="dropdown-basic" className="nav-link active" style={{ paddingTop: '10px', paddingLeft: '0px', marginRight: '10px', color: '#F5F5DC' }}>
                Silver
              </Dropdown.Toggle>
        
              <Dropdown.Menu style={{ width: '100%', minWidth: '200px', backgroundColor: '#5D54A4' }}>
                <Dropdown.Item onClick={() => handleNavLinkClick('/silver')} style={{ color: '#FFFFCC', backgroundColor: '#5D54A4' }}>Silver Calculate</Dropdown.Item>
                <Dropdown.Item onClick={() => handleNavLinkClick('/silverstock')} style={{ color: '#FFFFCC', backgroundColor: '#5D54A4' }}>Silver Stock Update</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>    )}
        
            {user.mail !== "shireesha@nbjshop.in" && user.mail !== "rathnakar@nbjshop.in" && (<Dropdown style={{ marginLeft: '10px', backgroundColor: 'transparent' }}>
              <Dropdown.Toggle variant="transparent" id="dropdown-basic" className="nav-link active" style={{ paddingTop: '10px', paddingLeft: '0px', marginRight: '10px', color: '#F5F5DC' }}>
                Gold
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ width: '100%', minWidth: '200px', backgroundColor: '#5D54A4' }}>
                <Dropdown.Item onClick={() => handleNavLinkClick('/gold')} style={{ color: '#FFFFCC', backgroundColor: '#5D54A4' }}>Gold Calculate</Dropdown.Item>
                <Dropdown.Item onClick={() => handleNavLinkClick('/manualGold')} style={{ color: '#FFFFCC', backgroundColor: '#5D54A4' }}>Manual Gold Calculate</Dropdown.Item>
                <Dropdown.Item onClick={() => handleNavLinkClick('/goldstock')} style={{ color: '#FFFFCC', backgroundColor: '#5D54A4' }}>Gold Stock Update</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>   )}

          
            <Dropdown style={{marginLeft:'10px',backgroundColor:'transparent'}}>
              <Dropdown.Toggle variant="transparent" id="dropdown-basic" className="nav-link active" style={{paddingTop:'10px',color:'#F5F5DC',paddingLeft:'0px',marginRight:'10px'}}>
              Girvi
              </Dropdown.Toggle>

              <Dropdown.Menu style={{width:'100%',minWidth:'200px',backgroundColor:'#5D54A4'}}>
                <Dropdown.Item onClick={() => handleNavLinkClick('/Girivi')} style={{color:'#FFFFCC',backgroundColor:'#5D54A4'}}>Girivi</Dropdown.Item>
                <Dropdown.Item onClick={() => handleNavLinkClick('/GiriviSearch')} style={{color:'#FFFFCC',backgroundColor:'#5D54A4'}}>Search</Dropdown.Item>
                <Dropdown.Item onClick={() => handleNavLinkClick('/DeletedGirivi')} style={{color:'#FFFFCC',backgroundColor:'#5D54A4'}}>Deleted Girivi</Dropdown.Item>
                {user.mail !== "shireesha@nbjshop.in" && user.mail !== "rathnakar@nbjshop.in" && (<Dropdown.Item onClick={() => handleNavLinkClick('/UsedGirivi')} style={{color:'#FFFFCC',backgroundColor:'#5D54A4'}}>Used Girivi</Dropdown.Item> )}
              </Dropdown.Menu>
            </Dropdown>

          {user.mail !== "shireesha@nbjshop.in" && user.mail !== "rathnakar@nbjshop.in" && ( <Dropdown style={{marginLeft:'10px',backgroundColor:'transparent'} }>
              <Dropdown.Toggle variant="transparent" id="dropdown-basic" className="nav-link active" style={{paddingTop:'10px',paddingLeft:'0px',marginRight:'10px',color:'#F5F5DC'}}>
              Karigar
              </Dropdown.Toggle>
              <Dropdown.Menu style={{width:'100%',minWidth:'200px',backgroundColor:'#5D54A4',}}>
                <Dropdown.Item onClick={() => handleNavLinkClick('/propin')} style={{color:'#FFFFCC',backgroundColor:'#5D54A4'}}>Propin</Dropdown.Item>
                
              </Dropdown.Menu>
          </Dropdown>  )}  

           {user.mail !== "shireesha@nbjshop.in" && user.mail !== "rathnakar@nbjshop.in" && ( <Dropdown style={{marginLeft:'10px',backgroundColor:'transparent'} }>
              <Dropdown.Toggle variant="transparent" id="dropdown-basic" className="nav-link active" style={{paddingTop:'10px',paddingLeft:'0px',marginRight:'10px',color:'#F5F5DC'}}>
              Stock
              </Dropdown.Toggle>
              <Dropdown.Menu style={{width:'100%',minWidth:'200px',backgroundColor:'#5D54A4',}}>
                <Dropdown.Item onClick={() => handleNavLinkClick('/Stock')} style={{color:'#FFFFCC',backgroundColor:'#5D54A4'}}>Stock Available</Dropdown.Item>
                <Dropdown.Item onClick={() => handleNavLinkClick('/barcode')} style={{color:'#FFFFCC',backgroundColor:'#5D54A4'}}>Stock Entry</Dropdown.Item>
                
              </Dropdown.Menu>
          </Dropdown>  )}  

            {user.mail !== "shireesha@nbjshop.in" && user.mail !== "rathnakar@nbjshop.in" && ( <li className="nav-item" style={{marginRight:'10px'}}>
              <button className="nav-link active" style={{margin:'0px',color:'#F5F5DC'}} onClick={() => handleNavLinkClick('/price')}>Price Update</button>
            </li> )}

            {user.mail !== "shireesha@nbjshop.in" && user.mail !== "rathnakar@nbjshop.in" && (<li className="nav-item" style={{marginRight:'10px'}}>
              <button className="nav-link active" style={{margin:'0px',color:'#F5F5DC'}} onClick={() => handleNavLinkClick('/report')}>Report</button>
            </li>)}
            <li className="nav-item">
              <button className="nav-link active" style={{margin:'0px',color:'#F5F5DC'}} onClick={() => handlelogout()}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;