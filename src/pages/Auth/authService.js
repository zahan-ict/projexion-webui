// /pages/Auth/authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
let inMemoryToken = null; // store JWT in memory only

// Create a base axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // allows sending refresh token cookie
});

// ---------------- login functions -----------------
export const loginService = async (username, password) => {
   const response = await api.post('/auth/login',
        new URLSearchParams({
          username: username.toLowerCase(),
          password: password
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          withCredentials: true
        }
      );
  inMemoryToken = response.data.accessToken; // store JWT in memory
  return response.data;
};

// ---------------- logout functions -----------------
export const logoutService = async () => {
  try {
    await api.post('/auth/logout');
  } catch {}
  inMemoryToken = null;
};

export const refreshTokenService = async () => {
  try {
    const response = await api.post('/auth/refresh');
    inMemoryToken = response.data.accessToken;
    return inMemoryToken;
  } catch (err) {
    inMemoryToken = null;
    throw err;
  }
};

export const getAccessToken = () => inMemoryToken;

const authService =  {
  loginService,
  logoutService,
  refreshTokenService,
  getAccessToken
};
export default authService;