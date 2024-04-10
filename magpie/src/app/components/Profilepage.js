import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, IconButton, styled } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Slightly different icon for a fresh look
import { UserAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const InteractiveBackground = styled('div')(({ theme }) => ({
  position: 'fixed', // Changed to 'fixed' to ensure it's always in the background
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'radial-gradient(circle, #123312, #b312ff, #ffddee)',
  clipPath: 'circle(50% at center)',
  transition: 'clip-path 0.8s ease',
  zIndex: -1, // Ensure this stays behind other content
}));


const ProfilePage = () => {
  const { user } = UserAuth();
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150.png?text=Profile');

  // Mouse move effect for background
  useEffect(() => {
    const updateBackground = (e) => {
      const { clientX, clientY } = e;
      const xPercent = clientX / window.innerWidth * 100;
      const yPercent = clientY / window.innerHeight * 100;
      document.querySelector('#interactiveBackground').style.clipPath = `circle(50% at ${xPercent}% ${yPercent}%)`;
    };

    window.addEventListener('mousemove', updateBackground);
    return () => window.removeEventListener('mousemove', updateBackground);
  }, []);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (user?.uid) {
        const docRef = doc(db, 'userProfiles', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileImage(docSnap.data().imageUrl);
        }
      }
    };
  
    fetchProfileImage();
  }, [user]);
  
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file && user?.uid) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageUrl = e.target.result;
        setProfileImage(imageUrl);
        await setDoc(doc(db, 'userProfiles', user.uid), { imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <InteractiveBackground id="interactiveBackground" />
      <Box sx={{
        position: 'absolute',
        top: '25%',
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
          borderRadius: '50%',
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
          }}>
            <AddCircleOutlineIcon sx={{ color: '#FFF', fontSize: 30 }} />
          </IconButton>
        </label>
      </Box>
    </>
  );
};

export default ProfilePage;



