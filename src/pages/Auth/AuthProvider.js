import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../Auth/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null); // memory-only access token
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // login: store token in memory and set logged-in state
  const login = useCallback((newToken) => {
    setToken(newToken);
    setIsLoggedIn(true);
    // Clear logout flag. 
    document.cookie = 'loggedOut=; path=/; max-age=0'
  }, []);

  // logout: call authService, clear memory, navigate to login
  const logout = useCallback(async () => {
    try {
      await authService.logoutService(); // call centralized logout API
    } catch {
      // silently fail, no console error
    } finally {
      setToken(null);
      setIsLoggedIn(false);
      // Set logout flag for other tabs
      document.cookie = 'loggedOut=true; path=/; max-age=300';
      navigate('/login');
    }
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ token, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// hook to use auth context
export const useAuth = () => useContext(AuthContext);
