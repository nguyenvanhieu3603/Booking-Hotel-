import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '../page/HomePage';
import LogIn from '../page/LogIn';
import Register from '../page/Register';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

function RouterWrapper() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <><HomePage /></>,
    },
    {
      path: "/login",
      element: <LogIn />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default RouterWrapper;