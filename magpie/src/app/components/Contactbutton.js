"use client";
import { Grid, Button, Card, Typography, Modal, ModalContent, Box, Dialog } from "@mui/material";
import { UserAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


const Contactbutton = ({ user }) => {

    const [modalOpen, setModalOpen] = useState(false);
    const handleModal = (val) => {
        setModalOpen(val);
    }

    return (
        <>

            <Button onClick={() => { handleModal(true); }} variant={'secondary'} style={{ background: 'orange', color: 'white' }}>{'contact'}</Button>
            <Dialog id='modal' open={modalOpen} onClose={() => { handleModal(false); }}
                aria-describedby="server-modal-description" sx={{
                    "& .MuiDialog-container": {
                      "& .MuiPaper-root": {
                        width: "100%",
                        maxWidth: "300px",
                        height: "100%",
                        maxHeight: "100px",
                        alignItems: 'center',
                        padding: '2rem' 
                      },
                    },
                  }}>

                <Typography variant={'h6'}>{user.email}</Typography>

            </Dialog>
        </>
    )

}

export default Contactbutton;