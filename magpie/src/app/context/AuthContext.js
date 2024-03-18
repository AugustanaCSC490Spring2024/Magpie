import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    // Set custom parameters for GoogleAuthProvider
    provider.setCustomParameters({
      hd: "augustana.edu", // This restricts sign-in to users with augustana.edu emails
    });
    signInWithPopup(auth, provider)
      .then((result) => {
        // This will be executed only if the user's email is from augustana.edu
        console.log("Sign in successful!", result);
      })
      .catch((error) => {
        if (error.code === 'auth/cancelled-popup-request') {
          console.log("Sign in was cancelled. Please try again.");
        } else if (error.code === 'auth/unauthorized-domain') {
          console.error("The domain of the user's email is not authorized for sign-in.");
        } else {
          console.error("Authentication error:", error);
        }
      });
  };
  
  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
