"use client";
import React, { useEffect, useState, useContext  } from 'react';
import { db } from '../firebase'; 
import { collection, getDocs, query, orderBy, writeBatch, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation'; 
import { UserAuth  } from '../context/AuthContext'; 
import { Button, Typography, CircularProgress, Box, FormControl, InputLabel, Select, MenuItem, TextField, Container, Paper, Stepper, Step, StepLabel, useTheme, useMediaQuery } from '@mui/material';

const Onboarding = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubmittedResponses, setHasSubmittedResponses] = useState(false); 
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = UserAuth();
  

  useEffect(() => {
    const fetchQuestionsAndResponses = async () => {
      setIsLoading(true);
  
      // Fetch questions
      const q = query(collection(db, 'onboardingQuestions'), orderBy('order'));
      const querySnapshot = await getDocs(q);
      const fetchedQuestions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      let existingResponses = {};
      const responsesRef = doc(db, 'userResponses', user.uid);
      const responsesDoc = await getDoc(responsesRef);
      if (responsesDoc.exists()) {
        existingResponses = Object.keys(responsesDoc.data().responses).reduce((acc, questionText) => {
          // Find the question ID corresponding to the questionText
          const question = fetchedQuestions.find(q => q.questionText === questionText);
          setHasSubmittedResponses(true);
          if (question) acc[question.id] = responsesDoc.data().responses[questionText];
          return acc;
        }, {});
      }
      
      setQuestions(fetchedQuestions);
      setResponses(existingResponses);
      setIsLoading(false);
    };
  
    if (user) {
      fetchQuestionsAndResponses();
    }
  }, [user]);
  

  const handleChange = (event, questionId) => {
    setResponses({ ...responses, [questionId]: event.target.value });
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(current => current + 1);
    } else {
      await handleSubmitResponses();
    }
  };

  const handleSubmitResponses = async () => {
    if (!user) {
      console.error('User must be logged in to submit responses.');
      return;
    }
  
    // Preparing the data for Firestore submission
    const responsesForFirestore = Object.keys(responses).reduce((acc, questionId) => {
      const questionText = questions.find(question => question.id === questionId).questionText;
      acc[questionText] = responses[questionId];
      return acc;
    }, {});
  
    const batch = writeBatch(db);
    const responsesRef = doc(collection(db, 'userResponses'), user.uid); 
    batch.set(responsesRef, {
      userId: user.uid,
      responses: responsesForFirestore,
      submittedAt: new Date(),
    });
  
    try {
      await batch.commit();
      console.log('Responses submitted successfully');
      router.push('/dashboard'); 
    } catch (error) {
      console.error('Error submitting responses:', error);
    }
  };
  
  const headingText = hasSubmittedResponses ? "Edit Onboarding Responses" : "Start Onboarding";


  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><CircularProgress /></Box>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: isSmallScreen ? 2 : 4 }}>
        <Stepper activeStep={currentQuestionIndex} alternativeLabel nonLinear sx={{ mb: 4 }}>
          {questions.map((_, index) => (
            <Step key={index}>
              <StepLabel>{`Question ${index + 1}`}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 'bold', mb: 3 }}>
          {headingText}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>{currentQuestion.questionText}</Typography>
          <FormControl fullWidth margin="normal">
            <Select
              value={responses[currentQuestion.id] || ''}
              onChange={(e) => handleChange(e, currentQuestion.id)}
            >
              {currentQuestion.options.map((option, index) => (
                <MenuItem key={index} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(current => Math.max(current - 1, 0))}
          >
            Back
          </Button>
          <Button variant="contained" onClick={handleNext}>
            {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Onboarding;
