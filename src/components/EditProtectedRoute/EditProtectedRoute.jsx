import { Navigate } from "react-router-dom";

const EditProtectedRoute = ({ children }) => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return <Navigate to="/" replace />;
  }

  try {
    JSON.parse(storedUser);
    return children;
  } catch (error) {
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }
};

export default EditProtectedRoute;