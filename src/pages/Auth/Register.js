import React, { useState } from 'react';
import {
  Divider,
  Stack,
  Typography,
  Alert,
  Snackbar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Container,
  Card,
  CardContent
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import axios from 'axios';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      <Link color="inherit" href="#" sx={{ textDecoration: 'none' }}>
        Nexinx Inc
      </Link>{' @ '}
      {new Date().getFullYear()}
      {','} v1.0.0
    </Typography>
  );
}

const defaultTheme = createTheme();
const apiUrl = process.env.REACT_APP_API_URL;

const Register = () => {
  // 
  const [formData, setFormData] = useState({});
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      setLoading(true); // Set loading to false after request completes
      try {
        const response = await axios.post(`${apiUrl}/auth/register`, formData);
        if (response.data === 409) {
          setErrors({ userEmail: 'Email address already in use' });
        } else if (response.status === 201) {
          setOpen(true);
          resetRegistration();
        } else {
          console.log('Unexpected response:', response);
        }
      } catch (error) {
        console.log(error)
      }  finally {
        setLoading(false); // Set loading to false after request completes
      }
    } else {
      setErrors(formErrors);
    }
  };

  /*###################################### Valid form #######################################*/
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    if (!formData.userFirstName) newErrors.userFirstName = 'Fristname is required';
    if (!formData.userLastName) newErrors.userLastName = 'Lastname is required';
    if (!formData.userEmail) newErrors.userEmail = 'Email is required because it will be used as  username';
    if (!formData.userPass) newErrors.userPass = 'Password is required';
    return newErrors;
  };
  /*###################################### Close Alert #######################################*/
  const [open, setOpen] = useState(false);
  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  /*###################################### Reset Form #######################################*/
  const resetRegistration = () => {
    setFormData({
      userFirstName: '',
      userLastName: '',
      userEmail: '',
      userPass: '',
    });
    setErrors({});
  };

  /*###################################### Show Loading #######################################*/
  const [loading, setLoading] = useState(false); 

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant='h4' color="GrayText" fontWeight={"bold"}>
            Nexinx
          </Typography>
          <Card sx={{ minWidth: 375,  marginTop: 3 }}>
          {loading && <LinearProgress />}
            <CardContent>
              <Stack alignItems="left" justifyContent="left" spacing={3}>
                <Typography component="h1" variant="h5" fontWeight={"bold"}>
                  Sign up
                </Typography>
                <Typography variant="caption" fontSize="16px" textAlign={'left'}>
                  Fill this form with your personal information
                </Typography>
              </Stack>
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      margin='normal'
                      color="success"
                      name="userFirstName"
                      value={formData.userFirstName || ''}
                      error={!!errors.userFirstName}
                      helperText={errors.userFirstName}
                      onChange={handleChange}
                      required
                      fullWidth
                      id="userFirstName"
                      label="First Name"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      margin='normal'
                      color="success"
                      name="userLastName"
                      label="Last Name"
                      error={!!errors.userLastName}
                      value={formData.userLastName || ''}
                      helperText={errors.userLastName}
                      onChange={handleChange}
                      autoComplete="family-name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="userEmail"
                      color="success"
                      value={formData.userEmail || ''}
                      error={!!errors.userEmail}
                      helperText={errors.userEmail}
                      id="userEmail"
                      label="Email Address"
                      onChange={handleChange}
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="userPass"
                      color="success"
                      value={formData.userPass || ''}
                      error={!!errors.userPass}
                      helperText={errors.userPass}
                      onChange={handleChange}
                      label="Password"
                      type="password"
                      id="userPass"
                      autoComplete="password"
                    />
                  </Grid>
                </Grid>
                {errors.form && <div style={{ color: 'red' }}>{errors.form}</div>}
                <Button onClick={handleSubmit} color="success" size="large" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  Sign Up
                </Button>
                <Divider />
                <Box
                  sx={{
                    marginTop: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <NavLink to={'/'} className="no-underline" >
                    {"Already have an account?"}
                  </NavLink>
                </Box>
              </Box>

              <Snackbar
                open={open}
                autoHideDuration={4000}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                onClose={closeSnackbar}
              >
                <Alert
                  onClose={closeSnackbar}
                  severity="success"
                  variant="filled"
                  sx={{ width: '100%' }}>
                  New User Register Successfully
                </Alert></Snackbar>
            </CardContent>
          </Card>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
export default Register