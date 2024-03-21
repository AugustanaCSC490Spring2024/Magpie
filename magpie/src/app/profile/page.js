"use client";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";

export default function Page() {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  return (
    <div>
      { user ? (
        <p>
          Welcome, {user.displayName} - you are logged in to the profile page -
          a protected route.
        </p>
      ) : (
        <p>You must be logged in to view this page - protected route.</p>
      )}
    </div>
  );
};

