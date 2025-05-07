import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/ContextData";


const ProtectedRoute = ({ children }) => {
  const { isAuth } = useContext(AppContext);

  if (isAuth == false) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;