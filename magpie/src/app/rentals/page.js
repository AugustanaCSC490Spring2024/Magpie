"use client";
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, TextField, Button, Card, CardContent, Grid, CardActions,
  InputAdornment, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Email from '@mui/icons-material/Email';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import { UserAuth } from '../context/AuthContext';
import axios from 'axios';


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
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

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

    if (!user) {
        alert("You must be logged in to create or update a listing.");
        return;
    }

    const apiKey = '79f9041fba124e94912b720262d03976'; 
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(formData.address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.results && response.data.results.length > 0) {
            // If the address is valid and results are found, proceed with form submission
            if (editMode) {
                await updateDoc(doc(db, "listings", editId), {
                  ...formData,
                  userId: user.uid,
                  userEmail: user.email
              });
              const updatedListings = listings.map(listing => listing.id === editId ? { ...listing, ...formData } : listing);
              setListings(updatedListings);
              setEditMode(false);
              setEditId(null);
                
                alert("Listing updated successfully!");
            } else {
              const newDoc = await addDoc(collection(db, "listings"), {
                ...formData,
                userId: user.uid,
                userEmail: user.email
            });
            alert("Listing created successfully!");
            const newListings = [{ id: newDoc.id, ...formData }, ...listings];
            setListings(newListings);
            }
            setFormData({ address: '', rent: '', numRoommates: '', notes: '', imageUrl: '' });
            setOpen(false);
        } else {
            // Here is the case where the address is not found or invalid
            alert("The address entered could not be verified. Please check the address and try again.");
        }
    } catch (error) {
        console.error("Failed to validate address: ", error);
        alert("Error validating address. Please try again.");
    }
};


    const handleOpen = (listing = null) => {
        if (listing) {
            setFormData({
                address: listing.address,
                rent: listing.rent,
                numRoommates: listing.numRoommates,
                notes: listing.notes,
                imageUrl: listing.imageUrl
            });
            setEditId(listing.id);
            setEditMode(true);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditMode(false);
        setEditId(null);
        setFormData({ address: '', rent: '', numRoommates: '', notes: '', imageUrl: '' });
    };

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "listings", id));
        alert("Listing deleted successfully!");
        const filteredListings = listings.filter(listing => listing.id !== id);
        setListings(filteredList);

    };

    return (
        <Container maxWidth="md" sx={{ mt: 12, backgroundColor: '#f0f0f0', py: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333', textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
                Housing Listings
            </Typography>
            <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{
                mb: 2,
                backgroundColor: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                '&:hover': {
                    backgroundColor: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)'
                }
            }}>
                Create New Listing
            </Button>
            <Dialog open={open} onClose={handleClose} sx={{ '& .MuiDialog-paper': { boxShadow: '0 4px 20px 2px rgba(0, 0, 0, .15)' } }}>
                <DialogTitle>{editMode ? "Edit Listing" : "Create a New Listing"}</DialogTitle>
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
                            {editMode ? "Update Listing" : "Create Listing"}
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
                                <Typography variant="h5" sx={{ color: '#333', fontWeight: 'medium' }}>{listing.address}</Typography
                                ><Typography variant="body1" sx={{ color: '#555' }}>${listing.rent} / month</Typography
                                ><Typography variant="body2" sx={{ color: '#777' }}>{listing.numRoommates} roommates needed</Typography
                                ><Typography variant="body2" sx={{ color: '#999' }}>{listing.notes}</Typography>
                            </CardContent>
                            <CardActions>
                                {user.uid === listing.userId ? (
                                    <>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleOpen(listing)}
                                            sx={{ '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.2)' } }}
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            color="secondary"
                                            onClick={() => handleDelete(listing.id)}
                                            sx={{ '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.2)' } }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </>
                                ) : (
                                    <IconButton
                                        color="primary"
                                        component="span"
                                        onClick={() => window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${listing.userEmail}`, '_blank')}
                                        sx={{ '&:hover': { backgroundColor: 'rgba(255, 235, 59, 0.2)' } }}
                                    >
                                        <Email />
                                    </IconButton>
                                )}
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Listing;
