import React, { useEffect, useState } from "react";
import { Grid, Button, Card, Typography, Container } from "@mui/material";
import { UserAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getMatchingScores } from './matching';
import { motion } from 'framer-motion';




const DashboardPage = (props) => {
  const { user, logOut, isAdmin } = UserAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [matchingScores, setMatchingScores] = useState({});
  const [isMounted, setIsMounted] = useState(false); // Flag to check component mount status
  
    const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };
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
      <Grid container spacing={2} style={{ padding: '30px 10px 80px 140px' }}>
        <Grid item xs={12}>
          {user && <Typography variant="h6">Welcome, {user.displayName}</Typography>}
        </Grid>
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button href='../profile'>Profile</Button>
          <Button onClick={() => { logOut(); router.push('/#'); }}>Sign Out</Button>
        </Grid>
        {users.map((userProfile, index) => (
          <Grid item xs={4} key={userProfile.id}>
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.8 }}
              variants={cardVariants}
            >
              <Card style={{ textAlign: 'center', padding: '2.4rem', width: '15rem', borderRadius: '15px' }}>
                <img src={userProfile.imageUrl || `https://via.placeholder.com/150x150.png?text=No+Image`} alt={`User ${userProfile.name}`} style={{ width: '150px', height: '150px', borderRadius: '15px', margin: 'auto' }} />
                <Typography variant="h4">{userProfile.name || "Name not available"}</Typography>
                <Typography>{userProfile.bio || "Bio not available"}</Typography>
                <Typography>{userProfile.email || "Email not available"}</Typography>
                <Typography>Match: {matchingScores[userProfile.id] ? `${matchingScores[userProfile.id].toFixed(1)}%` : "Calculating..."}</Typography>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};



export default DashboardPage;
