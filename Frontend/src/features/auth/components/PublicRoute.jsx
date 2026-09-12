import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import RunningLoader from "../../interview/pages/components/RunningLoader";

const PublicRoute = ({ children }) => {
    const { loading, user } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <main>
                <RunningLoader />
            </main>
        );
    }

    if (user) {
        const destination = location.state?.from?.pathname || "/";
        return <Navigate to={destination} replace />;
    }

    return children;
};

export default PublicRoute;
