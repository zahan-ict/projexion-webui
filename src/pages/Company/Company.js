import {
  Typography,
  Box,
  Paper
} from '@mui/material';

const Company = () => {
  return (
  
    <Box>
      <Typography color="secondary.dark" className='topTitle'>Firma Erstellen</Typography>
      <Paper sx={{ transition: 'height 0.3s ease', mt:2, p:2 }}>
        Projekt
      </Paper>
    </Box>
    
  )
}

export default Company