import {
  Typography,
  Box,
  Paper
} from '@mui/material';

const Contact = () => {
  return (
   
     <Box>
      <Typography color="secondary.dark" className='topTitle'>Kontakt</Typography>
        <Paper sx={{ transition: 'height 0.3s ease', mt:2, p:2 }}>
        Kontakt
      </Paper>
    </Box>
  )
}

export default Contact