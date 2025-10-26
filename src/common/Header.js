import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  Toolbar,
  AppBar,
  Box,
  Menu,
  MenuItem,
  IconButton,
  TextField,
} from '@mui/material';
import {
  Search as SearchIcon,
  Logout,
  Menu as MenuIcon,
  Person,
} from '@mui/icons-material';
import { useLanguage } from '../language/LanguageContext';
import { useAxiosInstance } from '../pages/Auth/AxiosProvider';
import { useAuth } from '../pages/Auth/AuthProvider';
import { useSearch } from './SearchContext';

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
  const { logout } = useAuth();
  const { searchTerm, setSearchTerm, triggerSearch } = useSearch();

  // Menu states
  const [langAnchorEl, setLangAnchorEl] = useState(null);
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const [inputValue, setInputValue] = useState(searchTerm);

  // Menu handlers
  const handleOpenUserMenu = (event) => setUserAnchorEl(event.currentTarget);
  const handleCloseUserMenu = () => setUserAnchorEl(null);

  const handleProfileClick = () => {
    navigate('/userprofile');
    handleCloseUserMenu();
  };

  /*########################### Search ###########################*/
  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleSearchClick = () => {
    setSearchTerm(inputValue.trim());
    triggerSearch(); // manually trigger search
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearchClick(); // press Enter to search
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <MuiAppBar color="inherit" position="fixed" open={open} elevation={0}>
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* === Left Section === */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          </Box>

          {/* === Center Search Bar === */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f7f7f7',
                border: '1px solid #ddd',
                borderRadius: 3,
                px: 1,
                py: 0.3,
                minWidth: 200,
                maxWidth: '60vw',
                transition: 'all 0.3s ease',
                '&:focus-within': {
                  backgroundColor: '#fff',
                  borderColor: '#1976d2',
                  minWidth: 450, // expands on focus
                  boxShadow: '0 0 5px rgba(25, 118, 210, 0.3)',
                },
              }}
            >
              <SearchIcon sx={{ color: 'gray', mr: 1 }} />
              <TextField
                placeholder="Suche..."
                variant="standard"
                fullWidth
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: '0.95rem' },
                }}
              />
              <IconButton
                onClick={handleSearchClick}
                color="primary"
                sx={{
                  ml: 0.5,
                  backgroundColor: '#1d1f21ff',
                  color: 'white',
                  '&:hover': { backgroundColor: '#1565c0' },
                  transition: 'all 0.3s ease',
                }}
              >
                <SearchIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* === Right Section === */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
