import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  return user && user.token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;