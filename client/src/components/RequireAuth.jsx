import { useIsAuthenticated } from "@azure/msal-react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";

const RequireAuth = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning("You must be signed in to access this page.");
    }
  }, [isAuthenticated, location.pathname]);

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default RequireAuth;
