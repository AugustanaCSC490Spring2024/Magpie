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
    const { user } = UserAuth();

    useEffect(() => {
        async function fetchData() {
            if (userId && user) {
                const userDoc = await getDoc(doc(db, 'userProfiles', userId));
                if (userDoc.exists()) {
                    setUserName(userDoc.data().name);
                } else {
                    console.log("No user profile found");
                    return;
                }
    
                const messagesRef = collection(db, 'adminMessages');
                const q = query(
                    messagesRef,
                    where("userId", "in", [userId, user.uid]), // Includes both user IDs
                    where("senderId", "in", [userId, user.uid]), // Includes both sender IDs
                    orderBy('createdAt')
                );
    
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const fetchedMessages = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setMessages(fetchedMessages.sort((a, b) => a.createdAt - b.createdAt)); // Sort messages by createdAt
                }, error => {
                    console.error("Firestore error:", error);
                });
    
                return () => unsubscribe();
            } else {
                setMessages([]);
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
        <Container maxWidth="sm" sx={{
            position: 'fixed',
            right: 0,
            top: 0,
            height: '100vh',
            zIndex: 1300,
            overflow: 'auto'
        }}>
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
                        alignItems: msg.senderId === user.uid ? 'flex-end' : 'flex-start',
                        mb: 1,
                        p: 1,
                        bgcolor: msg.senderId === user.uid ? '#D6EAF8' : '#E2EFDA', // Change colors as needed
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
