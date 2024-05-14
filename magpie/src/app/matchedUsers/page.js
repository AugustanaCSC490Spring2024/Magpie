"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';  
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { Container, TextField, Card, CardContent, CardMedia, Typography, Button, Grid, InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';


const MatchedUsers = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [matches, setMatches] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [academicYear, setAcademicYear] = useState('');
    const [academicYearOptions, setAcademicYearOptions] = useState(['Freshman', 'Sophomore', 'Junior', 'Senior']);

    useEffect(() => {
        const fetchAcademicQuestionId = async () => {
            const questionsSnapshot = await getDocs(query(collection(db, 'onboardingQuestions'), where('questionText', '==', 'What is your current academic year status?')));
            const questionDoc = questionsSnapshot.docs[0];
            return questionDoc.id;
        };

        const fetchUsers = async () => {
            const questionId = await fetchAcademicQuestionId();
            const usersSnapshot = await getDocs(collection(db, 'userProfiles'));
            const userResponsesSnapshot = await getDocs(collection(db, 'userResponses'));

            const usersData = usersSnapshot.docs.map(doc => {
                const userData = doc.data();
                const responseDoc = userResponsesSnapshot.docs.find(r => r.id === doc.id);
                const responses = responseDoc ? responseDoc.data().responses : {};
                userData.academicStatus = responses[questionId] ? responses[questionId].response : '';
                return { id: doc.id, ...userData };
            });

            const matchesQuery = query(collection(db, 'matchRequests'), where('status', '==', 'accepted'));
            const matchesSnapshot = await getDocs(matchesQuery);
            const matchedUsers = matchesSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    fromUser: usersData.find(user => user.id === data.from),
                    toUser: usersData.find(user => user.id === data.to),
                };
            }).filter(match => match.fromUser && match.toUser);
            setMatches(matchedUsers);
            setAllUsers(usersData);
        };

        fetchUsers();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleAcademicYearChange = (event) => {
        setAcademicYear(event.target.value);
    };

    const filteredMatches = matches.filter(match => {
        const fromMatches = match.fromUser.name.toLowerCase().includes(searchTerm) || match.toUser.name.toLowerCase().includes(searchTerm);
        const academicMatches = academicYear ? (match.fromUser.academicStatus === academicYear || match.toUser.academicStatus === academicYear) : true;
        return fromMatches && academicMatches;
    });

    return (
        <Container>
            <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>Matched Users</Typography>
            <TextField
                placeholder="Search by name..."
                onChange={handleSearchChange}
                variant="outlined"
                sx={{ mb: 2, width: '100%' }}
                InputProps={{
                    endAdornment: <SearchIcon />
                }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="academic-year-select-label">Academic Year</InputLabel>
                <Select
                    labelId="academic-year-select-label"
                    id="academic-year-select"
                    value={academicYear}
                    label="Academic Year"
                    onChange={handleAcademicYearChange}
                >
                    <MenuItem value=""><em>Any</em></MenuItem>
                    {academicYearOptions.map((year, index) => (
                        <MenuItem key={index} value={year}>{year}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Typography variant="h6">Total Matches: {filteredMatches.length}</Typography>
            {filteredMatches.map((match, index) => (
                <Grid item xs={12} md={6} key={index}>
                <Card sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    mb: 2,
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.03)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
                    }
                }}>
                    <CardMedia
                        component="img"
                        sx={{ width: { xs: '100%', md: 151 }, height: 200 }}
                        image={match.fromUser.imageUrl || 'https://via.placeholder.com/150'}
                        alt={match.fromUser.name}
                    />
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography variant="h5">{match.fromUser.name}</Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {match.fromUser.bio}
                        </Typography>
                    </CardContent>
                    <CardMedia
                        component="img"
                        sx={{ width: { xs: '100%', md: 151 }, height: 200 }}
                        image={match.toUser.imageUrl || 'https://via.placeholder.com/150'}
                        alt={match.toUser.name}
                    />
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography variant="h5">{match.toUser.name}</Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {match.toUser.bio}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            ))}
        </Container>
    );
};

export default MatchedUsers;
