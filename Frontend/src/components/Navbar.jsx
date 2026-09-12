import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../features/auth/hooks/useAuth";
import "../style/navbar.scss";

const Navbar = () => {
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const onLogoutClick = async () => {
        setIsLoggingOut(true);
        try {
            await handleLogout();
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const initial = user?.username ? user.username.charAt(0).toUpperCase() : "U";

    return (
        <header className="app-navbar">
            <div className="app-navbar__container">
                <Link to="/" className="app-navbar__brand">
                    <span className="brand-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2a8 8 0 0 0-8 8c0 3.3 2 6.2 5 7.4V20a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2.6c3-1.2 5-4.1 5-7.4a8 8 0 0 0-8-8z" />
                            <line x1="9.5" y1="9" x2="9.51" y2="9" />
                            <line x1="14.5" y1="9" x2="14.51" y2="9" />
                        </svg>
                    </span>
                    <span>Interview<span className="brand-highlight">AI</span></span>
                </Link>

                <div className="app-navbar__right">
                    {user && (
                        <div className="app-navbar__user-badge" title={`Signed in as ${user.email || user.username}`}>
                            <div className="user-avatar">{initial}</div>
                            <span className="username">{user.username}</span>
                        </div>
                    )}

                    <button
                        onClick={onLogoutClick}
                        className="app-navbar__logout-btn"
                        disabled={isLoggingOut}
                        title="Sign out of your account"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
