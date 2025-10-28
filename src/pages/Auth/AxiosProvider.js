import { createContext, useContext, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from './AuthProvider';

const apiUrl = process.env.REACT_APP_API_URL;
const AxiosContext = createContext();
export const useAxiosInstance = () => useContext(AxiosContext);

export const AxiosProvider = ({ children }) => {
  const { token, login, logout } = useAuth();

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: apiUrl,
      withCredentials: true, // refresh token cookie
    });

     // Attach access token to each request
    instance.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry  && !originalRequest.url.includes('/auth/refresh')) {
          originalRequest._retry = true;
          try {
            // Attempt refresh token
             const response = await instance.post('/auth/refresh', {}, { withCredentials: true });

            if (response.status === 200) {
              login(response.data.accessToken);
              originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
              return instance(originalRequest);
            }
          } catch {
            logout(); // refresh failed → redirect to login
          }
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, [token, login, logout]);

  return <AxiosContext.Provider value={{ axiosInstance }}>{children}</AxiosContext.Provider>;
};
