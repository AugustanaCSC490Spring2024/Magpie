"use client";
import { Grid, Button, Card, Typography, Modal, ModalContent, Box, Dialog, Container } from "@mui/material";
import { UserAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { IconButton } from '@mui/material';
import { db } from '../firebase';
import AdminMessages from '../components/adminmessages';
import { collection, getDocs, query, orderBy, doc, getDoc, onSnapshot, where, getFirestore, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import LockIcon from '@mui/icons-material/Lock';

const UserProfileModal = ({ userProfile, matchingScores }) => {
    const [questions, setQuestions] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [sentRequests, setSentRequests] = useState({});
    const [receivedRequests, setReceivedRequests] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [hasSubmittedResponses, setHasSubmittedResponses] = useState(false);
    const { user, logOut, isAdmin } = UserAuth();

    useEffect(() => {
        fetchFriendRequests();
        const fetchQuestionsAndResponses = async () => {
            setIsLoading(true);

            const q = query(collection(db, 'onboardingQuestions'), orderBy('order'));
            const querySnapshot = await getDocs(q);
            const fetchedQuestions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            let existingResponses = {};
            setQuestions(fetchedQuestions);
            setIsLoading(false);
        };

        if (user) {
            fetchQuestionsAndResponses();
        }
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
    }, [user]);

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

const handleSelectUser = (userId) => {
    setSelectedUserId(userId);
  }

  const handleClose = () => {
    setSelectedUserId(null);  
  };
  

const renderRequestButtons = (userId) => {
  const sentRequest = sentRequests[userId];
  const receivedRequest = receivedRequests[userId];

  if ((sentRequest && sentRequest.status === 'accepted') || (receivedRequest && receivedRequest.status === 'accepted')) {
    return (
    <>
    <Button
    onClick={() => handleSelectUser(userId)}
    variant="contained"
    color="primary"
  >
    Message
  </Button>
  
  <Button onClick={() => handleDeleteRequest(userId)} color="secondary">Unfriend</Button>
  </>
    );
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
    const questionsObject = {};
    questions.forEach(el => {
        const { id, ...questionText } = el;
        questionsObject[id] = questionText;

    })
    console.log(questionsObject);
    const [modalOpen, setModalOpen] = useState(false);
    const handleModal = (val) => {
        setModalOpen(val);
    }
    const percentage = 66;
    const responses = userProfile.responses;


    const [index, setIndex] = useState(0);
    const questionsLength = Number(Object.keys(responses).length);

    const nextItem = () => {
        setIndex((index) => {
            let newIndex = index + 1;
            return wrapItems(newIndex);
        });

    };

    const previousItem = () => {
        setIndex((index) => {
            let newIndex = index - 1;
            return wrapItems(newIndex);
        });

    };

    const wrapItems = (itemIndex) => {
        if (itemIndex > questionsLength - 1) {
            return 0;
        } else if (itemIndex < 0) {
            return questionsLength - 1;
        } else {
            return itemIndex;
        }
    };

    const currentItem = Object.values(responses)[index];
    const currentKey = Object.keys(responses)[index];

    console.log(index, currentItem);
    console.log(questionsObject[currentKey]?.questionText);
    return (
        <>

            <Button onClick={() => { handleModal(true); }} variant={'secondary'} style={{ background: '#2185dc', color: 'white' }}>{'View profile'}</Button>
            <Container maxWidth="xl" sx={{ position: 'fixed' }}>

                <Dialog id='modal' open={modalOpen} onClose={() => { handleModal(false); }}
                    aria-describedby="server-modal-description" sx={{
                        "& .MuiDialog-container": {
                            "& .MuiPaper-root": {
                                width: "100%",
                                maxWidth: "700px",
                                height: "100%",
                                maxHeight: "900px",
                                alignItems: 'center',
                                padding: '2rem',

                            },
                        },
                    }}>

                    <Grid container spacing={2} sx={{ height: 100 }}>
                        <Grid item xs={3}>
                            <img src={userProfile.imageUrl || `https://via.placeholder.com/150x150.png?text=No+Image`} alt={`User ${user.name}`} style={{ width: '150px', height: '150px', borderRadius: '150px', margin: 'auto' }} />
                        </Grid>
                        <Grid item xs={8} style={{ paddingTop: '70px', paddingLeft: '40px' }}>
                            <Typography variant="h4" sx={{ fontFamily: 'poppins, sans-serif' }}>{userProfile.name || "Name not available"}</Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: 'center', marginTop: '2.2rem' }}>
                            <Typography variant="h4" className="matchtitle" sx={{ color: 'blue', fontSize: 25, fontWeight: 450 }}> {'BIO'}</Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: 'center', paddingBottom: 10 }}>
                            <Typography variant="h4" sx={{ fontSize: 25, fontWeight: 400 }}> {userProfile.bio}</Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton aria-label='close' onClick={previousItem}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </Grid>
                        <Grid item xs={10} sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" className="matchtitle" sx={{ color: 'blue', fontSize: 25, fontWeight: 450 }}> {'RESPONSES'}</Typography>
                        </Grid>

                        <Grid item xs={1}>
                            <IconButton aria-label='close' onClick={nextItem}>
                                <ChevronRightIcon />
                            </IconButton>
                        </Grid>

                        <Grid item xs={12} sx={{ textAlign: 'center', paddingBottom: 21 }}>
                            <Typography variant="h4" sx={{ fontSize: 25, fontWeight: 700 }}> {questionsObject[currentKey]?.questionText}</Typography>
                            <Typography variant="h4" sx={{ fontSize: 25, fontWeight: 400, paddingTop: 4 }}> {currentItem?.visibility === true ? currentItem?.response : <LockIcon />}</Typography>
                        </Grid>

                        <Grid item xs={2.5} sx={{ textAlign: 'center', padding: '1rem' }}>
                            <div style={{ width: 105, height: 105 }}>
                                <CircularProgressbar styles={{ path: { stroke: `rgba(33, 133, 220, 1)` }, text: { fill: '#2185dc' } }} value={matchingScores[user.id] ? matchingScores[user.id].toFixed(1) : 0} text={`${matchingScores[user.id] ? matchingScores[user.id].toFixed(1) : '0'}%`} />
                            </div>
                        </Grid>

                        <Grid item xs={6.5} sx={{ textAlign: 'left', marginTop: '2.2rem' }}>
                            <Typography variant="h4" className="matchtitle" sx={{ color: 'blue', fontSize: 25 }}> {'Matching score'}</Typography>
                        </Grid>
                        <Grid item xs={3} sx={{ textAlign: 'right', marginTop: '2.2rem', marginBottom: '1rem' }}>
                        <Button onClick={() => handleSendRequest(userProfile.id)}
                                variant="contained"
                                color="primary"
                                style={{
                                    textTransform: 'none', 
                                    marginRight: '2rem',
                                    borderRadius: '10px', 
                                    padding: '10px 20px', // More balanced padding
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)', // More pronounced shadow
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem', // Slightly larger font size
                                    transition: 'all 0.3s ease-out', // Smoother transition
                                    background: 'linear-gradient(45deg, #000022 30%, #555599 90%)', // Gradient background
                                    color: '#ffffff', // White text for better contrast
                                    textAlign: 'center',
                                    '&:hover': { 
                                    background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)', // Inverted gradient on hover
                                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)', // Increased shadow on hover
                                    },
                                }}
                                >
                    {renderRequestButtons(userProfile.id)}
                  </Button>
                  {selectedUserId && <AdminMessages userId={selectedUserId} onClose={handleClose} />}
                </Grid>
                    </Grid>
                </Dialog>
            </Container>

        </>
    )

}

export default UserProfileModal;