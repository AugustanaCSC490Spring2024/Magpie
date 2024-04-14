import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, IconButton, Button, styled, Snackbar, Alert } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { UserAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation'; 

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
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user?.uid) {
        const docRef = doc(db, 'userProfiles', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileImage(data.imageUrl || 'https://via.placeholder.com/150.png?text=Profile');
          setBio(data.bio || '');
        } else {
          await setDoc(docRef, {
            name: user.displayName,
            email: user.email,
            imageUrl: profileImage,
            bio: ''
          });
        }
      }
    };

    fetchProfileData();
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

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file && user?.uid) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageUrl = e.target.result;
        setProfileImage(imageUrl);
        await setDoc(doc(db, 'userProfiles', user.uid), { imageUrl }, { merge: true });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <InteractiveBackground id="interactiveBackground" />
      <Box sx={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90vw',
        maxWidth: '600px',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '15px',
        padding: '20px',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }}>
        <Typography variant="h4" sx={{ color: '#000', marginBottom: '20px' }}>
          Welcome, {user?.displayName || 'Guest'}!
        </Typography>
        <Box sx={{
          marginBottom: '20px',
          borderRadius: '40%',
          overflow: 'hidden',
          '&:hover': {
            transform: 'scale(1.05)',
            transition: 'transform 0.5s ease',
          }
        }}>
          <img src={profileImage} alt="Profile" style={{ width: '150px', height: '150px' }} />
        </Box>
        <input type="file" accept="image/*" onChange={handleImageUpload} id="profile-image-upload" style={{ display: 'none' }} />
        <label htmlFor="profile-image-upload">
          <IconButton color="primary" component="span" sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.5)' },
            borderRadius: '50%',
            padding: '10px',
            position: 'absolute',
            top: '38%',
            left: '55%',
          }}>
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
        <Button
          variant="contained"
          color="primary"
          onClick={saveProfile}
          sx={{ mt: 2, display: 'inline-block', marginLeft: '10px' }}
        >
          Save Bio
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/dashboard')}
          sx={{ mt: 2, display: 'inline-block', marginLeft: '10px' }}
        >
          Dashboard
        </Button>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProfilePage;
