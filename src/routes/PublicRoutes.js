import { lazy } from 'react';
import {Navigate, Route, Routes } from 'react-router-dom';
import Loadable from '../components/Loadable';

const Login = Loadable(lazy(() => import('../pages/Auth/Login')));
const LandingPage = Loadable(lazy(() => import('../pages/Landing/info')));
// const Register = Loadable(lazy(() => import('../pages/Auth/Register')));

const PublicRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
                 <Route path="/info" element={<LandingPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
            {/* <Route path="/register" element={<Register />} /> */}
        </Routes>
    );
};

export default PublicRoutes;