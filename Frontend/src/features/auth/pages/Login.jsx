import React, { useState } from "react";
import "../auth.form.scss";
import { useNavigate, useLocation, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import RunningLoader from "../../interview/pages/components/RunningLoader";

const Login = () => {
    const { loading, handleLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const trimmedEmail = email.trim();
        if (!trimmedEmail || !password) {
            setError("Please fill in both email and password.");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await handleLogin({ email: trimmedEmail, password });
            if (result.success) {
                const destination = location.state?.from?.pathname || "/";
                navigate(destination, { replace: true });
            } else {
                setError(result.error || "Login failed. Please check your credentials.");
            }
        } catch (err) {
            setError(err.message || "An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <main>
                <RunningLoader />
            </main>
        );
    }

    return (
        <main>
            <div className="form-container">
                <h1>Welcome Back</h1>
                <p className="auth-subtitle">Sign in to continue your interview preparation</p>

                {error && (
                    <div className="auth-error-banner" role="alert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (error) setError("");
                            }}
                            placeholder="you@example.com"
                            autoComplete="email"
                            disabled={isSubmitting}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (error) setError("");
                            }}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            disabled={isSubmitting}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="button primary-button auth-submit-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Signing in..." : "Login"}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </main>
    );
};

export default Login;