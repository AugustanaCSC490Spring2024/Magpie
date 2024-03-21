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
        <div className="title">Find your Perfect Roommate</div>
        <h2>Include your prefernces and filter your searches to find the right person to room with</h2>
      </div>
    </div>
    </ AuthContextProvider>
  );
}