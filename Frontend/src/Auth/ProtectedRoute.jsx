// ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Loader from "@/components/Loader/Loader";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, checked } = useAuth();
    if (!checked)  return <div className="flex justify-center items-center h-screen"><Loader /></div>
    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return children;
};

export default ProtectedRoute;
