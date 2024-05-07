import { Container, Grid, Button, Card, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';




const UserProfileCard = ({userProfile, matchingScores}) => {
    
    return (
    <Card style={{
        textAlign: 'center',
        padding: '2.4rem',
        maxWidth: '25rem',
        borderRadius: '15px',
        minHeight: '25rem',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s',
        backgroundImage: 'linear-gradient(to bottom right, #ffffff, #f0f0f0)',
        border: '1px solid #e0e0e0',
        ':hover': {
          transform: 'scale(1.05)'
        }
      }}>
        <Grid container spacing={2} style={{  }}>
          <Grid item xs={12}>
            <img src={userProfile.imageUrl || `https://via.placeholder.com/150x150.png?text=No+Image`} alt={`User ${userProfile.name}`} style={{ width: '150px', height: '150px', borderRadius: '15px', margin: 'auto' }} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" sx={{fontFamily: 'poppins, sans-serif'}}>{userProfile.name || "Name not available"}</Typography>
          </Grid>

          <Grid item xs={12} align="center">
           <Typography variant="h7">{userProfile.email || "Email not available"}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>Match: {matchingScores[userProfile.id] ? `${matchingScores[userProfile.id].toFixed(1)}%` : "Calculating..."}</Typography>

          </Grid>

        </Grid>
      </Card>
    )
}

export default UserProfileCard;