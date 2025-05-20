import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from '../page/HomePage';
import LogIn from '../page/LogIn';
import Register from '../page/Register';
import ForgotPassword from '../page/ForgotPassword';
import ResetPassword from '../page/ResetPassword';
import HotelsPage from '../page/HotelsPage';
function RouterWrapper() {

<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes

  return <RouterProvider router={router}/>
}

export default RouterWrapper
