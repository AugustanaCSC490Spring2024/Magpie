"use client";
import { Grid, Button, Card, Typography, Modal, ModalContent, Box, Dialog, Container} from "@mui/material";
import { UserAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users } from "../api/users";
import Contactbutton from "./Contactbutton";
const Dashboardpage = () => {

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
    return (
        <Container maxWidth='xl'>
        <Grid container spacing={2} style={{ paddingLeft: 140, paddingRight: 10, paddingBottom: 80, paddingTop: 30 }}>
            <Grid item xs={10}>
                {user && `welcome ${user.displayName}`}
            </Grid>
            <Grid item xs={1}>
                <Button href={'../profile'}>{"profile"}</Button>
            </Grid>
            <Grid item xs={1}>
                <Button onClick={() => { logOut(); router.push('/#') }}>{"sign out"}</Button>
            </Grid>
            {Users.map((user, index) => {
                return (
                    <Grid item xs={4} key={index}>
                        <Card style={{ textAlign: 'center', padding: '2.4rem', width: '15rem', height: '30rem', borderRadius: '15px' }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sx={{ margin: 'auto' }}>
                                    <img src={`https://via.placeholder.com/150x150.png?text=${index}`} style={{borderRadius: '80px'}}></img>
                                </Grid>
                                <Grid item xs={12} sx={{ margin: 'auto' }}>
                                    <Typography variant={'h4'}>{user.name}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant={'h6'}>{user.major}</Typography>
                                </Grid>
                                <Grid item xs={12} sx={{ margin: 'auto' }}>
                                    <Typography>{user.year}</Typography>
                                </Grid>
                                <Grid item xs={12} sx={{ margin: 'auto' }}>
                                    <Contactbutton user={user}></Contactbutton>
                                </Grid>

                            </Grid>

                        </Card>
                    </Grid>

                )

            })}

        </Grid>
        </Container>

    )

}


export default Dashboardpage;