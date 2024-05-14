"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { Container, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, TextField } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import AdminMessages from '../components/adminmessages';
import { AuthContextProvider } from "../context/AuthContext";
import { adminEmails } from "../context/AuthContext";

function UserList() {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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
        setSelectedUserId(null);  
    };

    return (
        <AuthContextProvider>
            <Container maxWidth="sm" sx={{
                position: 'fixed',
                left: 30,
                top: 30,
                width: '80vw',
                height: '200vh',
                overflowY: 'auto',
                zIndex: 1200
            }}>
                <Typography variant="h3" sx={{ my: 2 }}>User List</Typography>
                <TextField
                    fullWidth
                    label="Search by Name"
                    variant="outlined"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <List>
                    {users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase())).map(user => (
                        <ListItem key={user.id} divider button onClick={() => handleSelectUser(user.id)}>
                            <ListItemAvatar>
                                <Avatar src={user.imageUrl || 'https://via.placeholder.com/150.png?text=Profile'} alt={user.name} />
                            </ListItemAvatar>
                            <ListItemText primary={user.name} secondary={user.email} />
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
