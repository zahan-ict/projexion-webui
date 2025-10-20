import { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Link } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import { useMediaQuery } from "@mui/material";
import MuiDrawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';

const drawerWidth = 180;
const openedMixin = (theme) => ({
  width: drawerWidth,
  backgroundColor: "#fafafaff",
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  backgroundColor: "#fafafaff",

  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  overflowY: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const Sidebar = ({ open, menuItem, currentPath }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Check if width is ≤ 600px

  // Find the initial selected index based on the current route
  const defaultIndex = menuItem.findIndex(item => item.path === currentPath);
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

  // Update the selectedIndex when the route changes
  useEffect(() => {
    const index = menuItem.findIndex(item => item.path === currentPath);
    setSelectedIndex(index !== -1 ? index : -1); // <-- -1 means "nothing selected"
  }, [currentPath, menuItem]);

  return (
    <Drawer variant="permanent" open={open}>
      <img
        src={open ? "/static/images/logo.png" : "/static/images/logo-sm.png"}
        alt="Logo"
        style={{
          width: open ? "70px" : "25px",
          height: "auto",
          marginLeft: open ? "25px" : "20px",
          marginTop: "20px",
        }}
      />

      <List sx={{ mt: 2 }}>
        {menuItem.map((item, index) => (
          <Link
            style={{ textDecoration: 'none', color: '#000' }}
            to={item.path}
            key={index}
          >
            <ListItem key={item.name} disablePadding sx={{ display: 'block', position: 'relative' }}>
              <ListItemButton
                sx={{
                  minHeight: 50,
                  justifyContent: open ? 'initial' : 'center',
                  px: isSmallScreen ? 2 : 2.5,
                  flexDirection: open ? 'row' : 'column',
                  '::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '200px',
                    borderLeft: selectedIndex === index ? '4px solid #00796b' : 'transparent',
                    backgroundColor: selectedIndex === index ? '#dee6eb5e' : 'transparent',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    zIndex: 1001,
                    color: selectedIndex === index ? '#00796b' : '#424242',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <Typography
                  sx={{
                    fontSize: open ? '15px' : '9px',
                    zIndex: 1001,
                    color: selectedIndex === index ? '#00796b' : '#424242',
                  }}
                >
                  {item.name}
                </Typography>
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;