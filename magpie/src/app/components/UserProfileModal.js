"use client";
import { Grid, Button, Card, Typography, Modal, ModalContent, Box, Dialog, Container } from "@mui/material";
import { UserAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { IconButton } from '@mui/material';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, writeBatch, doc, getDoc } from 'firebase/firestore';
import LockIcon from '@mui/icons-material/Lock';

const UserProfileModal = ({ user, matchingScores }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [hasSubmittedResponses, setHasSubmittedResponses] = useState(false);

    useEffect(() => {
        const fetchQuestionsAndResponses = async () => {
            setIsLoading(true);

            const q = query(collection(db, 'onboardingQuestions'), orderBy('order'));
            const querySnapshot = await getDocs(q);
            const fetchedQuestions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            let existingResponses = {};
            setQuestions(fetchedQuestions);
            setIsLoading(false);
        };

        if (user) {
            fetchQuestionsAndResponses();
        }
    }, [user]);
    const questionsObject = {};
    questions.forEach(el => {
        const { id, ...questionText } = el;
        questionsObject[id] = questionText;

    })
    console.log(questionsObject);
    const [modalOpen, setModalOpen] = useState(false);
    const handleModal = (val) => {
        setModalOpen(val);
    }
    const percentage = 66;
    const responses = user.responses;


    const [index, setIndex] = useState(0);
    const questionsLength = Number(Object.keys(responses).length);

    const nextItem = () => {
        setIndex((index) => {
            let newIndex = index + 1;
            return wrapItems(newIndex);
        });

    };

    const previousItem = () => {
        setIndex((index) => {
            let newIndex = index - 1;
            return wrapItems(newIndex);
        });

    };

    const wrapItems = (itemIndex) => {
        if (itemIndex > questionsLength - 1) {
            return 0;
        } else if (itemIndex < 0) {
            return questionsLength - 1;
        } else {
            return itemIndex;
        }
    };

    const currentItem = Object.values(responses)[index];
    const currentKey = Object.keys(responses)[index];

    console.log(index, currentItem);
    console.log(questionsObject[currentKey]?.questionText);
    return (
        <>

            <Button onClick={() => { handleModal(true); }} variant={'secondary'} style={{ background: '#2185dc', color: 'white' }}>{'View profile'}</Button>
            <Container maxWidth="xl" sx={{ position: 'fixed' }}>

                <Dialog id='modal' open={modalOpen} onClose={() => { handleModal(false); }}
                    aria-describedby="server-modal-description" sx={{
                        "& .MuiDialog-container": {
                            "& .MuiPaper-root": {
                                width: "100%",
                                maxWidth: "700px",
                                height: "100%",
                                maxHeight: "900px",
                                alignItems: 'center',
                                padding: '2rem',

                            },
                        },
                    }}>

                    <Grid container spacing={2} sx={{ height: 100 }}>
                        <Grid item xs={3}>
                            <img src={user.imageUrl || `https://via.placeholder.com/150x150.png?text=No+Image`} alt={`User ${user.name}`} style={{ width: '150px', height: '150px', borderRadius: '150px', margin: 'auto' }} />
                        </Grid>
                        <Grid item xs={8} style={{ paddingTop: '70px', paddingLeft: '40px' }}>
                            <Typography variant="h4" sx={{ fontFamily: 'poppins, sans-serif' }}>{user.name || "Name not available"}</Typography>
                        </Grid>


                        <Grid item xs={12} sx={{ textAlign: 'center', marginTop: '2.2rem' }}>
                            <Typography variant="h4" className="matchtitle" sx={{ color: 'blue', fontSize: 25, fontWeight: 450 }}> {'BIO'}</Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: 'center', paddingBottom: 10 }}>
                            <Typography variant="h4" sx={{ fontSize: 25, fontWeight: 400 }}> {user.bio}</Typography>
                        </Grid>



                        <Grid item xs={1}>
                            <IconButton aria-label='close' onClick={previousItem}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </Grid>
                        <Grid item xs={10} sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" className="matchtitle" sx={{ color: 'blue', fontSize: 25, fontWeight: 450 }}> {'RESPONSES'}</Typography>

                        </Grid>

                        <Grid item xs={1}>
                            <IconButton aria-label='close' onClick={nextItem}>
                                <ChevronRightIcon />
                            </IconButton>
                        </Grid>

                        <Grid item xs={12} sx={{ textAlign: 'center', paddingBottom: 21 }}>
                            <Typography variant="h4" sx={{ fontSize: 25, fontWeight: 700 }}> {questionsObject[currentKey]?.questionText}</Typography>
                            <Typography variant="h4" sx={{ fontSize: 25, fontWeight: 400, paddingTop: 4 }}> {currentItem?.visibility === true ? currentItem?.response : <LockIcon />}</Typography>
                        </Grid>

                        <Grid item xs={2.5} sx={{ textAlign: 'center', padding: '1rem' }}>
                            <div style={{ width: 105, height: 105 }}>
                                <CircularProgressbar styles={{ path: { stroke: `rgba(33, 133, 220, 1)` }, text: { fill: '#2185dc' } }} value={matchingScores[user.id] ? matchingScores[user.id].toFixed(1) : 0} text={`${matchingScores[user.id] ? matchingScores[user.id].toFixed(1) : '0'}%`} />
                            </div>
                        </Grid>

                        <Grid item xs={6.5} sx={{ textAlign: 'left', marginTop: '2.2rem' }}>
                            <Typography variant="h4" className="matchtitle" sx={{ color: 'blue', fontSize: 25 }}> {'Matching score'}</Typography>
                        </Grid>
                        <Grid item xs={3} sx={{ textAlign: 'center', paddingTop: 14 }}>
                            <Button variant='primary' style={{ background: '#2185dc', color: 'white', marginTop: '1rem' }}> <Typography sx={{ fontSize: 20, fontWeight: 500 }}> {'Send request'}</Typography></Button>
                        </Grid>



                    </Grid>

                </Dialog>
            </Container>

        </>
    )

}

export default UserProfileModal;