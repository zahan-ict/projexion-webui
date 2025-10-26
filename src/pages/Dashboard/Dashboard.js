import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { useAxiosInstance } from '../Auth/AxiosProvider';
import { useNavigate } from 'react-router-dom'
import {
  Grid,
  Paper,
  Box,
} from '@mui/material';
import {
  CastConnected,
  Router,
  ViewInAr,
  LocalFlorist,
  CalendarViewMonth,
  PeopleAlt,
  Storefront,
  ManageAccounts
} from '@mui/icons-material';
import { useLanguage } from '../../language/LanguageContext';


const Dashbord = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();  // Destructure 't' from context

  const { axiosInstance } = useAxiosInstance();
  const [totals, setTotals] = useState({
    total_users: 0,

  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/element-sum');
        setTotals(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [axiosInstance]);

  // Update index helper for sidebar
  const handleNavigation = (path) => {
    sessionStorage.setItem('selectedRoute', path);
    navigate(path);
  };


  return (
    <Box sx={{ mt: 2 }}>
      <Typography className='topTitle' color="secondary.dark" gutterBottom>{t.systemOverview} </Typography>
      <Box sx={{ mt: 4 }} >
        <Grid container spacing={4}>
          <Grid item xs={12} md={2} lg={2}>
            <Paper
              elevation={1}
              onClick={() => handleNavigation('/user')}
              sx={{
                margin: 0,
                padding: 2,
                display: 'flex',
                alignItems: 'center',
                transition: "all 0.2s ease-in-out",
                justifyContent: 'space-between',
                '&:hover': {
                  backgroundColor: '#f5f5a4ff',
                  transform: "scale(1.05)",
                  cursor: "pointer"
                }
              }}
            >
              {/* Left side text */}
              <div>
                <Typography gutterBottom variant="h6" sx={{ color: 'text.secondary' }} component="div">
                  {t.totalUser}
                </Typography>
                <Typography variant="h5">{totals.total_users}</Typography>
              </div>
              {/* Right side icon */}
              <PeopleAlt style={{ fontSize: 90, color: "rgb(70, 70, 70)" }} />
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mt: 2 }}>



        </Grid>

      </Box>
    </Box>
  );
}

export default Dashbord