import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Box, Button, TextField, Container, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { UserAuth } from '../context/AuthContext';

function AdminMessages({ userId, onClose }) {
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [userName, setUserName] = useState('');
    const { user } = UserAuth(); // Assuming this context provides admin user info

    useEffect(() => {
        async function fetchData() {
            if (userId && user) {
                const userDoc = await getDoc(doc(db, 'userProfiles', userId));
                if (userDoc.exists()) {
                    setUserName(userDoc.data().name);
                } else {
                    console.log("No user profile found");
                    return; // Exit if no user profile found
                }
    
                const messagesRef = collection(db, 'adminMessages');
                const q = query(
                    messagesRef,
                    where("userId", "==", userId),
                    where("senderId", "in", [user.uid, userId]),
                    orderBy('createdAt')
                );
    
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    if (snapshot.empty) {
                        console.log("No messages found for this user.");
                        setMessages([]); // Clear messages if none are found
                    } else {
                        const fetchedMessages = snapshot.docs.map(doc => {
                            return {
                                id: doc.id,
                                ...doc.data()
                            };
                        });
                        setMessages(fetchedMessages);
                    }
                }, error => {
                    console.error("Firestore error:", error);
                });
    
                return () => unsubscribe();
            } else {
                setMessages([]); // Clear messages when there is no user or user change
            }
        }
    
        fetchData();
    }, [userId, user]);
    
    

    const sendMessage = async () => {
        if (user && newMessage.trim() !== '') {
            const messageData = {
                text: newMessage,
                createdAt: new Date(),
                senderId: user.uid,
                senderName: user.displayName || user.email.split('@')[0],
                userId: userId,
                isAdmin: true
            };
            await addDoc(collection(db, 'adminMessages'), messageData);
            console.log("Message sent:", messageData); // Debugging log
            setMessages([...messages, { ...messageData, id: 'temp-id' }]); // Temp ID for UI purposes
            setNewMessage('');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ position: 'relative' }}>
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 0, top: 0 }}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Messaging {userName || 'User'}</Typography>
            </Box>
            <Box sx={{ my: 4, bgcolor: '#f0f0f0', p: 2, borderRadius: 2, boxShadow: 3 }}>
                {messages.map((msg) => (
                    <Box key={msg.id} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: msg.isAdmin ? 'flex-end' : 'flex-start',
                        mb: 1,
                        p: 1,
                        bgcolor: msg.isAdmin ? '#DCF8C6' : '#FFFFFF',
                        borderRadius: '20px',
                        maxWidth: '70%',
                        wordWrap: 'break-word'
                    }}>
                        <Typography variant="body2" sx={{ mx: 1, textAlign: 'left' }}>
                            {msg.text}
                            <Typography component="span" variant="caption" sx={{ display: 'block', textAlign: 'right', color: 'gray' }}>
                                {msg.createdAt.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString() : msg.createdAt.toLocaleTimeString()}
                            </Typography>
                        </Typography>
                    </Box>
                ))}
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage} sx={{ mt: 2 }} variant="contained" color="primary">
                    Send
                </Button>
            </Box>
        </Container>
    );
}

export default AdminMessages;
