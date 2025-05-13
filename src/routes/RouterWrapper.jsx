import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from '../page/HomePage';
import LogIn from '../page/LogIn';
import Register from '../page/Register';
import ForgotPassword from '../page/ForgotPassword';
import ResetPassword from '../page/ResetPassword';
<<<<<<< HEAD
import HotelsPage from '../page/HotelsPage';
function RouterWrapper() {
=======
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

function RouterWrapper() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: 
      <>
        <HomePage />
        </>,
    },
    {
      path: "/login",
      element: 
      <PublicRoute>
        <LogIn />
        </PublicRoute>,
    },
    {
      path: "/register",
      element: 
      <PublicRoute>
        <Register />
      </PublicRoute>,
    },
    {
      path: "/forgot-password",
      element: 
      <PublicRoute>
        <ForgotPassword />
        </PublicRoute>,
    },
    {
      path: "/reset-password",
      element: 
      <PublicRoute>
        <ResetPassword />
        </PublicRoute>,

    },
  ]);
>>>>>>> edb19bfd07aadd79c90f5ff23bb121e38ee28ea4

    const router = createBrowserRouter([
        {
            path: "/",
            element: <HomePage/>
        },
        {
          path: "/login",
          element: <LogIn/>
        },
        {
          path: "/register",
          element: <Register/>
        },
        {
        path: "/forgot-password",
        element: <ForgotPassword />,
        },
        {
        path: "/reset-password",
        element: <ResetPassword />,
        },
        {
        path: "/hotels",
        element: <HotelsPage />,
        },
        
     ]);

  return <RouterProvider router={router}/>
}

export default RouterWrapper
