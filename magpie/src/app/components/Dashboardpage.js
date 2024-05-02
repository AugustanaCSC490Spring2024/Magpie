import React, { useEffect, useState } from 'react';
import { Container, Grid, Button, Card, Typography, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { UserAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getMatchingScores } from './matching';
import { motion } from 'framer-motion';
import { StyledEngineProvider } from '@mui/material/styles';

const DashboardPage = () => {
  const { user, logOut, isAdmin } = UserAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [matchingScores, setMatchingScores] = useState({});
  const [isMounted, setIsMounted] = useState(false);
  const [filters, setFilters] = useState({
    gender: '',
    major: '',
    academicYear: '',
    residenceHall: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (isAdmin) {
      router.push('/AdminPage');
    }
  }, [isAdmin, router]);

  useEffect(() => {
    if (user && isMounted) {
      fetchUsersAndScores();
    }
  }, [user, isMounted]);

  const fetchUsersAndScores = async () => {
    const db = getFirestore();
    const usersCollection = collection(db, 'userProfiles');
    const responsesCollection = collection(db, 'userResponses');

    const userSnapshot = await getDocs(usersCollection);
    const responsesSnapshot = await getDocs(responsesCollection);
    const responsesData = responsesSnapshot.docs.map(doc => ({ id: doc.id, responses: doc.data().responses }));
    const userList = userSnapshot.docs.map(doc => {
      const response = responsesData.find(r => r.id === doc.id);
      return { id: doc.id, ...doc.data(), responses: response ? response.responses : {} };
    });

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
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter(user => {
    return (!filters.gender || user.responses['What is your gender?'] === filters.gender) &&
      (!filters.major || user.responses["What's your major?"] === filters.major) &&
      (!filters.academicYear || user.responses['What is your current academic year status?'] === filters.academicYear) &&
      (!filters.residenceHall || user.responses['What residence hall would you prefer to move to?'] === filters.residenceHall) &&
      (!searchQuery || user.name.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <StyledEngineProvider injectFirst>
      <Container maxWidth="xl">
        
      <Typography variant="h3" sx={{fontFamily: 'poppins, sans-serif', marginTop: '100px', marginBottom: '20px', textAlign: 'center'}}>Dashboard Overview</Typography>

        <Grid container spacing={3} alignItems="center">
        <Grid item xs={3}>
            <TextField
              fullWidth
              label="Search by name"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select value={filters.gender} name="gender" onChange={handleFilterChange}>
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel>Academic Year</InputLabel>
              <Select value={filters.academicYear} name="academicYear" onChange={handleFilterChange}>
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="Freshman">Freshman</MenuItem>
                <MenuItem value="Sophomore">Sophomore</MenuItem>
                <MenuItem value="Junior">Junior</MenuItem>
                <MenuItem value="Senior">Senior</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel>Residence Preference</InputLabel>
              <Select value={filters.residenceHall} name="residenceHall" onChange={handleFilterChange}>
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="No Preference">No Preference</MenuItem>
                <MenuItem value="Seminary Hall">Seminary Hall</MenuItem>
                <MenuItem value="Andreen Hall">Andreen Hall</MenuItem>
                <MenuItem value="Swanson Commons">Swanson Commons</MenuItem>
                <MenuItem value="Erickson Hall">Erickson Hall</MenuItem>
                <MenuItem value="Westerlin Hall">Westerlin Hall</MenuItem>
                <MenuItem value="Naeseth Tonwhouses">Naeseth Tonwhouses</MenuItem>
                <MenuItem value="Parkander">Parkander</MenuItem>
                <MenuItem value="Arbaugh">Arbaugh</MenuItem>
                <MenuItem value="other TLAs">other TLAs</MenuItem>
                <MenuItem value="Off Campus House">Off Campus House</MenuItem>

              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2} style={{ padding: '30px 10px 80px 140px', marginTop: '20px' }}>

          {filteredUsers.map((userProfile, index) => (
            <Grid item xs={4} key={userProfile.id}>
              <motion.div
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.8 }}
                variants={cardVariants}
              >
                <Card style={{
                  textAlign: 'center',
                  padding: '2.4rem',
                  maxWidth: '25rem',
                  borderRadius: '15px',
                  minHeight: '25rem',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s',
                  backgroundImage: 'linear-gradient(to bottom right, #ffffff, #f0f0f0)',
                  border: '1px solid #e0e0e0',
                  ':hover': {
                    transform: 'scale(1.05)'
                  }
                }}>
                  <Grid container spacing={2} style={{ marginRight: '30px' }}>
                    <Grid item xs={12}>
                      <img src={userProfile.imageUrl || `https://via.placeholder.com/150x150.png?text=No+Image`} alt={`User ${userProfile.name}`} style={{ width: '150px', height: '150px', borderRadius: '15px', margin: 'auto' }} />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h4" sx={{fontFamily: 'poppins, sans-serif'}}>{userProfile.name || "Name not available"}</Typography>
                    </Grid>

                    <Grid item xs={12} align="center">
                     <Typography variant="h7">{userProfile.email || "Email not available"}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography>Match: {matchingScores[userProfile.id] ? `${matchingScores[userProfile.id].toFixed(1)}%` : "not available"}</Typography>

                    </Grid>

                  </Grid>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </StyledEngineProvider>);
};

export default DashboardPage;
