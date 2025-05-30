import React from 'react';
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ allowedRoles }) => {
  const { user } = useContext(AuthContext);

  console.log("🔐 PrivateRoute Debug:");
  console.log("Current user:", user);
  console.log("User type:", user?.userType);
  console.log("Allowed roles:", allowedRoles);

  if (!user) {
    console.log("No user found, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  if (!user.userType) {
    console.warn("User type is undefined or missing, redirecting to /unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  if (!allowedRoles.includes(user.userType)) {
    console.log(`User type ${user.userType} not in allowed roles, redirecting to /unauthorized`);
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;