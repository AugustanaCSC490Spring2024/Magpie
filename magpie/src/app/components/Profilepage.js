"use client";
import { UserAuth } from "../context/AuthContext";
 import { useEffect } from "react";
 

const Profilepage =()=>{

const {user} = UserAuth();

useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    };
    checkAuthentication();
  }, [user]);

return (
    <div className="profile-page">
      {user && (
        <div>
          <h1>Welcome to your profile page, {user.displayName}!</h1>
          <p>This is your dedicated space in our application.</p>
        </div>
      )}
    </div>
)

}

export default Profilepage;