// src/components/ProtectedRouteForAdmin.jsx
import { Navigate } from "react-router-dom";

const ProtectedRouteForAdmin = ({ children }) => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) return <Navigate to="/login" replace />;

  const admin = JSON.parse(storedUser);

  if (admin?.user?.email === "admin@allmart.com") return children;

  return <Navigate to="/login" replace />;
};

export default ProtectedRouteForAdmin;
