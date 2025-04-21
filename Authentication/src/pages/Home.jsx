import React, {useState} from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OuterHome from "../components/OuterHome"; // Importing the OuterHome component


function Home() {
    return (
        <>
            <Navbar /> 
            <OuterHome />
            <Footer />
        </>
    );
}   

export default Home;    