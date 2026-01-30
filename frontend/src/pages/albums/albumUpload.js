import React, { useState } from 'react';
import Header from './albums/header';
import { Box, Button, Container, Grid, Paper, Typography, IconButton, CircularProgress } from '@mui/material';
import { AddCircleOutline, Close } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchPostFileUploadWithAuth } from '../../client/client';

const FileUploadPage = () => {
  const [files, setFiles] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const onDrop = (acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    setProcessing(true);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    try {
      fetchPostFileUploadWithAuth('/albums/' + id + '/upload-photos', formData).then((res) => {
        console.log(res.data);
        navigate('/album/show?id=' + id);
        setFiles([]);
      });
    } catch (error) {
      console.error('Error uploading files: ', error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <Header />
      <Container>
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4" align="center" gutterBottom>
                Photo Upload
              </Typography>
            </Grid>
            <Grid item xs={12} {...getRootProps()}>
              <input {...getInputProps()} />
              <Paper
                elevation={3}
                sx={{
                  border: (theme) => `2px dashed ${theme.palette.primary.main}`,
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <AddCircleOutline fontSize="large" color="primary" />
                <Typography variant="h6">Drag and drop photos or click to select files</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Box>
                {files.map((file, index) => (
                  <Paper
                    key={index}
                    elevation={3}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      mt: 2,
                      border: (theme) => `1px solid ${theme.palette.secondary.main}`,
                      borderRadius: 1
                    }}
                  >
                    <Typography>{file.name}</Typography>
                    <IconButton onClick={() => removeFile(index)} color="secondary">
                      <Close />
                    </IconButton>
                  </Paper>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              {!processing ? (
                <Button variant="contained" color="primary" onClick={handleUpload} disabled={files.length === 0}>
                  Upload photos
                </Button>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <CircularProgress />
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
};

export default FileUploadPage;
