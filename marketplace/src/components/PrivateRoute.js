import { Navigate } from "react-router-dom";
import {useAuth} from "../hooks/useAuth";
import { useState, useEffect } from "react";

function PrivateRoute({ children }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user !== undefined) {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return <p>Cargando...</p>; 
    }

    return user ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
