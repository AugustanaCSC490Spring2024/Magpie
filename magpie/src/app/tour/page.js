"use client";
import React from 'react';
import { Container, Typography, Button, Grid } from '@mui/material';
import { motion } from 'framer-motion';

const TourHallsPage = () => {
  const halls = [
    { name: "Seminary Hall", url: "https://example.com/seminary" },
    { name: "Andreen Hall", url: "https://matterport.com/discover/space/47DZGWAqyCu" },
    { name: "Swanson Commons", url: "https://matterport.com/discover/space/xsyncVsCagZ" },
    { name: "Erickson Hall", url: "https://example.com/erickson" },
    { name: "Westerlin Hall", url: "https://matterport.com/discover/space/d6s1udvDxjo" },
    { name: "Naeseth Townhouses", url: "https://example.com/naeseth" },
    { name: "Parkander", url: "https://matterport.com/discover/space/mkmTUsfHCLU" },
    { name: "Arbaugh", url: "https://example.com/arbaugh" }
  ];

  const itemVariants = {
    initial: {
      scale: 1,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    },
    hover: {
      scale: 1.1,
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)'
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '40px' }}>
      <Typography variant="h3" style={{ fontWeight: 'bold', marginBottom: '30px', marginTop: '100px', textAlign: 'center' }}>
        Tour These Residential Halls
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {halls.map((hall, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} style={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div
              variants={itemVariants}
              initial="initial"
              whileHover="hover"
              style={{
                textAlign: 'center',
                padding: '20px',
                borderRadius: '10px',
                maxWidth: '300px'
              }}
            >
              <Typography variant="h5" style={{ marginBottom: '20px' }}>{hall.name}</Typography>
              <Button variant="contained" color="primary" href={hall.url} target="_blank" rel="noopener noreferrer">
                Take a Tour
              </Button>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TourHallsPage;
