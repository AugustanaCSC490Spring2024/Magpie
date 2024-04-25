import React, { useEffect, useState } from 'react';
import { Container, Grid, Button, Card, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { UserAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getMatchingScores } from './matching';
import { motion } from 'framer-motion';

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
    console.log(userList);


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

  const filteredUsers = users.filter(user => {
    return (!filters.gender || user.responses['What is your gender?'] === filters.gender) &&
      (!filters.major || user.responses["What's your major?"] === filters.major) &&
      (!filters.academicYear || user.responses['What is your current academic year status?'] === filters.academicYear) &&
      (!filters.residenceHall || user.responses['What residence hall would you prefer to move to?'] === filters.residenceHall);
  });

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3} alignItems="center" sx={{marginTop: '50px'}}>
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
              <InputLabel>Major</InputLabel>
              <Select value={filters.major} name="major" onChange={handleFilterChange}>
                <MenuItem value="">Any</MenuItem>
               <MenuItem value="Undecided">Undecided</MenuItem>
                <MenuItem value="Biology">Biology</MenuItem>
                <MenuItem value="Psychology">Psychology</MenuItem>
                <MenuItem value="Business Administration and Management">Business Administration and Management</MenuItem>
                <MenuItem value="Accounting">Accounting</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Speech communication and rhetoric">Speech communication and rhetoric</MenuItem>
                <MenuItem value="Marketing/ Marketing management">Marketing/ Marketing management</MenuItem>
                <MenuItem value="Neuroscience">Neuroscience</MenuItem>
                <MenuItem value="Political science and government">Political science and government</MenuItem>
                <MenuItem value="Communication sciences and disorders">Communication sciences and disorders</MenuItem>
                <MenuItem value="Sociology">Sociology</MenuItem>
                <MenuItem value="Computer Science">Computer Science</MenuItem>
                <MenuItem value="Environmental Studies">Environmental Studies</MenuItem>
                <MenuItem value="Hispanic and Latin American Languages, Literatures">Hispanic and Latin American Languages, Literatures</MenuItem>
                <MenuItem value="English language and literature">English language and literature</MenuItem>
                <MenuItem value="Economics">Economics</MenuItem>
                <MenuItem value="International business/trade/commerce">International business/trade/commerce</MenuItem>
                <MenuItem value="Elementary education and teaching">Elementary education and teaching</MenuItem>
                <MenuItem value="Music teacher education">Music teacher education</MenuItem>
                <MenuItem value="Graphic design">Graphic design</MenuItem>
                <MenuItem value="Philosophy">Philosophy</MenuItem>
                <MenuItem value="History">History</MenuItem>
                <MenuItem value="Journalism">Journalism</MenuItem>
                <MenuItem value="Biochemistry">Biochemistry</MenuItem>
                <MenuItem value="Public health">Public health</MenuItem>
                <MenuItem value="Applied mathematics">Applied mathematics</MenuItem>
                <MenuItem value="Geography">Geography</MenuItem>
                <MenuItem value="Creative writing">Creative writing</MenuItem>
                <MenuItem value="Art history">Art history</MenuItem>
                <MenuItem value="Mathematics teacher education">Mathematics teacher education</MenuItem>
                <MenuItem value="Theatre Arts">Theatre Arts</MenuItem>
                <MenuItem value="Studio Arts">Studio Arts</MenuItem>
                <MenuItem value="Music">Music</MenuItem>
                <MenuItem value="French language and literature">French language and literature</MenuItem>
                <MenuItem value="Anthropology">Anthropology</MenuItem>
                <MenuItem value="English/language arts teacher education">English/language arts teacher education</MenuItem>
                <MenuItem value="Engineering physics/applied physics">Engineering physics/applied physics</MenuItem>
                <MenuItem value="Mathematics">Mathematics</MenuItem>
                <MenuItem value="Chemistry">Chemistry</MenuItem>
                <MenuItem value="History teacher education">History teacher education</MenuItem>
                <MenuItem value="German language and literature">German language and literature</MenuItem>
                <MenuItem value="Asian studies">Asian studies</MenuItem>
                <MenuItem value="Science teacher education">Science teacher education</MenuItem>
                <MenuItem value="Physics">Physics</MenuItem>
                <MenuItem value="Women's studies">Women's studies</MenuItem>
                <MenuItem value="Art teacher education">Art teacher education</MenuItem>
                <MenuItem value="Classics and classical languages, literatures, and linguistics">Classics and classical languages, literatures, and linguistics</MenuItem>
                <MenuItem value="Scandinavian Studies">Scandinavian Studies</MenuItem>

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
              <InputLabel>Residence Hall</InputLabel>
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

      <Grid container spacing={2} style={{ padding: '30px 10px 80px 140px', marginTop: '20px'}}>   

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
    maxWidth: '16rem', 
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
