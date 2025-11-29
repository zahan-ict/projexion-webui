import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Paper,
  Divider,
  Grid,
  Typography,
  TextField,
  InputAdornment
} from '@mui/material';

import { Add, RotateLeft, Search } from '@mui/icons-material';

const Ribbon = (
  { addElement,
    refreshElement,
     onSearch,
    route }) => {

  return (
    <Box sx={{ mb: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={4} sm={4}>
          <Typography color="secondary.dark" className='topTitle'>{route.charAt(0).toUpperCase() + route.slice(1)} </Typography>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Paper elevation={1} sx={{
            display: 'flex',
            width: 'fit-content',
            marginLeft: 'auto',
            maxWidth: { xs: '100%', sm: 'fit-content' }, // Full width on xs, fit-content otherwise
            overflowX: { xs: 'auto', sm: 'visible' } // Enable scroll only on xs

          }}>
            <List style={{ display: 'flex', flexDirection: 'row' }} dense disablePadding>
              {/* Add */}
              <ListItem disableGutters disablePadding>
                <ListItemButton onClick={addElement} disabled={route === "epaper"}   >
                  <ListItemIcon sx={{ minWidth: 0 }} size="large" aria-label="link">
                    <Add color='primary' />
                  </ListItemIcon>
                  <ListItemText primary="Add" />
                </ListItemButton>
              </ListItem>

              <Divider orientation="vertical" flexItem />
              {/* Refresh */}
              <ListItem disablePadding>
                <ListItemButton onClick={refreshElement}>
                  <ListItemIcon sx={{ minWidth: 0 }} >
                    <RotateLeft color='primary' />
                  </ListItemIcon>
                  <ListItemText primary="Refresh" />
                </ListItemButton>
              </ListItem>
              <Divider orientation="vertical" flexItem />
               {/* Search Input */}
              <ListItem disablePadding>
                <ListItemButton sx={{ width: 260, p:0, m:0 }}>
                  <TextField
                    fullWidth
                    size="small"
                    variant="standard"
                    placeholder="Suchen..."
                    onChange={(e) => onSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="end">
                          <Search fontSize="small" />
                        </InputAdornment>
                      ),
                      sx: { backgroundColor: "#fff" },
                    }}
                  />
                </ListItemButton>
              </ListItem>

            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Ribbon;
