"use client";
import "../globals.css";
import { UserAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore"; 
import { db } from "../firebase"; 



export default function Homepage() {

  const { user, logOut, isAdmin, googleSignIn } = UserAuth();
  const router = useRouter();
  const [hasProfile, setHasProfile] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);


  useEffect(() => {
      const fetchProfile = async () => {
          if (user && isAdmin) {
              const userProfileRef = doc(db, 'userProfiles', user.uid);
              const docSnap = await getDoc(userProfileRef);
              if (docSnap.exists()) {
                  setHasProfile(true);
              } else {
                  setHasProfile(false);
              }
          }
      };
      fetchProfile();
  }, [user, isAdmin]);

  
    if (isAdmin && !hasProfile) {
        router.push('/adminProfile'); // Redirect to the Admin Profile page to create profile
    } else if (isAdmin && hasProfile) {
        router.push('/AdminPage'); // Navigate to AdminPage if the profile exists
    } else if (user){
        router.push('/profile');
    }
      
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
               
                <button type="button" className="btn" onClick={handleSignIn}>Log in / Create an account</button>
              
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

