import { useState } from 'react';
import Box from '@mui/material/Box';
import {
  Dashboard,
  ContactMail,
  CalendarViewMonth,
  Business,
  ListAlt,
  PeopleAlt,

} from '@mui/icons-material';
import Header from './Header';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';

const Main = ({ children }) => {
  const location = useLocation(); // Get the current route
  const [open, setOpen] = useState(true);

  const menuItem = [
    { path: "/dashboard", name: "Dashboard", icon: <Dashboard /> },
    { path: "/project", name: "Projekt", icon: <ListAlt /> },
    { path: "/contact", name: "Kontakt", icon: <ContactMail /> },
    { path: "/company", name: "Firma", icon: <Business /> },
    { path: "/user", name: "User", icon: <PeopleAlt /> },
  ];

  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  const currentRoute = menuItem.find(item => item.path === location.pathname)?.name || 'Unknown';
  return (
    
<Box className="app-content" sx={{m:-1}}>
    
    {/* Header stays on top */}
    <Header
      open={open}
      handleLogout={() => {}}
      handleDrawerToggle={handleDrawerToggle}
      route={currentRoute}
    />

    {/* Sidebar + Main */}
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <Sidebar
        open={open}
        handleDrawerToggle={handleDrawerToggle}
        menuItem={menuItem}
        currentPath={location.pathname}
      />
      
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, px:4,  mt:10, overflowX: 'hidden',zIndex:1222}}>
        {children}
      </Box>
    </Box>

    {/* Footer */}
    <Box component="footer" sx={{ textAlign: 'center', mt: 'auto' }}>
      <Typography color="GrayText">
        &copy; {new Date().getFullYear()} PDF Maker. All rights reserved
      </Typography>
    </Box>
  </Box>
);


};

export default Main;
