"use client";
import { useEffect } from "react";
import { UserAuth } from "../context/AuthContext";

export default function Page() {
    const { user } = UserAuth();

    useEffect(() => { 
    const checkAuthentication = async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
    };
    checkAuthentication();
}, {user});

  return (
    <div className="profile-page">
      {user && (
        <div>
          <h1>Welcome to your profile page, {user.displayName}!</h1>
          <p>This is your dedicated space in our application.</p>
        </div>
      )}
    </div>
  );
};

