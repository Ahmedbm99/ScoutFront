import React from 'react';
import { Navigate } from "react-router-dom";
import SignIn from './pages/SignIn/SignIn';
import Home from './pages/Home/Home1'; // Page admin
import AuthenticationService from './services/AuthenticationService';

const PrivateRoute = ({ adminOnly = false, userOnly = false, element }) => {
  const currentUser = AuthenticationService.getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  const isAdmin = currentUser?.user?.isAdmin;

  if (adminOnly && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  if (userOnly && isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return element;
};

export const routes = [
  {
    path: '/',
    element: <SignIn />,
    exact: true,
  },
  {
    path: '/home',
    element: (
      <PrivateRoute  element={<Home />} />
    ),
    exact: true,
  },
];
