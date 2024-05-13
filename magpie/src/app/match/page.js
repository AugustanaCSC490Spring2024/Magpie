"use client";
import React, { useEffect, useState } from 'react';
import { Container, Button, Typography, FormControl, InputLabel, MenuItem, Select, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText } from '@mui/material';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { UserAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import "../globals.css";

const Match = () => {
    const { user } = UserAuth();
    const db = getFirestore();

    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [matchRequests, setMatchRequests] = useState({});
    const [showMatchAnimation, setShowMatchAnimation] = useState(false);
    const [matchedUserName, setMatchedUserName] = useState(''); 
    const [openMatchesDialog, setOpenMatchesDialog] = useState(false);
    const [openRequestsDialog, setOpenRequestsDialog] = useState(false);
    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = collection(db, 'userProfiles');
            const snapshot = await getDocs(usersCollection);
            const usersList = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
            setUsers(usersList.filter(u => u.id !== user.uid));
        };

        const fetchMatchRequests = () => {
            const matchRequestsRef = collection(db, 'matchRequests');
            const unsubscribe = onSnapshot(matchRequestsRef, (snapshot) => {
                const requestsData = {};
                setShowMatchAnimation(false);
                snapshot.forEach(doc => {
                    const requestData = doc.data();
                    if (requestData.from === user.uid || requestData.to === user.uid) {
                        const key = requestData.from === user.uid ? requestData.to : requestData.from;
                        requestsData[key] = { ...requestData, id: doc.id };
                        if (requestData.status === 'accepted') {
                            const matchedUser = users.find(u => u.id === key);
                            if (matchedUser) {
                                setMatchedUserName(matchedUser.name);
                                setShowMatchAnimation(true);
                            }
                        }
                    }
                });
                setMatchRequests(requestsData);
            });

            return unsubscribe;
        };

        fetchUsers();
        const unsubscribeMatchRequests = fetchMatchRequests();

        return () => {
            unsubscribeMatchRequests();
        };
    }, [db, user.uid, users]);

    const getRequestDocId = (userId1, userId2) => {
        return [userId1, userId2].sort().join('_');
      };

    const handleRequest = async (otherUserId, action) => {
        const requestId = getRequestDocId(user.uid, otherUserId);
        const requestDocRef = doc(db, 'matchRequests', requestId);

        if (action === 'send') {
            const matchRequest = {
                from: user.uid,
                to: otherUserId,
                status: 'pending'
            };
            await setDoc(requestDocRef, matchRequest);
            setShowMatchAnimation(false);
        } else if (action === 'cancel' || action === 'unmatch' || action === 'decline') {
            await deleteDoc(requestDocRef);
            setShowMatchAnimation(false);
        }
    };

    const handleResponse = async (fromUserId, response) => {
        const requestId = getRequestDocId(user.uid, fromUserId);
        const requestDocRef = doc(db, 'matchRequests', requestId);

        if (response === 'accept') {
            const matchedUser = users.find(u => u.id === fromUserId);
            setMatchedUserName(matchedUser ? matchedUser.name : '');
            await updateDoc(requestDocRef, { status: 'accepted' });
            setShowMatchAnimation(true);
        } else {
            await deleteDoc(requestDocRef);
            setShowMatchAnimation(false);
        }
    };

    const renderRequestButton = (userId) => {
        const request = matchRequests[userId];
        if (request && request.status === 'accepted') {
            return <Button onClick={() => handleRequest(userId, 'unmatch')} style={{ backgroundColor: 'blue', color: 'white', marginTop: '-40px' }}>Unmatch</Button>;
        } else if (request && request.status === 'pending' && request.from === user.uid) {
            return <Button onClick={() => handleRequest(userId, 'cancel')} style={{ backgroundColor: 'blue', color: 'white', marginTop: '-40px' }}>Cancel Request</Button>;
        } else if (request && request.status === 'pending' && request.to === user.uid) {
            return (
                <>
                    <Button onClick={() => handleResponse(userId, 'accept')}  color="primary">Accept</Button>
                    <Button onClick={() => handleResponse(userId, 'decline')} color="secondary">Decline</Button>
                </>
            );
        } else if (!request || request.status === 'declined') {
            return (
                <Button onClick={() => handleRequest(userId, 'send')} style={{ backgroundColor: 'blue', color: 'white', marginTop: '-40px' }}>Send Match Request</Button>
            );
        }
    };

    const dialogStyle = {
        overflow: 'hidden',
        borderRadius: '10px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.18)'
    };

    const handleSelectChange = (event) => {
        setSelectedUserId(event.target.value);
    };

    const handleOpenMatches = () => {
        setOpenMatchesDialog(true);
    };

    const handleOpenRequests = () => {
        setOpenRequestsDialog(true);
    };

    const handleClose = () => {
        setOpenMatchesDialog(false);
        setOpenRequestsDialog(false);
    };

    

    const dropdownAnimation = {
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 }
    };

    return (
        <Container style={{
            background: 'linear-gradient(to right, #55bbff 0%, #b6a6fc 100%)',
            minHeight: '100vh',
            width: '100%',
            padding: '20px',
            position: 'relative'
        }}>
            <Typography variant="h4" sx={{marginTop: '80px', fontWeight: 'bold'}} gutterBottom>Match with a User</Typography>
            <FormControl fullWidth variant="outlined" style={{ margin: '20px 0' }}>
                <InputLabel id="user-select-label">Select a User</InputLabel>
                <Select
                    labelId="user-select-label"
                    value={selectedUserId}
                    onChange={handleSelectChange}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                borderRadius: '20px',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(10px)',
                            },
                        },
                    }}
                >
                    {users.map((user) => (
                        <MenuItem key={user.id} value={user.id} component={motion.div} variants={dropdownAnimation} whileHover="whileHover" whileTap="whileTap">
                            {user.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {selectedUserId && renderRequestButton(selectedUserId)}
            <AnimatePresence>
                {showMatchAnimation && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 360, scale: 1, opacity: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '40%',
                            transform: 'translate(-50%, -50%)',
                            width: '300px',
                            height: '300px',
                            borderRadius: '200px',
                            backgroundColor: 'rgba(0, 255, 0, 0.5)',
                        }}
                    >
                        <Typography variant="h4" style={{ textAlign: 'center', lineHeight: '60px', marginTop: "50px" }}>Matched with {matchedUserName}!</Typography>
                    </motion.div>
                )}
            </AnimatePresence>
            <Button onClick={handleOpenMatches} variant="contained" color="primary" style={{ margin: '10px' }}>View Your Matches</Button>
            <Button onClick={handleOpenRequests} variant="contained" color="secondary" style={{ margin: '10px' }}>View Your Match Requests</Button>

            <Dialog open={openMatchesDialog} onClose={handleClose} PaperProps={{ style: dialogStyle }}>
                <DialogTitle>Matches</DialogTitle>
                <DialogContent>
                    <List>
                        {Object.entries(matchRequests).filter(([key, value]) => value.status === 'accepted').map(([key, value]) => (
                            <ListItem key={key}>
                                <ListItemText primary={`Matched with ${users.find(u => u.id === key).name}`} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openRequestsDialog} onClose={handleClose} PaperProps={{ style: dialogStyle }}>
                <DialogTitle>Match Requests</DialogTitle>
                <DialogContent>
                    <List>
                        {Object.entries(matchRequests).filter(([key, value]) => value.status === 'pending').map(([key, value]) => (
                            <ListItem key={key}>
                                <ListItemText primary={`Request from ${users.find(u => u.id === key).name}`} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Match;
