import { useState, useEffect } from 'react';
import { Container, Grid, Typography, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useRouter } from 'next/navigation';
import { UserAuth } from '../context/AuthContext';
import { db } from '../firebase'; // Import your Firestore database from where it's initialized
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Profilepage = () => {
  const router = useRouter();
  const { user } = UserAuth();
  // Initialize profileImage state with placeholder image
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150x150.png?text=Profile');

  useEffect(() => {
    // Fetch the profile image URL from Firestore when the component loads
    const fetchProfileImage = async () => {
      if (user?.uid) {
        const docRef = doc(db, 'userProfiles', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileImage(docSnap.data().imageUrl);
        } else {
          // If there's no document for the user, keep or set the placeholder image
          setProfileImage('https://via.placeholder.com/150x150.png?text=Profile');
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
        // Store the image URL in Firestore
        await setDoc(doc(db, 'userProfiles', user.uid), { imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-page">
      {user && (
        <Container maxWidth='xl'>
          <div>
            <h1>Welcome to your profile page, {user.displayName}!</h1>
            <Grid container spacing={4} style={{ paddingLeft: 140, paddingRight: 10, paddingBottom: 80, paddingTop: 30 }}>
              <Grid item xs={12} style={{ textAlign: 'center', alignItems: 'center', paddingRight: '15rem', position: 'relative' }}>
                {/* Use the profileImage state for the image source */}
                <img src={profileImage} style={{ width: '150px', height: '150px', borderRadius: '80px' }} alt="Profile" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  id="profile-image-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="profile-image-upload">
                  <IconButton
                    color="primary"
                    component="span"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 560,
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      transform: 'translate(50%, 50%)',
                      height: '50px',
                      width: '50px',
                    }}
                  >
                    <AddCircleIcon style={{ fontSize: '3rem' }} />
                  </IconButton>
                </label>
              </Grid>
              <Grid item xs={12} style={{ textAlign: 'center', paddingRight: '15rem' }}>
                <Typography variant={'h4'}>{user.displayName}</Typography>
              </Grid>
            </Grid>
          </div>
        </Container>
      )}
    </div>
  );
};

export default Profilepage;
