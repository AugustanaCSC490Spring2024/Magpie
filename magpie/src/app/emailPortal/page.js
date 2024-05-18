"use client";
import React, { useState, useEffect } from 'react';
import { Container, Button, Typography, Grid, Paper } from '@mui/material';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { styled } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';

const createMailToLink = (emails) => {
    const emailString = emails.join(',');
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${emailString}`;
};

const StyledContainer = styled(Container)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    color: '#fff',
});

const StyledButton = styled(Button)({
    padding: '10px 20px',
    borderRadius: '30px',
    fontSize: '16px',
    fontWeight: 'bold',
    textTransform: 'none',
    backgroundColor: '#fff',
    color: '#333',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        backgroundColor: '#333',
        color: '#fff',
        transform: 'scale(1.05)',
    },
    '&:active': {
        boxShadow: 'none',
        transform: 'scale(0.95)',
    },
});

const Title = styled(Typography)({
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
});

const Description = styled(Typography)({
    fontSize: '14px',
    marginBottom: '20px',
});

function EmailPortal() {
    const [allUsers, setAllUsers] = useState([]);
    const [matchedUsers, setMatchedUsers] = useState([]);
    const [unmatchedUsers, setUnmatchedUsers] = useState([]);
    const [reportedUsers, setReportedUsers] = useState([]);
    const [completedOnboardingUsers, setCompletedOnboardingUsers] = useState([]);
    const [notCompletedOnboardingUsers, setNotCompletedOnboardingUsers] = useState([]);
    const db = getFirestore();
    const auth = getAuth();
    const currentUserId = auth.currentUser?.uid;

    useEffect(() => {
        const fetchUsers = async () => {
            const usersSnapshot = await getDocs(collection(db, 'userProfiles'));
            const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAllUsers(users.filter(user => user.id !== currentUserId));

            const matchesSnapshot = await getDocs(query(collection(db, 'matchRequests'), where('status', '==', 'accepted')));
            const matchedUserIds = new Set();
            matchesSnapshot.forEach(doc => {
                const [user1, user2] = doc.id.split('_');
                matchedUserIds.add(user1);
                matchedUserIds.add(user2);
            });
            setMatchedUsers(users.filter(user => matchedUserIds.has(user.id) && user.id !== currentUserId));

            const unmatchedSnapshot = await getDocs(collection(db, 'matchRequests'));
            const unmatchedUserIds = new Set();
            const pendingUserIds = new Set();
            unmatchedSnapshot.forEach(doc => {
                const { status } = doc.data();
                const [user1, user2] = doc.id.split('_');
                if (status === 'pending') {
                    pendingUserIds.add(user1);
                    pendingUserIds.add(user2);
                }
            });
            setUnmatchedUsers(users.filter(user => !matchedUserIds.has(user.id) && (pendingUserIds.has(user.id) || !unmatchedUserIds.has(user.id)) && user.id !== currentUserId));

            const reportsSnapshot = await getDocs(collection(db, 'userReports'));
            const reportedUserIds = new Set(reportsSnapshot.docs.map(doc => doc.id));
            setReportedUsers(users.filter(user => reportedUserIds.has(user.id) && user.id !== currentUserId));

            const onboardingSnapshot = await getDocs(collection(db, 'userResponses'));
            const completedOnboardingUserIds = new Set(onboardingSnapshot.docs.map(doc => doc.id));
            setCompletedOnboardingUsers(users.filter(user => completedOnboardingUserIds.has(user.id) && user.id !== currentUserId));

            setNotCompletedOnboardingUsers(users.filter(user => !completedOnboardingUserIds.has(user.id) && user.id !== currentUserId));
        };

        fetchUsers();
    }, [db, currentUserId]);

    const handleEmailClick = (emails) => {
        window.open(createMailToLink(emails), '_blank');
    };

    return (
        <div style={{backgroundImage: 'linear-gradient(55deg, #3366cc, #ffd966'}}>
            <StyledContainer component="main" maxWidth="lg">
                <Typography variant="h3" component="h1" style={{ marginBottom: '40px', fontWeight: 'bold', color: 'black' }}>
                    Email Portal
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper style={{ padding: '20px', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <Title>Email All Users</Title>
                            <Description>Send an email to all registered users.</Description>
                            <StyledButton
                                variant="contained"
                                onClick={() => handleEmailClick(allUsers.map(user => user.email))}
                            >
                                <EmailIcon />
                            </StyledButton>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper style={{ padding: '20px', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <Title>Email Matched Users</Title>
                            <Description>Send an email to users who have been matched.</Description>
                            <StyledButton
                                variant="contained"
                                onClick={() => handleEmailClick(matchedUsers.map(user => user.email))}
                            >
                                <EmailIcon />
                            </StyledButton>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper style={{ padding: '20px', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <Title>Email Unmatched Users</Title>
                            <Description>Send an email to users who are currently unmatched.</Description>
                            <StyledButton
                                variant="contained"
                                onClick={() => handleEmailClick(unmatchedUsers.map(user => user.email))}
                            >
                                <EmailIcon />
                            </StyledButton>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper style={{ padding: '20px', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <Title>Email Reported Users</Title>
                            <Description>Send an email to users who have been reported.</Description>
                            <StyledButton
                                variant="contained"
                                onClick={() => handleEmailClick(reportedUsers.map(user => user.email))}
                            >
                                <EmailIcon />
                            </StyledButton>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper style={{ padding: '20px', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <Title>Email Users Who Completed Onboarding</Title>
                            <Description>Send an email to users who have completed onboarding.</Description>
                            <StyledButton
                                variant="contained"
                                onClick={() => handleEmailClick(completedOnboardingUsers.map(user => user.email))}
                            >
                                <EmailIcon />
                            </StyledButton>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper style={{ padding: '20px', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <Title>Email Users Who Haven't Completed Onboarding</Title>
                            <Description>Send an email to users who haven't completed onboarding.</Description>
                            <StyledButton
                                variant="contained"
                                onClick={() => handleEmailClick(notCompletedOnboardingUsers.map(user => user.email))}
                            >
                                <EmailIcon />
                            </StyledButton>
                        </Paper>
                    </Grid>
                </Grid>
            </StyledContainer>
        </div>
    );
}

export default EmailPortal;
