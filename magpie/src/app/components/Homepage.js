"use client";
import Image from "next/image";
// import styles from "./page.module.css";
import Navbar from "./Navbar";
import "../globals.css";
import { UserAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore"; 
import { db } from "../firebase"; 


export default function Homepage() {

  const router = useRouter();
  const { user, googleSignIn, logOut } = UserAuth();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const redirectToDashboardIfNeeded = async () => {
      if (user) {
        const responsesRef = doc(db, 'userResponses', user.uid);
        const responsesDoc = await getDoc(responsesRef);

        if (responsesDoc.exists()) {
          router.push('/dashboard');
        } else {
          router.push('/profile');
        }
      }
      setLoading(false);
    };

    redirectToDashboardIfNeeded();
  }, [user, router]);

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };
  const handleAboutClick = async () => {
    try {
      // Redirect to the About page
      router.push('/about');
    } catch (error) {
      console.log(error);
    }
  };
  
  // if (loading) {
  //   return <div>Loading...</div>; // Optionally, show a loading spinner or similar
  // }


    return (
      <div className="header">
        <nav>
          <ul>
            <li><button type="button" className="btn" onClick={handleAboutClick}>About</button></li>
            <li>
              {!user ? (
                <button type="button" className="btn" onClick={handleSignIn}>Log in / Create an account</button>
              ) : null}
            </li>
          </ul>
        </nav>
        <div className="text-box">
          <h1>Find your<br />Perfect roommate</h1>
          <p className="secondarytext">Connect with other students that share your housing preferences.</p>
        </div>
      </div>
    );
  }