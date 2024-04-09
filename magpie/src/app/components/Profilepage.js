"use client";
import { Container, Grid, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { UserAuth } from "../context/AuthContext";

const Profilepage = () => {
  const router = useRouter(); // Use useRouter for navigation
  const { user } = UserAuth(); // Get user from the UserAuth context

  // Function to handle onboarding button click using Next.js router
  const handleOnboardingClick = () => {
    router.push('/onboarding'); // Navigate to the onboarding page using Next.js router
  };

  return (
    <div className="profile-page">
      {user && (
        <Container maxWidth='xl'>
          <div>
            <h1>Welcome to your profile page, {user.displayName}!</h1>
            <Grid container spacing={4} style={{ paddingLeft: 140, paddingRight: 10, paddingBottom: 80, paddingTop: 30 }}>
              <Grid item xs={12} style={{ textAlign: 'center', alignItems: 'center', paddingRight: '15rem'}}>
                <img src={`https://via.placeholder.com/150x150.png?text=Profile`} style={{borderRadius: '80px'}} alt="Profile"></img>
              </Grid>
              <Grid item xs={12} style={{ textAlign: 'center', paddingRight: '15rem'}}>
                <Typography variant={'h4'}>{user.displayName}</Typography>
                <Button variant="contained" color="primary" onClick={handleOnboardingClick} style={{ marginTop: '20px' }}>
                  Start Onboarding
                </Button>
              </Grid>
            </Grid>
          </div>
        </Container>
      )}
    </div>
  );
};

export default Profilepage;
