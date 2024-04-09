"use client";
import { AuthContextProvider } from "../context/AuthContext";
import Profilepage from "../components/Profilepage";
import Onboarding from "../onboarding/page";

const Profile = () => {
  return (
    <AuthContextProvider>
      <Profilepage />
      <Onboarding />
    </AuthContextProvider>
  );
};

export default Profile;
