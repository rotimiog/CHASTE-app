import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
    const [step, setStep] = useState("email");
    const [email, setEmail] = useState("");
    const [securityQuestion, setSecurityQuestion] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    async function submitEmail(event) {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const apiUrl = import.meta.env.VITE_PHP_API_URL || "http://localhost/chaste_app/backend/php";
            const response = await fetch(`${apiUrl}/forgot_password.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email: email.trim() }),
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Could not find the security question.");
            }

            setSecurityQuestion(result.security_question);
            setStep("answer");
        } catch (requestError) {
            setError(requestError.message || "Could not connect to the recovery service.");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function submitNewPassword(event) {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const apiUrl = import.meta.env.VITE_PHP_API_URL || "http://localhost/chaste_app/backend/php";
            const response = await fetch(`${apiUrl}/reset_password.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    email: email.trim(),
                    security_answer: securityAnswer,
                    new_password: newPassword,
                }),
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Could not reset the password.");
            }

            navigate("/login", { replace: true, state: { message: "Password reset. Sign in with your new password." } });
        } catch (requestError) {
            setError(requestError.message || "Could not connect to the recovery service.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="page login-page">
            <nav className="nav">
                <h1 className="logo">CHASTE</h1>
                <Link to="/" className="login-link">Home</Link>
            </nav>

            <main className="form-wrap">
                <h2>Forgot Password</h2>
                {step === "email" ? (
                    <form onSubmit={submitEmail}>
                        <label htmlFor="recovery-email">Email</label>
                        <input
                            id="recovery-email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                        {error && <p className="auth-error" role="alert">{error}</p>}
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Looking Up..." : "Continue"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={submitNewPassword}>
                        <p className="recovery-question">{securityQuestion}</p>
                        <label htmlFor="security-answer">Answer</label>
                        <input
                            id="security-answer"
                            type="text"
                            autoComplete="off"
                            value={securityAnswer}
                            onChange={(event) => setSecurityAnswer(event.target.value)}
                            required
                        />
                        <label htmlFor="new-password">New password</label>
                        <input
                            id="new-password"
                            type="password"
                            autoComplete="new-password"
                            minLength={8}
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                            required
                        />
                        {error && <p className="auth-error" role="alert">{error}</p>}
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}
                <p className="auth-switch">
                    <Link to="/login">Back to login</Link>
                </p>
            </main>
        </div>
    );
}

export default ForgotPassword;