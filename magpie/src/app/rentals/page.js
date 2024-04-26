"use client";
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, TextField, Button, Card, CardContent, Grid, CardActions,
  InputAdornment, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import Email from '@mui/icons-material/Email';
import { UserAuth } from '../context/AuthContext';

function Listing() {
    const { user } = UserAuth();
    const [listings, setListings] = useState([]);
    const [formData, setFormData] = useState({
        address: '',
        rent: '',
        numRoommates: '',
        notes: '',
        imageUrl: ''
    });
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchListings = async () => {
          const querySnapshot = await getDocs(collection(db, "listings"));
          setListings(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };

        fetchListings();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (user) {
          await addDoc(collection(db, "listings"), {
            ...formData,
            userId: user.uid,
            userEmail: user.email
          });
          alert("Listing created successfully!");
          setFormData({ address: '', rent: '', numRoommates: '', notes: '', imageUrl: '' });
          setOpen(false);
        } else {
          alert("You must be logged in to create a listing.");
        }
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Container maxWidth="md" sx={{ mt: 12, backgroundColor: '#f0f0f0', py: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333', textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
            Housing Listings
          </Typography>
          <Button variant="contained" color="primary" onClick={handleOpen} sx={{
            mb: 2, 
            backgroundColor: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', 
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            '&:hover': {
              backgroundColor: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)'
            }
          }}>
            Create New Listing
          </Button>
          <Dialog open={open} onClose={handleClose} sx={{ '& .MuiDialog-paper': { boxShadow: '0 4px 20px 2px rgba(0, 0, 0, .15)' }}}>
            <DialogTitle>Create a New Listing</DialogTitle>
            <form onSubmit={handleSubmit}>
              <DialogContent>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  margin="normal"
                  required
                  sx={{ input: { color: 'black' } }}
                />
                <TextField
                  fullWidth
                  label="Rent"
                  name="rent"
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  value={formData.rent}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Number of Roommates Needed"
                  name="numRoommates"
                  type="number"
                  value={formData.numRoommates}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={4}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Create Listing
                </Button>
              </DialogActions>
            </form>
          </Dialog>
          <Grid container spacing={2} sx={{ mt: 4 }}>
            {listings.map(listing => (
              <Grid item xs={12} md={6} key={listing.id}>
                <Card sx={{
                  boxShadow: '0px 8px 20px rgba(0,0,0,0.12)',
                  '&:hover': {
                    boxShadow: '0px 10px 25px rgba(0,0,0,0.2)'
                  }
                }}>
                  <CardContent>
                    <Typography variant="h5" sx={{ color: '#333', fontWeight: 'medium' }}>{listing.address}</Typography>
                    <Typography variant="body1" sx={{ color: '#555' }}>${listing.rent} / month</Typography>
                    <Typography variant="body2" sx={{ color: '#777' }}>{listing.numRoommates} roommates needed</Typography>
                    <Typography variant="body2" sx={{ color: '#999' }}>{listing.notes}</Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton
                      color="primary"
                      component="span"
                      onClick={() => window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${listing.userEmail}`, '_blank')}
                      sx={{ '&:hover': { backgroundColor: 'rgba(255, 235, 59, 0.2)' } }}
                    >
                    <Email /> 
                    </IconButton>
                  </CardActions
                  ></Card>
              </Grid>
            ))}
          </Grid>
        </Container>
    );
}

export default Listing;
