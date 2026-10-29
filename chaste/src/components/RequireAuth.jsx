import { Navigate, useLocation } from "react-router-dom";
import { isUserLoggedIn } from "../data/products";

function RequireAuth({ children }) {
    const location = useLocation();
    if (!isUserLoggedIn()) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}

export default RequireAuth;
