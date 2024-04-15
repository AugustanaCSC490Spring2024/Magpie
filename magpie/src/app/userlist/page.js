"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { Container, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import AdminMessages from '../components/adminmessages';
import { AuthContextProvider } from "../context/AuthContext";
import { adminEmails } from "../context/AuthContext";

function UserList() {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        const usersRef = collection(db, 'userProfiles');
        const q = query(usersRef);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const userList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).filter(user => !adminEmails.includes(user.email));  // Apply filter here
            setUsers(userList);
        });

        return () => unsubscribe();
    }, []);


    const handleSelectUser = (userId) => {
        setSelectedUserId(userId);
    };
    const handleClose = () => {
        setSelectedUserId(null);  // This sets the selectedUserId to null, which should close the AdminMessages
    };
    

    return (
        <AuthContextProvider>
            <Container maxWidth="sm" sx={{
                position: 'fixed', // Makes the container fixed position
                left: 170, // Align to the right side
                top: 20, // Start from the top
                width: '50vw', // Manage the width to make it look like a sidebar
                height: '100vh', // Full viewport height
                overflowY: 'auto', // Adds vertical scroll to the container
                zIndex: 1200 // Ensure it's above other content but below modal dialogs
            }}>
                <Typography variant="h3" sx={{ my: 2 }}>User List</Typography>
                <List>
                    {users.map(user => (
                        <ListItem key={user.id} divider button onClick={() => handleSelectUser(user.id)}>
                            <ListItemAvatar>
                                <Avatar src={user.imageUrl || 'https://via.placeholder.com/150.png?text=Profile'} alt={user.name} />
                            </ListItemAvatar>
                            <ListItemText primary={user.name} secondary={user.email + " - " + user.bio} />
                            <IconButton edge="end" onClick={() => handleSelectUser(user.id)}>
                                <MessageIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
                {selectedUserId && <AdminMessages userId={selectedUserId} onClose={handleClose} />}
            </Container>
        </AuthContextProvider>
    );
}

export default UserList;
