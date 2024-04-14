// In AdminDashboard.js

import { Container, Typography, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation'; // Ensure this is 'next/router', not 'next/navigation'

function AdminDashboard() {
  const router = useRouter();

  const navigateToCustomizeQuestionnaire = () => {
    router.push('/questionnaire');
  };

  const navigateToUserList = () => {
    router.push('/userlist'); // This will be the route for showing all users
  };

  const navigateToMessages = () => {
    router.push('/adminmessages'); // This will be the route for messaging interface
  };

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" marginTop={10}>
        <Typography variant="h4" gutterBottom>Welcome to Admin Dashboard</Typography>
        <Button variant="contained" color="primary" onClick={navigateToCustomizeQuestionnaire}>
          Customize Questionnaire
        </Button>
        <Button variant="contained" color="secondary" onClick={navigateToUserList} sx={{ mt: 2 }}>
          All Users
        </Button>
      </Box>
    </Container>
  );
}

export default AdminDashboard;
