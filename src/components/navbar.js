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
    <div className=" navbar navbar-expand-lg navbar-dark  bg-gradient-to-br from-blue-900/90 to-purple-900/80  text-white scale-15 shadow-lg">
      <div className="container-fluid flex p-3">
        <a className="navbar-brand" onClick={() => {navigate('/home')}} style={{cursor: 'pointer'}}>
          <img src="./navlogo1.png" style={{ maxHeight: '70px', width: '50px', maxWidth: '100%', height: 'auto', marginLeft: '5px' ,background:'transparent',borderRadius:'10px',padding:'4px',boxShadow: 'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',}} alt="Navbar Logo" />
        </a>
        <h1 style={{ fontWeight: 'bolder',marginTop:'10px',marginLeft:'4px' }}>WealthWise</h1>
        </div>
        </div>
  );
};

export default Navbar;
