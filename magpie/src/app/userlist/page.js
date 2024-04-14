"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { Container, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, ListItemSecondaryAction } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import AdminMessages from '../components/adminmessages'; // Import the AdminMessages component
import { AuthContextProvider } from "../context/AuthContext";

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
            }));
            setUsers(userList);
        });

        return () => unsubscribe();
    }, []);

    const handleSelectUser = (userId) => {
        setSelectedUserId(userId); // Set selected user ID
    };

    return (
        <AuthContextProvider>
        <Container maxWidth="sm">
            <Typography variant="h4" sx={{ mt: 4 }}>User List</Typography>
            <List>
                {users.map(user => (
                    <ListItem key={user.id} divider button onClick={() => handleSelectUser(user.id)}>
                        <ListItemAvatar>
                            <Avatar src={user.imageUrl || 'https://via.placeholder.com/150.png?text=Profile'} alt={user.name} />
                        </ListItemAvatar>
                        <ListItemText primary={user.name} secondary={user.email + " - " + user.bio} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleSelectUser(user.id)}>
                                <MessageIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            {selectedUserId && <AdminMessages userId={selectedUserId} />}
        </Container>
        </AuthContextProvider>
    );
}

export default UserList;
