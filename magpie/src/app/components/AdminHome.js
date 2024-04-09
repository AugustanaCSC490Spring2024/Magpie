import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

function AdminDashboard() {
  const router = useRouter();

  const navigateToCustomizeQuestionnaire = () => {
    router.push('/questionaire'); // Adjust the path as necessary
  };

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" marginTop={10}>
        <Typography variant="h4" gutterBottom>Welcome to Admin Dashboard</Typography>
        <Button variant="contained" color="primary" onClick={navigateToCustomizeQuestionnaire}>
          Customize Questionnaire
        </Button>
      </Box>
    </Container>
  );
}

export default AdminDashboard;
