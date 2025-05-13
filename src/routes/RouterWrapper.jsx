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
