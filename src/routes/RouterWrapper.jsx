import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import HomePage from "../page/HomePage";
import LogIn from "../page/LogIn";
import Register from "../page/Register";
import ForgotPassword from "../page/ForgotPassword";
import ResetPassword from "../page/ResetPassword";
import PublicRoute from "./PublicRoute";
import HomeListPage from "../page/HotelListPage";
import AboutUs from "../page/AboutUs";
import HotelDetail from "../page/HotelDetail";
import ManageUsers from "../component/ManageUsers";
import ManageHotels from "../component/ManageHotels";
import ManageBookings from "../component/ManageBookings";
import AdminProfile from "../component/AdminProfile";
import Dashboard from "../page/Dashboard";
import AdminDashboard from "../component/AdminDashboard";
import DestinationsPage from "../page/DestinationsPage";
import ProvinceHotelsPage from "../page/ProvinceHotelsPage";
import HotelCreateForm from "../component/HotelCreateForm";

function RouterWrapper() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Outlet />,
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
          path: "destinations",
          element: <DestinationsPage />,
        },
        {
          path: "home-list",
          element: <Outlet />,
          children: [
            { path: "", element: <HomeListPage /> },
            { path: ":id", element: <HotelDetail /> },
          ],
        },
        {
          path: "dashboard",
          element: (
            <Dashboard>
              <Outlet />
            </Dashboard>
          ),
          children: [
            { path: "", element: <AdminDashboard /> },
            { path: "users", element: <ManageUsers /> },
            { path: "hotels", element: <ManageHotels /> },
            { path: "bookings", element: <ManageBookings /> },
            { path: "profile", element: <AdminProfile /> },
            { path: "hotels/create", element: <HotelCreateForm /> },
          ],
        },
        {
          path: "province/:provinceName",
          element: <ProvinceHotelsPage />,
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