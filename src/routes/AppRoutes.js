import { useEffect, useState } from 'react';
import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './PrivateRoutes';
import { useAuth } from '../pages/Auth/AuthProvider';
import authService from '../pages/Auth/authService';

const AppRoutes = () => {
  const { isLoggedIn, login, logout } = useAuth();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedOut = document.cookie.includes('loggedOut=true');
      if (isLoggedOut) {
        setCheckingAuth(false);
        return;
      }

      try {
        const token = await authService.refreshTokenService();
        if (token) {
          login(token);
        } else {
          logout();
        }
      } catch {
        logout();
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [login, logout]);

  if (checkingAuth) return;

  return isLoggedIn ? <PrivateRoutes /> : <PublicRoutes />;
};

export default AppRoutes;
