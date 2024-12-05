const Home = ({ mail }) => {
    console.log("home mail ",mail)
    return ( 
        <>
        <h1 style={{display:'flex',margin:'auto',justifyContent:'center',alignItems:'center',
        fontWeight: 'bold',height:'100vh',
        textAlign: 'center',}}>Hello User {mail} </h1>
        </>
    );
}
 
export default Home;
