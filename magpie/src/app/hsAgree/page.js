"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Button, Container, Grid, Paper, Typography, IconButton } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import DeleteIcon from '@mui/icons-material/Delete';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase'; 

function hsAgree() {
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);

    const onDrop = acceptedFiles => {
        setFiles(acceptedFiles.map(file => ({
            ...file,
            preview: URL.createObjectURL(file),
            isPdf: file.type === 'application/pdf'
        })));
    };

    useEffect(() => {
        return () => files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const removeFile = file => () => {
        URL.revokeObjectURL(file.preview);
        setFiles(files.filter(f => f !== file));
    };

    const handleUploadClick = () => {
        if (fileInputRef.current.files.length > 0) {
            const file = fileInputRef.current.files[0];
            const reader = new FileReader();
            reader.onload = async (e) => {
                const fileDataURL = e.target.result;
                try {
                    const docRef = doc(firestore, "housingAgreement", file.name);
                    await setDoc(docRef, { fileDataURL, fileName: file.name }, { merge: true });
                    console.log('Document successfully written with Data URL!');
                    alert('Upload successful!');
                } catch (error) {
                    console.error("Error writing document: ", error);
                    alert('Error during upload.');
                }
            };
            reader.onerror = error => console.error('Error reading file:', error);
            reader.readAsDataURL(file);
        } else {
            alert('No file selected. Please select a file to upload.');
        }
    };

    const handleFileSelect = () => {
        fileInputRef.current.click();
    };

    return (
        <Container component="main" maxWidth="lg">
             <Typography variant="h4" component="h1" style={{ margin: '20px 0', textAlign: 'center' }}>
                Please upload the housing agreement
            </Typography>
            <Paper {...getRootProps()} style={{
                padding: 20,
                textAlign: 'center',
                minHeight: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                border: isDragActive ? '2px solid blue' : '2px dashed gray',
                marginBottom: 20
            }}>
                <input {...getInputProps()} />
                {isDragActive ?
                    <Typography>Drop the files here ...</Typography> :
                    <Typography>Drag 'n' drop some files here, or click to select files</Typography>
                }
            </Paper>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                {files.map((file, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Paper style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 10,
                            width: '100%', 
                            maxWidth: 5000, 
                            height: 1300, 
                        }}>
                            <Typography>{file.name}</Typography>
                            <IconButton onClick={removeFile(file)} aria-label="Delete file">
                                <DeleteIcon />
                            </IconButton>
                            {file.isPdf ? (
                                <iframe src={file.preview} style={{ width: 1400, height: 1300, border: '1px solid black' }} frameBorder="0"></iframe>
                            ) : (
                                <img src={file.preview} alt={file.name} style={{ width: 1400, height: 1300, objectFit: 'cover' }} />
                            )}
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={() => {}}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleFileSelect}
                style={{ marginTop: 20, marginLeft: 280 }}
            >
                Select File
            </Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={handleUploadClick}
                style={{ marginTop: 20, marginLeft: 280 }}
            >
                Upload File
            </Button>
        </Container>
    );
}

export default hsAgree;