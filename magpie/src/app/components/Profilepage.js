import React, { useState, useEffect } from 'react';
import { Typography, Box, TextField, IconButton, Button, styled, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { UserAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import AdminMessages from '../components/adminmessages'; 

const InteractiveBackground = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'radial-gradient(circle, #112233, #3344ff, #cceeff)',
  clipPath: 'circle(80% at center)',
  transition: 'clip-path 0.2s ease',
  zIndex: -1,
}));

const ProfilePage = () => {
  const { user } = UserAuth();
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150.png?text=Profile');
  const [bio, setBio] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [inboxOpen, setInboxOpen] = useState(false);
  const router = useRouter();
  const [conversation, setConversation] = useState([]);


  useEffect(() => {
    if (user?.uid) {
        const fetchMessages = () => {
            const messagesRef = collection(db, 'adminMessages');
            // Query to fetch messages where the current user is involved and isAdmin is true
            const q = query(messagesRef, where("userId", "==", user.uid), where("isAdmin", "==", true));
            onSnapshot(q, (snapshot) => {
                const userMessages = {};
                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    // Store messages by senderId for initial listing
                    if (!userMessages[data.senderId]) {
                        userMessages[data.senderId] = { messages: [], senderName: data.senderName, lastMessage: data.text };
                    }
                    userMessages[data.senderId].messages.push({ ...data, id: doc.id });
                });
                // Extract minimal data for the list view
                setMessages(Object.values(userMessages).map(user => ({
                    senderId: user.messages[0].senderId,
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

  const saveProfile = async () => {
    if (user?.uid) {
      const userProfile = {
        name: user.displayName,
        email: user.email,
        imageUrl: profileImage,
        bio
      };
      await setDoc(doc(db, 'userProfiles', user.uid), userProfile, { merge: true });
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

  const handleAdminSelect = (adminId) => {
    setSelectedUserId(adminId);
    if (user?.uid && adminId) {
        const messagesRef = collection(db, 'adminMessages');
        // This query should fetch all messages where the current user and the admin are involved, either as sender or receiver
        const q = query(messagesRef, where("userId", "==", user.uid), where("senderId", "==", adminId));
        onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setConversation(messages); // Set fetched messages into the conversation state
        });
    }
};



  return (
    <>
      <InteractiveBackground />
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90vw',
        maxWidth: '1000px',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '15px',
        padding: '20px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }}>
        {/* Profile Info Section */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
          <Typography variant="h4" sx={{ marginBottom: '20px' }}>
            Welcome, {user?.displayName || 'Guest'}!
          </Typography>
          <Box sx={{ marginBottom: '20px', borderRadius: '40%', overflow: 'hidden' }}>
            <img src={profileImage} alt="Profile" style={{ width: '150px', height: '150px' }} />
          </Box>
          <input type="file" accept="image/*" onChange={handleImageUpload} id="profile-image-upload" style={{ display: 'none' }} />
          <label htmlFor="profile-image-upload">
            <IconButton color="primary" component="span" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
              <AddCircleOutlineIcon sx={{ color: '#FFF', fontSize: 30 }} />
            </IconButton>
          </label>
          <TextField
            label="Add Bio"
            multiline
            rows={4}
            variant="filled"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            fullWidth
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 1 }}
          />
          <Button variant="contained" color="primary" onClick={saveProfile} sx={{ mt: 2 }}>
            Save Bio
          </Button>
          <Button variant="contained" color="primary" onClick={() => router.push('/dashboard')} sx={{ mt: 2 }}>
            Dashboard
          </Button>
        </Box>
        {inboxOpen && (
    <Box sx={{ flex: 1, overflow: 'auto', maxHeight: '90vh', marginTop: '20px' }}>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {messages.map((msg) => (
                <ListItem key={msg.senderId} button onClick={() => handleAdminSelect(msg.senderId)}>
                    <ListItemAvatar>
                        <Avatar>{msg.senderName.charAt(0)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={`Chat with ${msg.senderName}`} secondary={msg.lastMessage} />
                </ListItem>
            ))}
        </List>
    </Box>
)}
{selectedUserId && (
    <Box sx={{ position: 'absolute', bottom: 20, width: '100%', paddingTop: '20px' }}>
        <AdminMessages userId={selectedUserId} messages={conversation} onClose={() => setSelectedUserId(null)} />
    </Box>
)}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setInboxOpen(!inboxOpen)}
          sx={{ position: 'fixed', bottom: 20, right: 20 }}
        >
          {inboxOpen ? 'Close Inbox' : 'Open Inbox'}
        </Button>
      </Box>
    </>
  );
};

export default ProfilePage;