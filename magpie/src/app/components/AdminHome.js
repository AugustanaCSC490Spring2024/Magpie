// In AdminDashboard.js

import { Container, Typography, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation'; // Ensure this is 'next/router', not 'next/navigation'

function AdminDashboard() {
  const router = useRouter();

  const navigateToCustomizeQuestionnaire = () => {
    router.push('/questionaire');
  };

  const navigateToUserList = () => {
    router.push('/userlist'); // This will be the route for showing all users
  };

  const navigateToMessages = () => {
    router.push('/adminmessages'); // This will be the route for messaging interface
  };

  

  const buttonStyle = {
    borderRadius: '30px',
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    outline: 'none',
    backgroundColor: '#3f51b5', // Set the background color for both buttons
    color: '#fff', // Set the text color for both buttons
    '&:hover': {
      backgroundColor: '#ffeb3b', // Change the background color on hover
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Box textAlign="center" marginTop={10}>
        <Typography variant="h4" gutterBottom>Welcome to Admin Dashboard</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={navigateToCustomizeQuestionnaire}
          sx={buttonStyle}
          style={{ marginRight: '10px' }} 
        >
          Customize Questionnaire
        </Button>
        <Button 
          variant="contained" 
          color="primary" // Change color to "primary"
          onClick={navigateToUserList} 
          sx={buttonStyle}
        >
          All Users
        </Button>
      </Box>
    </Container>
  );
  
}

export default AdminDashboard;
