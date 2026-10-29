import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SiteNav from "../components/SiteNav";
import { LOGGED_IN_USER_KEY, PROFILE_KEY } from "../data/products";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || result.error || "Unable to sign in.");
      }

      localStorage.setItem(PROFILE_KEY, JSON.stringify(result.user));
      localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(result.user));
      const destination = location.state?.from?.pathname || "/account";
      navigate(destination, {
        replace: true,
        state: { welcomeName: result.user.name, email: result.user.email },
      });
    } catch (loginError) {
      setError(loginError.message || "Could not connect to the login service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page landing-page brand-page auth-brand-page">
      <SiteNav />

      <div className="form-wrap">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <p className="auth-switch">
          New to CHASTE? <Link to="/signup">Create an account</Link>
        </p>
        <p className="auth-switch">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;