"use client";
import Image from "next/image";
// import styles from "./page.module.css";
import Navbar from "./Navbar";
import "../globals.css";
import { AuthContextProvider } from "../context/AuthContext";

export default function Homepage() {
  return (
    <AuthContextProvider>

    <Navbar />
    <div className="page-container">
      <div className="background-image"></div>
      <div className="content">
        <h1 className="title" style={{fontFamily: 'Poppins', color: 'white', textAlign: 'left', paddingLeft: '10px'}}>Find your Perfect Roommate</h1>
        <h2>Include your prefernces and filter your searches to find the right person to room with</h2>
      </div>
    </div>
    
    </ AuthContextProvider>
  );
}