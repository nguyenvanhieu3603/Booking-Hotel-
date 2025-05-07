import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from '../page/HomePage';
import LogIn from '../page/LogIn';
import Register from '../page/Register';

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
        }     
    ]);

  return <RouterProvider router={router}/>
}

export default RouterWrapper
