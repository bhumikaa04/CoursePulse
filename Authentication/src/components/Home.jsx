import React, {useState} from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import OuterHome from "./OuterHome";


function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status
    return (
        <>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> 
            <OuterHome />
            <Footer />
        </>
    );
}   

export default Home;    