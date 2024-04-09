"use client";
import Image from "next/image";
// import styles from "./page.module.css";
import Navbar from "./Navbar";
import "../globals.css";
import { AuthContextProvider } from "../context/AuthContext";
import { UserAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Homepage() {

  const router = useRouter();
  const { user, googleSignIn, logOut } = UserAuth();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  return (

    <div class="header">
      <nav>
        <ul>
          <li>About</li>
          <li>
          {loading ? null : !user ? (
            <ul>
              <button type="button" class="btn" onClick={handleSignIn}>Log in</button>

            </ul>
          ) : (
            // <div className="user-greeting">
            //   <p>Welcome, {user.displayName}</p>
            //   <p onClick={handleSignOut}>
            //     Sign out
            //   </p>
            // </div>

            <>{router.push('/dashboard')}</>

          )}
          </li>
        </ul>
      </nav>
      <div class="text-box">
        <h1>Find your<br />Perfect roommate</h1>
        <p class="secondarytext">Connect with other students that share your housing preferences.</p>
        {loading ? null : !user ? (
            
            <button type="button" class="btn" onClick={handleSignIn}>Create an account</button>

            
          ) : (
            // <div className="user-greeting">
            //   <p>Welcome, {user.displayName}</p>
            //   <p onClick={handleSignOut}>
            //     Sign out
            //   </p>
            // </div>

            <>{router.push('/dashboard')}</>

          )}
      </div>
    </div>


  );
}