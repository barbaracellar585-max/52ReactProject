import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, CardMedia, Grid, Tooltip, Typography } from '@mui/material';
import {
  fetchGetDataWithAuth,
  fetchGetDataWithAuthArrayBuffer,
  fetchDeleteDataWithAuth,
  fetchGetBlobDataWithAuth
} from '../../../client/client';
import { useLocation } from 'react-router-dom';
import Modal from '@mui/material/Modal';

const PhotoGrid = () => {
  const [photos, setPhotos] = useState({});
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const album_id = queryParams.get('id');
  const [albumInfo, setAlbumInfo] = useState({});
  const [open, setOpen] = useState(false);
  const [PhotoContent, setPhotoContent] = useState(null);
  const [PhotoDesc, setPhotoDesc] = useState(null);
  const [DownloadLink, setDownloadLink] = useState(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleView = (download_link, description) => {
    fetchGetDataWithAuthArrayBuffer(download_link).then((arrayBuffer) => {
      if (!arrayBuffer) return;
      const base64 = btoa(new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      setPhotoContent(base64);
    });
    setDownloadLink(download_link);
    setPhotoDesc(description);
    handleOpen();
  };
  const handleDownload = (download_link) => {
    console.log(download_link);
    fetchGetBlobDataWithAuth(download_link)
      .then((response) => {
        console.log(response);
        const disposition = response.headers['content-disposition'];
        const match = /filename="(.*)"/.exec(disposition);
        const filename = match ? match[1] : 'downloadedFile';
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('Error downloading file', error);
      });
  };
  const handleDelete = (photo_id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this photo from the album?');
    if (isConfirmed) {
      console.log('Item deleted! ' + photo_id);
      fetchDeleteDataWithAuth('/albums/' + album_id + '/photos/' + photo_id + '/delete').then((res) => {
        console.log(res);
        window.location.reload();
      });
    } else {
      console.log('Delete operation cancelled');
    }
  };

  useEffect(() => {
    fetchGetDataWithAuth('/albums/' + album_id).then((album) => {
      setAlbumInfo(album);

      const photosList = album.photos;
      photosList.forEach((photo) => {
        let thumbnail_link = photo.download_link.replace('/download-photo', '/download-thumbnail');
        fetchGetDataWithAuthArrayBuffer(thumbnail_link).then((arrayBuffer) => {
          if (!arrayBuffer) return;
          const base64 = btoa(new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
          const albumPhotoID = `album_${album_id}_photo${photo.id}`;

          const temp = {
            album_id,
            photo_id: photo.id,
            name: photo.name,
            description: photo.description,
            content: base64,
            download_link: photo.download_link
          };

          setPhotos((prev) => ({ ...prev, [albumPhotoID]: temp }));
        });
      });
    });
  }, [album_id]);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 5,
            p: 3,
            maxHeight: '90%',
            maxWidth: '90%',
            overflow: 'auto'
          }}
        >
          <img src={'data:image/jpeg;base64,' + PhotoContent} alt={PhotoDesc} style={{ width: '100%', height: 'auto' }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              gap: 2,
              mt: 2
            }}
          >
            <Button variant="contained" onClick={() => handleDownload(DownloadLink)}>
              {' '}
              Download Photo
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              {' '}
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
      <Typography variant="h4" gutterBottom>
        {albumInfo.name}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {albumInfo.description}
      </Typography>
      <Grid container spacing={2}>
        {Object.keys(photos).map((key) => {
          const photo = photos[key];
          if (!photo) return null;
          return (
            <Grid item key={key} xs={8} sm={4} md={4} lg={2}>
              <Card>
                <Tooltip title={photos[key]['description'] || ''}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={'data:image/jpeg;base64,' + photos[key]['content']}
                    alt={photos[key]['description']}
                  />
                </Tooltip>
                <CardContent>
                  <Tooltip title={photos[key]['description']}>
                    <Typography variant="subtitle1">{photos[key]['name']}</Typography>
                  </Tooltip>
                  <a href="#" onClick={() => handleView(photos[key]['download_link'], photos[key]['description'])}>
                    {' '}
                    View |
                  </a>
                  <a
                    href={`/photo/edit?album_id=${album_id}&photo_id=${photos[key]['photo_id']}&photo_name=${photos[key]['name']}&photo_desc=${photos[key]['description']}`}
                  >
                    {' '}
                    Edit |
                  </a>
                  <a href="#" onClick={() => handleDownload(photos[key]['download_link'])}>
                    {' '}
                    Download |
                  </a>
                  <a href="#" onClick={() => handleDelete(photos[key]['photo_id'])}>
                    {' '}
                    Delete
                  </a>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default PhotoGrid;
