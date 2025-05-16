import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import HomePage from "../page/HomePage";
import LogIn from "../page/LogIn";
import Register from "../page/Register";
import ForgotPassword from "../page/ForgotPassword";
import ResetPassword from "../page/ResetPassword";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import HomeListPage from "../page/HotelListPage";
import AboutUs from "../page/AboutUs";
import HotelDetail from "../page/HotelDetail";

function RouterWrapper() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Outlet />
        </>
      ),
      children: [
        {
          path: "",
          element: <HomePage />,
        },
        {
          path: "about-us",
          element: <AboutUs />,
        },
        {
          path: "/home-list",
          element: <Outlet/>,
          children: [
            {path: "", element: <HomeListPage />},
            {path: ":id", element: <HotelDetail />},]
        },
      ],
    },

    {
      path: "/login",
      element: (
        <PublicRoute>
          <LogIn />
        </PublicRoute>
      ),
    },
    {
      path: "/register",
      element: (
        <PublicRoute>
          <Register />
        </PublicRoute>
      ),
    },
    {
      path: "/forgot-password",
      element: (
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      ),
    },
    {
      path: "/reset-password",
      element: (
        <PublicRoute>
          <ResetPassword />
        </PublicRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default RouterWrapper;
