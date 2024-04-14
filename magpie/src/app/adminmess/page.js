"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Container, Box, TextField, Button, Typography } from '@mui/material';
import { UserAuth } from '../context/AuthContext'; // Assuming you have an authentication context

function AdminMessages() {
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const { user } = UserAuth(); // Assumes this context provides admin user info
    const router = useRouter();
    const { userId } = router.query; // Gets the user ID from the URL

    const colorAdmin = '#FFC0CB'; // Pink color for admin messages
    const colorUser = '#ADD8E6'; // Light blue color for user messages

    useEffect(() => {
        if (userId) {
            const messagesRef = collection(db, 'adminMessages');
            const q = query(messagesRef, where("userId", "==", userId), orderBy('createdAt'));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const messages = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setMessages(messages);
            });

            return () => unsubscribe();
        }
    }, [userId]);

    const sendMessage = async () => {
        if (newMessage.trim() !== '') {
            await addDoc(collection(db, 'adminMessages'), {
                text: newMessage,
                createdAt: new Date(),
                senderId: user.uid,
                senderName: user.email.split('@')[0],
                userId: userId, // Includes the recipient user ID
                isAdmin: true // Mark message as sent by admin
            });
            setNewMessage('');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Messaging {userId}</Typography>
            <Box sx={{ my: 4, bgcolor: '#f0f0f0', p: 2, borderRadius: 2, boxShadow: 3 }}>
                {messages.map((msg) => (
                    <Box key={msg.id} sx={{
                        display: 'flex',
                        justifyContent: msg.isAdmin ? 'flex-end' : 'flex-start',
                        mb: 1,
                        p: 1,
                        bgcolor: msg.isAdmin ? colorAdmin : colorUser,
                        borderRadius: '20px',
                        maxWidth: '70%',
                        wordWrap: 'break-word'
                    }}>
                        <Typography variant="body2" sx={{ mx: 1, textAlign: 'left' }}>
                            {msg.text}
                            <Typography component="span" variant="caption" sx={{ display: 'block', textAlign: 'right', color: 'gray' }}>
                                {new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                    onKeyPress={(e) => e.key === 'Enter' ? sendMessage() : null}
                />
                <Button onClick={sendMessage} sx={{ mt: 2 }} variant="contained" color="primary">
                    Send
                </Button>
            </Box>
        </Container>
    );
}

export default AdminMessages;
