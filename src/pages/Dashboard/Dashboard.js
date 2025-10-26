import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { useAxiosInstance } from '../Auth/AxiosProvider';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Box,
} from '@mui/material';
import {
  PeopleAlt,
  ContactMail,
  ViewInAr,
  Business,
} from '@mui/icons-material';
import { useLanguage } from '../../language/LanguageContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { axiosInstance } = useAxiosInstance();

  const [totals, setTotals] = useState({
    total_users: 0,
    total_contacts: 0,
    total_projects: 0,
    total_company: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/element-sum');
        setTotals(response.data || {});
      } catch (error) {
        console.error("Error fetching dashboard totals:", error);
      }
    };
    fetchData();
  }, [axiosInstance]);

  const handleNavigation = (path) => {
    sessionStorage.setItem('selectedRoute', path);
    navigate(path);
  };

  const dashboardItems = [
    {
      label: t.totalUser || "Benutzer",
      value: totals.total_users,
      icon: <PeopleAlt style={{ fontSize: 90, color: "rgb(70, 70, 70)" }} />,
      path: "/user",
      hoverColor: "#f5f5a4ff"
    },
    {
      label: t.totalContacts || "Kontakte",
      value: totals.total_contacts,
      icon: <ContactMail style={{ fontSize: 90, color: "rgb(70, 70, 70)" }} />,
      path: "/contact",
      hoverColor: "#bdf5bd"
    },
    {
      label: t.totalProjects || "Projekte",
      value: totals.total_projects,
      icon: <ViewInAr style={{ fontSize: 90, color: "rgb(70, 70, 70)" }} />,
      path: "/project",
      hoverColor: "#bde0f5"
    },
    {
      label: t.totalCompanies || "Firmen",
      value: totals.total_company,
      icon: <Business style={{ fontSize: 90, color: "rgb(70, 70, 70)" }} />,
      path: "/company",
      hoverColor: "#f5c4bd"
    },
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <Typography className='topTitle' color="secondary.dark" gutterBottom>
        {t.systemOverview || "Systemübersicht"}
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          {dashboardItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={1}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: "all 0.2s ease-in-out",
                  '&:hover': {
                    backgroundColor: item.hoverColor,
                    transform: "scale(1.05)",
                    cursor: "pointer"
                  }
                }}
              >
                <div>
                  <Typography gutterBottom variant="h6" sx={{ color: 'text.secondary' }}>
                    {item.label}
                  </Typography>
                  <Typography variant="h5">{item.value ?? 0}</Typography>
                </div>
                {item.icon}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;