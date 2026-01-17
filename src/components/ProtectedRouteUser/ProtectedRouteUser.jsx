// src/components/ProtectedRouteUser.jsx
import { Navigate } from "react-router-dom";

const ProtectedRouteUser = ({ children }) => {
  try {
    const userData = JSON.parse(localStorage.getItem("user"));

    // ✅ Check if the logged-in user has a valid UID
    if (userData?.user?.uid) {
      return children;
    } else {
      return <Navigate to="/login" replace />;
    }
  } catch (err) {
    // If JSON parsing fails or user not found, redirect to login
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRouteUser;
