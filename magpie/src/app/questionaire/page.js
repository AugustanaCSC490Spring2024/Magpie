"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; 
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';
import {
  Button,
  TextField,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Container,
  Grid,
  Typography,
  Snackbar
} from '@mui/material';

function AdminPage() {
  const [questions, setQuestions] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptions, setNewOptions] = useState('');
  const [newOrder, setNewOrder] = useState('');
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fetchQuestions = async () => {
    const q = query(collection(db, 'onboardingQuestions'), orderBy('order'));
    const querySnapshot = await getDocs(q);
    const fetchedQuestions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setQuestions(fetchedQuestions);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAddQuestion = async () => {
    const questionTextTrimmed = newQuestionText.trim();
    const newOptionsTrimmed = newOptions.trim();
    let order = parseInt(newOrder.trim(), 10);
    const optionsArray = newOptionsTrimmed.split(',').map(opt => opt.trim()).filter(opt => opt);
  
    if (!questionTextTrimmed || optionsArray.length === 0 || isNaN(order) || order <= 0) {
      alert('Please make sure all fields are filled correctly and the order is a positive number.');
      return;
    }
  
    const maxOrder = questions.reduce((max, q) => Math.max(max, q.order), 0);
  
    if (order > maxOrder) {
      order = maxOrder + 1;
    } else {
      const existingQuestionWithOrder = questions.find(q => q.order === order);
      if (existingQuestionWithOrder) {
        for (let question of questions.filter(q => q.order >= order)) {
          await updateDoc(doc(db, 'onboardingQuestions', question.id), {
            ...question,
            order: question.order + 1
          });
        }
      }

    }
  
    try {
      await addDoc(collection(db, 'onboardingQuestions'), {
        questionText: questionTextTrimmed,
        options: optionsArray,
        order,
      });
      setNewQuestionText('');
      setNewOptions('');
      setNewOrder('');
      setSnackbarOpen(true);
      setSnackbarMessage('Question added successfully');
      await fetchQuestions(); 
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  

  const handleDeleteQuestion = async (id) => {
    const questionToDelete = questions.find(q => q.id === id);
    const deleteOrder = questionToDelete.order;
  
    try {
      await deleteDoc(doc(db, 'onboardingQuestions', id));
  
      const questionsToUpdate = questions.filter(q => q.order > deleteOrder);
      for (let question of questionsToUpdate) {
        await updateDoc(doc(db, 'onboardingQuestions', question.id), {
          ...question,
          order: question.order - 1
        });
      }
  
      setSnackbarOpen(true);
      setSnackbarMessage('Question deleted successfully');
      await fetchQuestions();
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };
  

  const handleOpenEditModal = (question) => {
    const editedQuestion = {
      ...question,
      options: Array.isArray(question.options) ? question.options : question.options.split(', ')
    };
    setEditQuestion(editedQuestion);
    setOpenEditModal(true);
  };
  
  const handleUpdateQuestion = async () => {
    if (editQuestion) {
      const { id, questionText, options, order } = editQuestion;
      let finalOrder = parseInt(order, 10);
      const optionsArray = typeof options === 'string' ? options.split(',').map(opt => opt.trim()) : options;
      
      const maxOrder = questions.reduce((max, q) => Math.max(max, q.order), 0);
  
      if (finalOrder > maxOrder) {
        finalOrder = maxOrder + 1; 
      } else {
        const orderConflict = questions.find(q => q.order === finalOrder && q.id !== id);
        // Preemptively adjust orders to accommodate the edited question
        if (orderConflict) {
          // Determine direction of reordering
          const isMovingForward = finalOrder > editQuestion.order;
          const startOrder = isMovingForward ? editQuestion.order : finalOrder;
          const endOrder = isMovingForward ? finalOrder : editQuestion.order;

          // Adjust orders in the direction of the move
          questions.filter(q => q.order >= startOrder && q.order <= endOrder && q.id !== id)
            .forEach(async (question) => {
              const newOrder = isMovingForward ? question.order - 1 : question.order + 1;
              await updateDoc(doc(db, 'onboardingQuestions', question.id), {
                ...question,
                order: newOrder
              });
            });
        }

      }
  
      try {
        await updateDoc(doc(db, 'onboardingQuestions', id), {
          questionText,
          options: optionsArray,
          order: finalOrder,
        });
        setSnackbarOpen(true);
        setSnackbarMessage('Question edited successfully');
        await fetchQuestions(); 
        handleCloseEditModal();
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };
  

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditQuestion(null);
  };

  
  return (
    <div>
      <Container>
      <Typography variant="h3" gutterBottom>
        Customize Questionaire
      </Typography>
      <Box component="form" noValidate autoComplete="off" onSubmit={(e) => e.preventDefault()} sx={{ mb: 5 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Question Text"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Options (comma-separated)"
              value={newOptions}
              onChange={(e) => setNewOptions(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="Order"
              type="number"
              value={newOrder}
              onChange={(e) => setNewOrder(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button variant="contained" color="primary" onClick={handleAddQuestion}>
              Add Question
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
  {questions.map((question) => (
    <Box 
      key={question.id} 
      sx={{ 
        width: '100%', maxWidth: 600, 
        mb: 2, 
        p: 2, 
        border: '1px solid #ccc', 
        borderRadius: '4px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'start', 
      }}
    >
      <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
        {question.order}. {question.questionText} - {question.options.join(', ')}
      </Typography>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'start', width: '100%' }}>
        <Button variant="contained" color="primary" onClick={() => handleOpenEditModal(question)} sx={{ mr: 1 }}>
          Edit
        </Button>
        <Button variant="contained" color="secondary" onClick={() => handleDeleteQuestion(question.id)}>
          Delete
        </Button>
      </Box>
    </Box>
  ))}
</Box>

      <Dialog open={openEditModal} onClose={handleCloseEditModal}>
        <DialogContent>
          <TextField
            margin="dense"
            label="Question Text"
            fullWidth
            variant="outlined"
            value={editQuestion?.questionText || ''}
            onChange={(e) => setEditQuestion({ ...editQuestion, questionText: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Options (comma-separated)"
            fullWidth
            variant="outlined"
            value={typeof editQuestion?.options === 'string' ? editQuestion.options : editQuestion?.options.join(', ') || ''}
            onChange={(e) => setEditQuestion({ ...editQuestion, options: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Order"
            type="number"
            fullWidth
            variant="outlined"
            value={editQuestion?.order || ''}
            onChange={(e) => setEditQuestion({ ...editQuestion, order: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal}>Cancel</Button>
          <Button onClick={handleUpdateQuestion}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AdminPage;
