"use client"
import React, { useCallback, useState } from 'react';
import { Button, Container, Grid, Paper, Typography, IconButton } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import DeleteIcon from '@mui/icons-material/Delete';

function hsAgree() {
    const [files, setFiles] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        
        setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const removeFile = file => () => {
        const newFiles = files.filter(f => f !== file);
        setFiles(newFiles);
    };

    const handleUpload = () => {
        alert('Upload functionality not implemented yet.');
    };

    return (
        <Container component="main" maxWidth="sm">
            <Paper {...getRootProps()} style={{
                padding: 20,
                textAlign: 'center',
                minHeight: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                border: isDragActive ? '2px solid blue' : '2px dashed gray'
            }}>
                <input {...getInputProps()} />
                {isDragActive ?
                    <Typography>Drop the files here ...</Typography> :
                    <Typography>Drag 'n' drop some files here, or click to select files</Typography>
                }
            </Paper>
            <Grid container spacing={2} style={{ marginTop: 20 }}>
              
                {files.map((file, index) => (
                    <Grid item xs={12} key={index}>
                        <Paper style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px' }}>
                            <Typography>{file.name}</Typography>
                            <IconButton onClick={removeFile(file)}>
                                <DeleteIcon />
                            </IconButton>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            
            <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                style={{ marginTop: 20 }}
            >
                Upload
            </Button>
        </Container>
    );
}

export default hsAgree;
