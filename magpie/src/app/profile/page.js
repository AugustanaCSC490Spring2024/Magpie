"use client";
import { AuthContextProvider } from "../context/AuthContext";
import Profilepage from "../components/Profilepage";

const Profile = () => {
  return (
    <AuthContextProvider>
      <Profilepage />
    </AuthContextProvider>
  );
};

export default Profile;
