import { useState } from 'react';
import {
  Card,
  CardContent,
  Button,
  CssBaseline,
  TextField,
  Link,
  Box,
  Container,
  Stack,
  Typography,
  ThemeProvider,
  InputAdornment,
  IconButton,
  LinearProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthProvider';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import theme from '../../theme/theme';
import authService from '../Auth/authService';

const Copyright = () => (
  <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'none', marginTop: '20px' }} align="center">
    <Link color="inherit" href="#" sx={{ textDecoration: 'none' }}>
      ProjeXion
    </Link>{' @ '}
    {new Date().getFullYear()}
    {' - v2.0.0'}
  </Typography>
);

const Login = () => {
  const { login } = useAuth(); // memory-only login
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleLogin = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({}); // reset form errors
    try {
      const data = await authService.loginService(formData.username, formData.password);
      if (data?.accessToken) {
        login(data.accessToken); // store JWT in memory
        sessionStorage.setItem("userEmail", formData.username);
        navigate('/dashboard');
      } else {
        setErrors({ form: 'Login failed, please try again' });
      }
    } catch (error) {
      setErrors({ form: 'Invalid username or password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="login-background">
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img
              src='/static/images/logo.png'
              alt="Logo"
              style={{  }}
            />
            <Card sx={{ minWidth: 375, marginTop: 5, mx: 2 }}>
              {loading && <LinearProgress color="primary" />}
              <CardContent>
                <Stack alignItems="left" justifyContent="center" spacing={3} marginLeft={2}>
                  <Typography variant="h5" fontWeight="bold" sx={{ paddingTop: 2 }}>
                    Sign In
                  </Typography>
                  <Typography variant="caption" fontSize="16px" textAlign="left">
                    Enter your credentials to continue
                  </Typography>
                </Stack>
                <Box sx={{ mt: 1, mx: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    color="primary"
                    id="username"
                    name="username"
                    label="Email"
                    value={formData.username}
                    error={!!errors.username}
                    helperText={errors.username}
                    onChange={handleChange}
                    autoFocus
               />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    color="primary"
                    name="password"
                    id="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    error={!!errors.password}
                    helperText={errors.password}
                    onChange={handleChange}
                    // autoComplete="current-password"
                
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {errors.form && <Box sx={{ color: 'error.main' }}>{errors.form}</Box>}
                  <Button
                    onClick={handleLogin}
                    color="primary"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{ mt: 4 }}
                    disabled={loading}
                  >
                    Sign In
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Copyright sx={{ mt: 4, mb: 4 }} />
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;