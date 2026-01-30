import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { fetchGetDataWithAuth } from 'client/client';
import { Link } from 'react-router-dom';

const brightPopColors = [
  '#FFAB00',
  '#36B37E',
  '#FF69B4',
  '#39FF14',
  '#FFD300',
  '#FF6F00',
  '#9D00FF',
  '#FF1744',
  '#00E5FF',
  '#C6FF00',
  '#FF00FF',
  '#00BFFF',
  '#FF2400',
  '#40E0D0',
  '#F400A1',
  '#FFF700',
  '#50C878',
  '#0047AB',
  '#FF7F50',
  '#7FFF00'
];

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * brightPopColors.length);
  return brightPopColors[randomIndex];
};

const AlbumDynamicGridPage = () => {
  const [dataArray, setDataArray] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('token');
    if (!isLoggedIn) {
      navigate('/login');
      window.location.reload();
    }
    fetchGetDataWithAuth('/albums')
      .then((res) => {
        console.log('API response:', res);
        setDataArray(res?.data || res || []);
      })
      .catch((err) => {
        console.error('API error:', err);
        setDataArray([]);
      });
  }, [navigate]);

  return (
    <Grid container spacing={2}>
      {dataArray.map((data, index) => (
        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
          <Link to={`/album/show?id=${data.id}`}>
            <Card
              sx={{
                backgroundColor: getRandomColor(),
                textAlign: 'center',
                p: 3,
                borderRadius: 2,
                height: 250,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <CardContent>
                <Typography variant="h5" sx={{ fontSize: '2rem', m: 0, color: 'white' }}>
                  {data.name}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default AlbumDynamicGridPage;
