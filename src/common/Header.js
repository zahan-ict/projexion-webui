import { useState, useEffect, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate, Link } from 'react-router-dom';
import {
  Toolbar,
  AppBar,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Autocomplete,
  CircularProgress,
  TextField,
} from '@mui/material';
import {
  Search as SearchIcon,
  Logout,
  Menu as MenuIcon,
  Person
} from '@mui/icons-material';
import { useLanguage } from '../language/LanguageContext';
import { useAxiosInstance } from '../pages/Auth/AxiosProvider';

import { useAuth } from '../pages/Auth/AuthProvider';


const drawerWidth = 180;

const MuiAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 0,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(!open && {
    width: `calc(100% - ${drawerWidth - 115}px)`,
  }),
}));

const Header = ({ handleDrawerToggle, open, route }) => {
  const { axiosInstance } = useAxiosInstance();
  const { language, switchLanguage, t } = useLanguage();
  const navigate = useNavigate();

  // Menus
  const [langAnchorEl, setLangAnchorEl] = useState(null);
  const [userAnchorEl, setUserAnchorEl] = useState(null);

  const handleOpenLangMenu = (event) => setLangAnchorEl(event.currentTarget);
  const handleCloseLangMenu = () => setLangAnchorEl(null);

  const handleOpenUserMenu = (event) => setUserAnchorEl(event.currentTarget);
  const handleCloseUserMenu = () => setUserAnchorEl(null);

  const { logout } = useAuth ();

  const handleProfileClick = () => {
    navigate('/userprofile'); // Navigate to your user profile page
    handleCloseUserMenu();
  };

  const handleLanguageChange = (lang) => {
    switchLanguage(lang);
    localStorage.setItem('language', lang);
    handleCloseLangMenu();
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' },
  ];

  /*########################### Search ###########################*/
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const searchData = useCallback(() => {
    if (inputValue.length < 2) return;
    setLoading(true);
    axiosInstance
      .get(`projects/search?query=${inputValue}`)
      .then((response) => {
        if (response.data) setOptions(response.data);
      })
      .catch((error) => console.error('Error fetching data:', error))
      .finally(() => setLoading(false));
  }, [inputValue, axiosInstance]);

  useEffect(() => {
    searchData();
  }, [searchData]);

  return (
    <Box sx={{ display: 'flex' }}>
{/* <MuiAppBar sx={{minHeight:300}} color="inherit" position="fixed" open={open} elevation={0}> */}
    <MuiAppBar color="inherit" position="fixed" open={open} elevation={0}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left Section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Center Search */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Autocomplete
              freeSolo
              options={options}
              getOptionLabel={(option) => option.name || option}
              onInputChange={(e, newInputValue) => setInputValue(newInputValue)}
              loading={loading}
              renderInput={(params) => (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#f7f7f7",
                    border: "1px solid #ddd",
                    borderRadius: 1,
                    px: 1,
                    py: 0.5,
                    minWidth: 190,
                    maxWidth: "80vw",
                    "@media (min-width: 1200px)": { minWidth: 500 },
                  }}
                >
                  <SearchIcon sx={{ color: "gray", mr: 1 }} />
                  <TextField
                    {...params}
                    placeholder={t.search}
                    variant="standard"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true,
                      endAdornment: (
                        <>
                          {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                </Box>
              )}
            />
          </Box>

          {/* Right Section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
     
            {/* Profile Menu */}
            <IconButton color="inherit" onClick={handleOpenUserMenu}>
              <Person />
            </IconButton>
            <Menu
              anchorEl={userAnchorEl}
              open={Boolean(userAnchorEl)}
              onClose={handleCloseUserMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleProfileClick}>
                <Person fontSize="small" sx={{ mr: 1 }} /> Profile
              </MenuItem>
              <MenuItem onClick={logout}>
                <Logout fontSize="small" sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </MuiAppBar>
    </Box>
  );
};

export default Header;
