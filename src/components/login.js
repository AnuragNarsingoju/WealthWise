                      background: inherit; 
                      animation: inherit; /* Inherits animation */
                    }
                  `}
                </style>
                {shouldHaveRainbowEffect ? (
                  <div className="rainbow-border">
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(!isLogin);
                        clear();
                        setErrors({});
                      }}
                      className="text-white hover:text-gray-200  transition-all duration-300 ease-in-out font-bold"

            
                    >
                      <div className="text-purple-600 hover:text-purple-700  transition-all duration-600 ease-in-out font-bold" style={{background:'white',borderRadius:'2px',padding:'4px',marginTop:'0px'}}> 
                      {isLogin ? 'Sign up' : 'Sign in'}
                      </div>
                     
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      clear();
                      setErrors({});
                    }}
                    className="text-purple-600 hover:text-purple-700 transition-all duration-600 ease-in-out font-bold " style={{padding:'6px',paddingBottom:'0px',paddingTop:'0px',marginBottom:'15px'}}
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                )}
              </>
            </p>
          </>
       
      </div>
    </div>
      
    </div>


    
    </>
  );
};

export default Login;
