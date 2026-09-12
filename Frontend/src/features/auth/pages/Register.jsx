import React, { useState } from "react";
import "../auth.form.scss";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import RunningLoader from "../../interview/pages/components/RunningLoader";

const Register = () => {
    const { loading, handleRegister } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();

        if (!trimmedUsername || !trimmedEmail || !password) {
            setError("Please fill in all fields.");
            return;
        }

        if (trimmedUsername.length < 3) {
            setError("Username must be at least 3 characters long.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await handleRegister({
                username: trimmedUsername,
                email: trimmedEmail,
                password
            });
            if (result.success) {
                navigate("/", { replace: true });
            } else {
                setError(result.error || "Registration failed. Please try again.");
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
                <h1>Create Account</h1>
                <p className="auth-subtitle">Join us to practice and ace your tech interviews</p>

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
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                if (error) setError("");
                            }}
                            placeholder="e.g. alexdev"
                            autoComplete="username"
                            disabled={isSubmitting}
                            required
                        />
                    </div>

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
                            placeholder="Minimum 6 characters"
                            autoComplete="new-password"
                            disabled={isSubmitting}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="button primary-button auth-submit-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating account..." : "Register"}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </main>
    );
};

export default Register;