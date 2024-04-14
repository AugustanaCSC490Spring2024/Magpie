"use client";
import { AuthContextProvider } from "../context/AuthContext";
import Profilepage from "../components/Profilepage";
import Onboarding from "../onboarding/page";

const Profile = () => {
  return (
    <AuthContextProvider>
      <div style={{ position: 'relative', zIndex: 0 }}> 
        <Profilepage />
        <div style={{ paddingTop: '85vh' }}> 
          <Onboarding />
        </div>
      </div>
    </AuthContextProvider>
  );
};


export default Profile;
