"use client"
import React, { useEffect, useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import { db } from '../firebase'; // Adjust this path to your Firebase configuration file
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Avatar,
  Rating,
  Paper,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function ExplorePage() {
  const [reviews, setReviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(2.5);

  useEffect(() => {
    fetchReviews();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    // Fetch the current user data; replace 'currentUserId' with the actual logged-in user ID
    const userSnapshot = await getDocs(collection(db, 'userProfiles'));
    const users = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const currentUserData = users.find(user => user.userId === 'currentUserId'); // Adjust 'currentUserId'
    setCurrentUser(currentUserData);
  };

  const fetchReviews = async () => {
    const reviewsSnapshot = await getDocs(collection(db, 'reviews'));
    const loadedReviews = reviewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setReviews(loadedReviews);
  };

  const handlePostReview = async () => {
    if (!newComment.trim()) return;
    await addDoc(collection(db, 'reviews'), {
      userName: currentUser.name,
      comment: newComment,
      rating: newRating,
      userId: currentUser.userId,
      imageUrl: currentUser.imageUrl,
    });
    setNewComment('');
    setNewRating(2.5);
    fetchReviews();
  };

  const handleDeleteReview = async (reviewId) => {
    await deleteDoc(doc(db, 'reviews', reviewId));
    fetchReviews();
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Explore Reviews
      </Typography>
      <Box component="form" noValidate autoComplete="off" sx={{ mb: 5 }}>
        <Rating
          name="simple-controlled"
          value={newRating}
          onChange={(event, newValue) => {
            setNewRating(newValue);
          }}
        />
        <TextField
          label="Leave a comment"
          fullWidth
          multiline
          rows={4}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handlePostReview}>
          Comment
        </Button>
      </Box>
      {reviews.map((review) => (
        <Paper key={review.id} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
          <Avatar src={review.imageUrl} sx={{ mr: 2 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">{review.userName}</Typography>
            <Rating name="read-only" value={review.rating} readOnly />
            <Typography variant="body2">{review.comment}</Typography>
          </Box>
          {currentUser && currentUser.userId === review.userId && (
            <IconButton onClick={() => handleDeleteReview(review.id)}>
              <DeleteIcon />
            </IconButton>
          )}
        </Paper>
      ))}
    </Container>
  );
}

export default ExplorePage;
