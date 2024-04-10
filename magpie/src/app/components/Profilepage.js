import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, IconButton, Button, styled } from '@mui/material';
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
  background: 'radial-gradient(circle, #123312, #b312ff, #ffddee)',
  clipPath: 'circle(50% at center)',
  transition: 'clip-path 0.8s ease',
  zIndex: -1, 
}));


const ProfilePage = () => {
  const { user } = UserAuth();
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150.png?text=Profile');
  const router = useRouter();

  const navigateToDashboard = () => {
    router.push('/dashboard'); 
  };

  // Mouse move effect for background
  useEffect(() => {
    const updateBackground = (e) => {
      const { clientX, clientY } = e;
      const xPercent = clientX / window.innerWidth * 100;
      const yPercent = clientY / window.innerHeight * 100;
      if (document.querySelector('#interactiveBackground')) {
        document.querySelector('#interactiveBackground').style.clipPath = `circle(50% at ${xPercent}% ${yPercent}%)`;
      }
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
            top: '60%',
            left: '50%',

          }}>
            <AddCircleOutlineIcon sx={{ color: '#FFF', fontSize: 30 }} />
          </IconButton>
        </label>
        <Button
          variant="contained"
          color="primary"
          onClick={navigateToDashboard}
          sx={{ mt: 2 }}
        >
          Dashboard
        </Button>
      </Box>
    </>
  );
};

export default ProfilePage;



