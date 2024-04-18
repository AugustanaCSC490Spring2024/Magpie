import React, { useEffect, useState } from "react";
import { Grid, Button, Card, Typography, Container } from "@mui/material";
import { UserAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import ContactButton from "./Contactbutton";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getMatchingScores } from './matching';

const DashboardPage = (props) => {
  const { user, logOut, isAdmin } = UserAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [matchingScores, setMatchingScores] = useState({});
  const [isMounted, setIsMounted] = useState(false); // Flag to check component mount status

  useEffect(() => {
    setIsMounted(true); // Set mounted flag
    return () => setIsMounted(false); // Cleanup function to set it to false when unmounted
  }, []);

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    };
    checkAuthentication();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      router.push('/AdminPage');
    }
  }, [isAdmin, router]);

  useEffect(() => {
    const fetchUsersAndScores = async () => {
      try {
        const db = getFirestore();
        const usersCollection = collection(db, "userProfiles");
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const filteredUsers = userList.filter(u => u.id !== user.uid);
        if (isMounted) {
            setUsers(filteredUsers);
        }
        

        const scores = await getMatchingScores(user.uid);
        const scoresMap = scores.reduce((acc, score) => {
          acc[score.userId] = score.matchPercentage;
          return acc;
        }, {});
        if (isMounted) {
          setMatchingScores(scoresMap);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (user && isMounted) {
      fetchUsersAndScores();
    }
  }, [user, isMounted]);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2} style={{ paddingLeft: 140, paddingRight: 10, paddingBottom: 80, paddingTop: 30 }}>
        <Grid item xs={10}>
          {user && <Typography variant="h6">Welcome <span style={{ fontFamily: 'Arial' }}>{user.displayName}</span></Typography>}
        </Grid>
        <Grid item xs={1}>
          <Button href='../profile'>Profile</Button>
        </Grid>
        <Grid item xs={1}>
          <Button onClick={() => { logOut(); router.push('/#'); }}>Sign Out</Button>
        </Grid>
        {users.map((userProfile, index) => (
          <Grid item xs={4} key={userProfile.id}>
            <Card style={{ textAlign: 'center', padding: '2.4rem', width: '15rem', height: '38rem', borderRadius: '15px' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sx={{ margin: 'auto' }}>
                  <img src={`https://via.placeholder.com/150x150.png?text=${index}`} style={{ width: '150px', height: '150px', borderRadius: '15px' }} alt={`User ${userProfile.name || "Name not available"}`}></img>
                </Grid>
                <Grid item xs={12} sx={{ margin: 'auto' }}>
                  <Typography variant={'h4'}>{userProfile.name || "Name not available"}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant={'h6'}>{userProfile.major || "Major not available"}</Typography>
                </Grid>
                <Grid item xs={12} sx={{ margin: 'auto' }}>
                  <Typography>{userProfile.year || "Year not available"}</Typography>
                </Grid>
                <Grid item xs={12} sx={{ margin: 'auto' }}>
                  <Typography>Match: {matchingScores[userProfile.id] ? `${matchingScores[userProfile.id].toFixed(1)}%` : "Calculating..."}</Typography>
                </Grid>
                <Grid item xs={12} sx={{ margin: 'auto' }}>
                  <ContactButton user={userProfile} />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default DashboardPage;