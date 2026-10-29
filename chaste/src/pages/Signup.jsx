import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SiteNav from "../components/SiteNav";
import { LOGGED_IN_USER_KEY, PROFILE_KEY } from "../data/products";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [securityQuestion, setSecurityQuestion] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    async function handleSignup(event) {
        event.preventDefault();
        if (password !== passwordConfirmation) {
            setError("Your passwords do not match.");
            return;
        }

        setError("");
        setIsSubmitting(true);

        try {
            const apiUrl = import.meta.env.VITE_PHP_API_URL || "http://localhost/chaste_app/backend/php";
            const response = await fetch(`${apiUrl}/register.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    password,
                    security_question: securityQuestion,
                    security_answer: securityAnswer,
                }),
            });
            const result = await response.json();

            if (!response.ok) {
                if (response.status === 409) {
                    throw new Error("This email is already registered. Please log in.");
                }
                throw new Error(result.error || "Unable to create your account.");
            }

            const profile = result.user;
            localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
            localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(profile));
            const destination = location.state?.from?.pathname || "/account";
            navigate(destination, {
                replace: true,
                state: { welcomeName: profile.name, email: profile.email },
            });
        } catch (signupError) {
            setError(signupError.message || "Could not connect to the registration service.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="page landing-page brand-page auth-brand-page">
            <SiteNav />

            <main className="form-wrap">
                <h2>Create Account</h2>
                <form onSubmit={handleSignup}>
                    <input
                        type="text"
                        placeholder="Full name"
                        autoComplete="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        minLength={8}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm password"
                        autoComplete="new-password"
                        value={passwordConfirmation}
                        onChange={(event) => setPasswordConfirmation(event.target.value)}
                        minLength={8}
                        required
                    />
                    <label htmlFor="security-question">Security question</label>
                    <select
                        id="security-question"
                        value={securityQuestion}
                        onChange={(event) => setSecurityQuestion(event.target.value)}
                        required
                    >
                        <option value="">Choose a question</option>
                        <option value="What was the name of your first school?">What was the name of your first school?</option>
                        <option value="What city were you born in?">What city were you born in?</option>
                        <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                    </select>
                    <label htmlFor="security-answer">Security answer</label>
                    <input
                        id="security-answer"
                        type="text"
                        autoComplete="off"
                        value={securityAnswer}
                        onChange={(event) => setSecurityAnswer(event.target.value)}
                        required
                    />
                    {error && <p className="auth-error" role="alert">{error}</p>}
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating Account..." : "Create Account"}
                    </button>
                </form>
                <p className="auth-switch">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </main>
        </div>
    );
}

export default Signup;