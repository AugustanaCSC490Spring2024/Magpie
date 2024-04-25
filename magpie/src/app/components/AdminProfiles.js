import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, TextField, Button, Typography, Avatar, IconButton, Container, Paper,
  List, ListItem, ListItemAvatar, ListItemText, Snackbar, Alert, useTheme, ThemeProvider, createTheme
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { UserAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import AdminMessages from '../components/adminmessages';

function AdminProfile() {
  const { user, logOut, isAdmin } = UserAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !isAdmin) {
      router.push('/'); 
    }
  }, [user, isAdmin, router]);
  
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150.png?text=Profile');
  const [bio, setBio] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  const theme = useTheme();
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    },
  }), []);

  const themeConfig = createTheme({
    palette: {
      mode,
      primary: { main: mode === 'light' ? '#1122ff' : '#90caf9' },
      secondary: { main: mode === 'light' ? '#eac235' : '#fbc02d' },
      background: { default: mode === 'light' ? '#fff122' : '#212121' },
    },
  });

  useEffect(() => {
    if (user?.uid) {
      const fetchMessages = () => {
        const messagesRef = collection(db, 'adminMessages');
        const q = query(messagesRef, where("userId", "==", user.uid));
        onSnapshot(q, (snapshot) => {
          const userMessages = {};
          snapshot.docs.forEach(doc => {
            const data = doc.data();
            const otherUserId = data.senderId === user.uid ? data.receiverId : data.senderId;
            if (!userMessages[otherUserId]) {
              userMessages[otherUserId] = { messages: [], senderName: data.senderName, lastMessage: data.text };
            }
            userMessages[otherUserId].messages.push({ ...data, id: doc.id });
          });
          setMessages(Object.values(userMessages).map(user => ({
            userId: user.messages[0].senderId,
            senderName: user.senderName,
            lastMessage: user.messages[user.messages.length - 1].text
          })));
        });
      };
      fetchMessages();
    }
  }, [user]);

  useEffect(() => {
    if (user?.uid) {
      const docRef = doc(db, 'userProfiles', user.uid);
      getDoc(docRef).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileImage(data.imageUrl || 'https://via.placeholder.com/150.png?text=Profile');
          setBio(data.bio || '');
        } else {
          setDoc(docRef, {
            name: user.displayName,
            email: user.email,
            imageUrl: profileImage,
            bio: ''
          });
        }
      });
    }
  }, [user]);

  const handleAdminSelect = (userId) => {
    setSelectedUserId(userId);
    setConversation(messages.find(msg => msg.userId === userId)?.messages || []);
  };

  const handleBackToDashboard = () => {
    if (!profileSaved) {
      setOpenSnackbar(true);
      setSnackbarMessage("Please save your profile before accessing the dashboard.");
    } else {
      router.push('/AdminPage');
    }
  };

  const saveProfile = async () => {
    if (user?.uid) {
      const userProfile = {
        name: user.displayName,
        email: user.email,
        imageUrl: profileImage,
        bio: bio
      };
      await setDoc(doc(db, 'userProfiles', user.uid), userProfile, { merge: true });
      setProfileSaved(true);
      setSnackbarMessage('Profile updated successfully!');
      setOpenSnackbar(true);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && user?.uid) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setProfileImage(imageUrl);
        setDoc(doc(db, 'userProfiles', user.uid), { imageUrl }, { merge: true });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <ThemeProvider theme={themeConfig}>
      <Container maxWidth="lg" sx={{ minHeight: '100vh', pt: 3, display: 'flex', flexDirection: 'row', backgroundColor: theme.palette.background.default }}>
        <Box flex={inboxOpen ? 3 : 1} sx={{ transition: 'all 0.3s ease' }}>
          <Paper elevation={3} sx={{
              mt: 4,
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              background: theme.palette.primary.main,
          }}>
            <Typography variant="h4" sx={{ color: theme.palette.background.default, marginBottom: '20px' }}>Welcome, {user?.displayName || 'Guest'}!</Typography>
            <Avatar src={profileImage} sx={{ width: 150, height: 150, mb: 2 }} />
            <IconButton color="primary" component="label" sx={{ mb: 2 }}>
              <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
              <PhotoCamera sx={{ fontSize: 48 }} />
            </IconButton>
            <TextField label="Add Bio" multiline rows={4} variant="filled" value={bio} onChange={e => setBio(e.target.value)} fullWidth sx={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 1 }} />
            <Button variant="contained" color="primary" onClick={saveProfile} sx={{ mt: 2 }}>Save Bio</Button>
            <Button variant="outlined" onClick={handleBackToDashboard} sx={{ mt: 1, color: theme.palette.background.default, borderColor: theme.palette.background.default }}>
              Back to Dashboard
            </Button>
          </Paper>
        </Box>
        {inboxOpen && (
          <Box flex={1} sx={{ overflow: 'auto', maxHeight: '90vh', width: '100%', bgcolor: 'background.paper' }}>
            <List>
              {messages.map(msg => (
                <ListItem key={msg.userId} button onClick={() => handleAdminSelect(msg.userId)}>
                  <ListItemAvatar>
                    <Avatar>{msg.senderName.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={`${msg.senderName}`} secondary={msg.lastMessage} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        <Button variant="contained" color="primary" onClick={() => setInboxOpen(!inboxOpen)} sx={{ position: 'fixed', bottom: 20, right: 20 }}>
          {inboxOpen ? 'Close Inbox' : 'Open Inbox'}
        </Button>
        {selectedUserId && <AdminMessages userId={selectedUserId} messages={conversation} onClose={() => setSelectedUserId(null)} />}
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
          <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default AdminProfile;
