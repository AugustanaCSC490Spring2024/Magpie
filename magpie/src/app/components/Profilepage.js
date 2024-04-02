"use client";
import { UserAuth } from "../context/AuthContext";
 import { useEffect } from "react";
 import { Container, Grid, Typography } from "@mui/material";
import { Users } from "../api/users";

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
        <Container maxWidth='xl'>

        <div>
          <h1>Welcome to your profile page, {user.displayName}!</h1>
          
            <Grid container spacing={4} style={{ paddingLeft: 140, paddingRight: 10, paddingBottom: 80, paddingTop: 30 }}>
              <Grid item xs={12} style={{ textAlign: 'center', alignItems: 'center', paddingRight: '15rem'}}>
              <img src={`https://via.placeholder.com/150x150.png?text=1`} ></img>

              </Grid>
              <Grid item xs={12} style={{ textAlign: 'center', paddingRight: '15rem'}}>
              <Typography variant={'h4'}>{user.displayName}</Typography>
              </Grid>
            </Grid>
          
        </div>
        </Container>

      )}
    </div>
)

}

export default Profilepage;