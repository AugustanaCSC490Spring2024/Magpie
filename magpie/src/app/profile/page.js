"use client";
import { useEffect, useState, useContext } from "react";
import { UserAuth } from "../context/AuthContext";
import { AuthContextProvider } from "../context/AuthContext";
import Profilepage from "../components/Profilepage";
const Profile = () => {
  

  return (
    <AuthContextProvider>
    <Profilepage></Profilepage>
    </AuthContextProvider>
    
  );
};

export default Profile;