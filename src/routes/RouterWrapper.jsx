import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from '../page/HomePage';
import LogIn from '../page/LogIn';
import Register from '../page/Register';
import ForgotPassword from '../page/ForgotPassword';
import ResetPassword from '../page/ResetPassword';
import HotelsPage from '../page/HotelsPage';
function RouterWrapper() {

    const router = createBrowserRouter([
    {
      path: "/login",
      element: (
        // <PublicRoute>
          <LogIn />
        // </PublicRoute>
      ),
    },
    {
      path: "/register",
      element: (
        // <PublicRoute>
          <Register />
        // </PublicRoute>
      ),
    },
    {
      path: "/forgot-password",
      element: (
        // <PublicRoute>
          <ForgotPassword />
        /* </PublicRoute> */
      ),
    },
    {
      path: "/reset-password",
      element: (
        // <PublicRoute>
          <ResetPassword />
        /* </PublicRoute> */
      ),
    },
  ]);


  return <RouterProvider router={router}/>
}

export default RouterWrapper
