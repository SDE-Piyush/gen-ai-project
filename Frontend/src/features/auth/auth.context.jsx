/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from "react";
import { getMe, login, register, logout } from "./services/auth.api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem("user");
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const checkAuthStatus = async () => {
            try {
                const data = await getMe();
                if (isMounted && data && data.user) {
                    setUser(data.user);
                    localStorage.setItem("user", JSON.stringify(data.user));
                }
            } catch {
                if (isMounted) {
                    setUser(null);
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        checkAuthStatus();

        const handleUnauthorized = () => {
            setUser(null);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        };

        window.addEventListener("auth:unauthorized", handleUnauthorized);

        return () => {
            isMounted = false;
            window.removeEventListener("auth:unauthorized", handleUnauthorized);
        };
    }, []);

    const handleLogin = useCallback(async ({ email, password }) => {
        try {
            const data = await login({ email, password });
            if (data && data.user) {
                setUser(data.user);
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }
                localStorage.setItem("user", JSON.stringify(data.user));
                return { success: true };
            }
            return { success: false, error: "Invalid server response" };
        } catch (err) {
            return { success: false, error: err.message || "Login failed" };
        }
    }, []);

    const handleRegister = useCallback(async ({ username, email, password }) => {
        try {
            const data = await register({ username, email, password });
            if (data && data.user) {
                setUser(data.user);
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }
                localStorage.setItem("user", JSON.stringify(data.user));
                return { success: true };
            }
            return { success: false, error: "Invalid server response" };
        } catch (err) {
            return { success: false, error: err.message || "Registration failed" };
        }
    }, []);

    const handleLogout = useCallback(async () => {
        try {
            await logout();
        } catch (err) {
            console.warn("Logout request failed:", err);
        } finally {
            setUser(null);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                isAuthenticated: !!user,
                handleLogin,
                handleRegister,
                handleLogout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};