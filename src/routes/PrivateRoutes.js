import { lazy, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Loadable from '../components/Loadable';
import { useAuth } from '../pages/Auth/AuthProvider';
import authService from '../pages/Auth/authService';

const Dashboard = Loadable(lazy(() => import('../pages/Dashboard/Dashboard')));
const Project = Loadable(lazy(() => import('../pages/Project/Project')));

const Company = Loadable(lazy(() => import('../pages/Company/Company')));
const Contact = Loadable(lazy(() => import('../pages/Contact/Contact')));


const User = Loadable(lazy(() => import('../pages/User/User')));
const Role = Loadable(lazy(() => import('../pages/User/Role')));

const UserProfile = Loadable(lazy(() => import('../pages/User/UserProfile')));
const Main = Loadable(lazy(() => import('../common/Main'))); // Main component

const PrivateRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, login, logout } = useAuth();
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Refresh token when mounting private routes
  useEffect(() => {
    const refreshAuth = async () => {
      try {
        const token = await authService.refreshTokenService();
        if (token) login(token);
        else logout();
      } catch {
        logout();
      } finally {
        setCheckingAuth(false);
      }
    };

    // Only refresh if user is not logged in yet
    if (!isLoggedIn) refreshAuth();
    else setCheckingAuth(false);
  }, [isLoggedIn, login, logout]);

  // Navigate to persisted route if coming from login
  useEffect(() => {
    const storedRoute = sessionStorage.getItem('selectedRoute') || '/dashboard';
    if (location.pathname === '/login') {
      navigate(storedRoute);
    }
  }, [location.pathname, navigate]);

  // Store current route in sessionStorage
  useEffect(() => {
    sessionStorage.setItem('selectedRoute', location.pathname);
  }, [location.pathname]);

  if (checkingAuth) return <div>Loading...</div>; // show loading while refreshing token

  return (
    <Main>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project" element={<Project />} />
        <Route path="/company" element={<Company />} />
         <Route path="/contact" element={<Contact />} />
        <Route path="/user" element={<User />} />
      
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Main>
  );
};

export default PrivateRoutes;