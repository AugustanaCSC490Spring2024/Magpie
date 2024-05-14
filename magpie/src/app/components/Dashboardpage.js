import React, { useEffect, useState } from 'react';
import { Container, Grid, Button, Card, Typography, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { UserAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, getDocs, addDoc, getDoc, setDoc, updateDoc, doc, query, where, deleteDoc, onSnapshot } from 'firebase/firestore';
import { getMatchingScores } from './matching';
import { motion } from 'framer-motion';
import AdminMessages from '../components/adminmessages';
import { StyledEngineProvider } from '@mui/material/styles';
import UserProfileCard from './userProfileCard';

const DashboardPage = () => {
  const { user, logOut, isAdmin } = UserAuth();
  const router = useRouter();
  
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [sentRequests, setSentRequests] = useState({});
  const [receivedRequests, setReceivedRequests] = useState({});
  const [questionMap, setQuestionMap] = useState({});

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

  const db = getFirestore();

  // Fetching users and scores on initial load and also friend requests loads in realtime to reduce complexity and any delays.
  useEffect(() => {
    if (user) {
      fetchUsersAndScores();
      fetchFriendRequests();

      // Setting up real-time listener for friend requests
      const unsubscribeSent = onSnapshot(query(collection(db, 'friendRequests'), where('from', '==', user.uid)), (snapshot) => {
        const sentData = {};
        snapshot.forEach(doc => {
          sentData[doc.data().to] = { ...doc.data(), id: doc.id, type: 'sent' };
        });
        setSentRequests(sentData);
      });

      const unsubscribeReceived = onSnapshot(query(collection(db, 'friendRequests'), where('to', '==', user.uid)), (snapshot) => {
        const receivedData = {};
        snapshot.forEach(doc => {
          receivedData[doc.data().from] = { ...doc.data(), id: doc.id, type: 'received' };
        });
        setReceivedRequests(receivedData);
      });

      // Unsubscribe from listeners when component unmounts
      return () => {
        unsubscribeSent();
        unsubscribeReceived();
      };
    }
  }, [user]);       

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

  

  const fetchUsersAndScores = async () => {
    const db = getFirestore();
    const usersCollection = collection(db, 'userProfiles');
    const responsesCollection = collection(db, 'userResponses');
    const questionsCollection = collection(db, 'onboardingQuestions');

    const questionSnapshot = await getDocs(questionsCollection);
    const newQuestionMap = questionSnapshot.docs.reduce((acc, doc) => {
      acc[doc.data().questionText] = doc.id;
      return acc;
    }, {});
    if (isMounted) {
      setQuestionMap(newQuestionMap);
    }


    const userSnapshot = await getDocs(usersCollection);
    const responsesSnapshot = await getDocs(responsesCollection);
    const responsesData = responsesSnapshot.docs.map(doc => ({
        id: doc.id,
        responses: doc.data().responses
    }));
    console.log(responsesData);
    const userList = userSnapshot.docs.map(doc => {
        const response = responsesData.find(r => r.id === doc.id);
        return {
            id: doc.id,
            ...doc.data(),
            responses: response ? response.responses : {}
        };
    });

    const filteredUserList = userList.filter(u => u.id !== user.uid);
    if (isMounted) {
        setUsers(filteredUserList);
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

// This filter logic is applied to the array of users to match against specified filters and search queries.
  const filteredUsers = users.filter(user => {
      return (!filters.gender || user.responses[questionMap['What is your gender?']]?.response === filters.gender) &&
        (!filters.major || user.responses[questionMap["What's your major?"]]?.response === filters.major) &&
        (!filters.academicYear || user.responses[questionMap['What is your current academic year status?']]?.response === filters.academicYear) &&
        (!filters.residenceHall || user.responses[questionMap['What residence hall would you prefer to move to?']]?.response === filters.residenceHall) &&
        (!searchQuery || user.name.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  
  
  // Fetch friend requests for the current use
  const fetchFriendRequests = async () => {
    const db = getFirestore();
    const sentRequestsQuery = query(collection(db, 'friendRequests'), where('from', '==', user.uid));
    const receivedRequestsQuery = query(collection(db, 'friendRequests'), where('to', '==', user.uid));
    const [sentSnapshot, receivedSnapshot] = await Promise.all([
      getDocs(sentRequestsQuery),
      getDocs(receivedRequestsQuery)
    ]);
    const sentData = {}, receivedData = {};
    sentSnapshot.forEach(doc => {
      sentData[doc.data().to] = { ...doc.data(), id: doc.id, type: 'sent' };
    });
    receivedSnapshot.forEach(doc => {
      receivedData[doc.data().from] = { ...doc.data(), id: doc.id, type: 'received' };
    });
    setSentRequests(sentData);
    setReceivedRequests(receivedData);
  };

  // Helper function to generate a unique ID for a friend request document
  const getRequestDocId = (userId1, userId2) => {
    return [userId1, userId2].sort().join('_');
  };

  // Handle sending a friend request to another user
  const handleSendRequest = async (toUserId) => {
    const db = getFirestore();
    const requestId = getRequestDocId(user.uid, toUserId);
    const requestDocRef = doc(db, 'friendRequests', requestId);
    const docSnap = await getDoc(requestDocRef);

    if (docSnap.exists() && docSnap.data().status === 'pending') {
        // If it exists and is pending, delete it
        await deleteDoc(requestDocRef);
    } else if (!docSnap.exists()){
        // Otherwise, create it
        await setDoc(requestDocRef, {
            from: user.uid,
            to: toUserId,
            status: 'pending'
        }, { merge: true });
    }
    await fetchFriendRequests();
};

// Handle accepting or declining a friend request
const handleRequestResponse = async (fromUserId, response) => {
  const db = getFirestore();
  const requestId = getRequestDocId(user.uid, fromUserId);
  const requestDocRef = doc(db, 'friendRequests', requestId);

  if (response === 'accept') {
    await updateDoc(requestDocRef, { status: 'accepted' });
  } else {
    await updateDoc(requestDocRef, { status: 'declined'});
  }
  await fetchFriendRequests();
};

const handleDeleteRequest = async (toUserId) => {
    const db = getFirestore();
    const requestId = getRequestDocId(user.uid, toUserId);
    const requestDocRef = doc(db, 'friendRequests', requestId);
    const docSnap = await getDoc(requestDocRef);

    if (docSnap.exists()) {
        await deleteDoc(requestDocRef);
    }
    await fetchFriendRequests();
};



const renderRequestButtons = (userId) => {
  const sentRequest = sentRequests[userId];
  const receivedRequest = receivedRequests[userId];

  if ((sentRequest && sentRequest.status === 'accepted') || (receivedRequest && receivedRequest.status === 'accepted')) {
    return <Button
    onClick={() => handleSelectUser(userId)}
    variant="contained"
    color="primary"
  >
    Message
  </Button>
  
  }

  if ((sentRequest && sentRequest.status === 'declined') || (receivedRequest && receivedRequest.status === 'declined')) {
    return handleDeleteRequest(userId);
  }

  if (receivedRequest && receivedRequest.type === 'received') {
    return (
      <>
        <Button onClick={() => handleRequestResponse(userId, 'accept')} color="primary">Accept</Button>
        <Button onClick={() => handleRequestResponse(userId, 'decline')} color="secondary">Decline</Button>
      </>
    );
  } else if (sentRequest && sentRequest.type === 'sent') {
    return <Button onClick={() => handleSendRequest(userId)} color="primary">Cancel Pending Request</Button>;
  }
  
  return <Button onClick={() => handleSendRequest(userId)}>Send Friend Request</Button>;
};

const handleSelectUser = (userId) => {
  setSelectedUserId(userId);
}

const handleClose = () => {
  setSelectedUserId(null);  
};



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

        <Grid container spacing={2} style={{ paddingLeft: '3%', marginTop: '20px' }}>

          {filteredUsers.map((userProfile, index) => (
            <Grid item xs={4} key={userProfile.id}>
              <motion.div
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.8 }}
                variants={cardVariants}
              >
                <UserProfileCard userProfile={userProfile} matchingScores={matchingScores}></UserProfileCard>
               
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </StyledEngineProvider>);
};

export default DashboardPage;
