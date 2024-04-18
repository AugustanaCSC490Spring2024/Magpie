import { Container, Typography, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation'; 

function AdminDashboard() {
  const router = useRouter();

  const navigateToCustomizeQuestionnaire = () => {
    router.push('/questionaire');
  };

  const navigateToUserList = () => {
    router.push('/userlist');
  };

  const navigateToProfile = () => {
    router.push('/adminProfile'); 
  };
  const navigateToHousingAgreement = () => {
    router.push('/hsAgree'); 
  };

  const buttonStyle = {
    borderRadius: '30px',
    padding: '12px 24px',
    margin: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    outline: 'none',
    backgroundColor: '#3f51b5',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#ffeb3b',
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Box textAlign="center" marginTop={10}>
        <Typography variant="h4" gutterBottom>Welcome to Admin Dashboard</Typography>
        <Button variant="contained" color="primary" onClick={navigateToCustomizeQuestionnaire} sx={buttonStyle} style={{ marginRight: '10px' }}>Customize Questionnaire</Button>
        <Button variant="contained" color="primary" onClick={navigateToUserList} sx={buttonStyle} style={{ marginRight: '10px' }}>All Users</Button>
        <Button variant="contained" color="primary" onClick={navigateToProfile} sx={buttonStyle}>Profile</Button>
        <Button variant="contained" color="primary" onClick={navigateToHousingAgreement} sx={buttonStyle}>Housing Agreement</Button>

      </Box>
    </Container>
  );
  
}

export default AdminDashboard;
