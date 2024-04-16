"use client";
import { Grid, Button, Card, Typography, Modal, ModalContent, Box, Dialog, Container } from "@mui/material";
import { UserAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Contactbutton from "./Contactbutton";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import ContactButton from './Contactbutton';





const capitalizeFirstLetter = (string) => {
    return string.toLowerCase().split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}
const Dashboardpage = (props) => {

    const { user, logOut, isAdmin } = UserAuth();


    useEffect(() => {
        const checkAuthentication = async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
        };
        checkAuthentication();
    }, [user]);

    const router = useRouter();

    useEffect(() => {

        if (isAdmin) {
            router.push('/AdminPage');
        }
    }, [isAdmin, router]);

    const [modalOpen, setModalOpen] = useState(false);
    const handleModal = (val) => {
        setModalOpen(val);
    }

    const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const db = getFirestore();
                const usersCollection = collection(db, "userProfiles");
                const userSnapshot = await getDocs(usersCollection);
                const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(userList);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };
        fetchUsers();
    }, []);


    return (
        <Container maxWidth='xl'>
            <Grid container spacing={2} style={{ paddingLeft: 140, paddingRight: 10, paddingBottom: 80, paddingTop: 30 }}>
                <Grid item xs={10}>
                    {user && <Typography variant="h6">Welcome <span style={{ fontFamily: 'Arial' }}>{user.displayName}</span></Typography>}
                </Grid>
                <Grid item xs={1}>
                    <Button href='../profile'>Profile</Button>
                </Grid>
                <Grid item xs={1}>
                    <Button onClick={() => { logOut(); router.push('/#'); }}>Sign Out</Button>
                </Grid>
                {users.map((user, index) => (
                    <Grid item xs={4} key={user.id}>
                        <Card style={{ textAlign: 'center', padding: '2.4rem', width: '15rem', height: '30rem', borderRadius: '15px' }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sx={{ margin: 'auto' }}>
                                    <img src={`https://via.placeholder.com/150x150.png?text=${index}`} style={{ width: '150px', height: '150px', borderRadius: '15px' }} alt={`User ${user.name || "Name not available"}`}></img>
                                </Grid>
                                <Grid item xs={12} sx={{ margin: 'auto' }}>
                                    <Typography variant={'h4'}>{user.name || "Name not available"}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant={'h6'}>{user.major || "Major not available"}</Typography>
                                </Grid>
                                <Grid item xs={12} sx={{ margin: 'auto' }}>
                                    <Typography>{user.year || "Year not available"}</Typography>
                                </Grid>
                                <Grid item xs={12} sx={{ margin: 'auto' }}>
                                    <ContactButton user={user} />
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );

}


export default Dashboardpage;