"use client";
import { AuthContextProvider } from "../context/AuthContext";
import Profilepage from "../components/Profilepage";
import Onboarding from "../onboarding/page";

const Profile = () => {
  return (
    <AuthContextProvider>
      <div style={{ position: 'relative', zIndex: 0 }}> {/* Ensures content flow */}
        <Profilepage />
        <div style={{ paddingTop: '85vh' }}> {/* Pushes onboarding down or adjust as needed */}
          <Onboarding />
        </div>
      </div>
    </AuthContextProvider>
  );
};


export default Profile;
