import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { readProfile, saveProfile } from "../data/products";

function MyDetails() {
    const [profile, setProfile] = useState(readProfile);
    const [saved, setSaved] = useState(false);
    const [securityQuestion, setSecurityQuestion] = useState("");
    const [selectedQuestion, setSelectedQuestion] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [securityError, setSecurityError] = useState("");
    const [securitySaved, setSecuritySaved] = useState(false);
    const [needsSignIn, setNeedsSignIn] = useState(false);
    const [isLoadingSecurity, setIsLoadingSecurity] = useState(true);
    const [isSavingSecurity, setIsSavingSecurity] = useState(false);

    useEffect(() => {
        async function loadSecurityStatus() {
            try {
                const apiUrl = import.meta.env.VITE_PHP_API_URL || "http://localhost/chaste_app/backend/php";
                const response = await fetch(`${apiUrl}/security_question.php`, {
                    credentials: "include",
                });
                const result = await response.json();

                if (!response.ok) {
                    if (response.status === 401) {
                        setNeedsSignIn(true);
                        return;
                    }
                    throw new Error(result.error || "Could not load recovery settings.");
                }

                setSecurityQuestion(result.security_question || "");
            } catch (loadError) {
                setSecurityError(loadError.message || "Could not connect to the recovery service.");
            } finally {
                setIsLoadingSecurity(false);
            }
        }

        loadSecurityStatus();
    }, []);

    function handleSave(event) {
        event.preventDefault();
        const updatedProfile = {
            ...profile,
            name: profile.name.trim(),
            email: profile.email.trim(),
            phone: (profile.phone || "").trim(),
        };
        saveProfile(updatedProfile);
        setProfile(updatedProfile);
        setSaved(true);
    }

    function updateField(field, value) {
        setProfile((current) => ({ ...current, [field]: value }));
        setSaved(false);
    }

    async function handleSecuritySave(event) {
        event.preventDefault();
        setSecurityError("");
        setIsSavingSecurity(true);

        try {
            const apiUrl = import.meta.env.VITE_PHP_API_URL || "http://localhost/chaste_app/backend/php";
            const response = await fetch(`${apiUrl}/security_question.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    security_question: selectedQuestion,
                    security_answer: securityAnswer,
                }),
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Could not save recovery settings.");
            }

            setSecurityQuestion(result.security_question);
            setSecurityAnswer("");
            setSecuritySaved(true);
            const currentProfile = readProfile();
            saveProfile({ ...currentProfile, security_question: result.security_question });
        } catch (saveError) {
            setSecurityError(saveError.message || "Could not connect to the recovery service.");
        } finally {
            setIsSavingSecurity(false);
        }
    }

    return (
        <div className="page account-page">
            <nav className="nav">
                <h1 className="logo">CHASTE</h1>
                <div className="nav-actions">
                    <Link to="/" className="login-link">Home</Link>
                    <Link to="/account" className="login-link">Account</Link>
                </div>
            </nav>

            <main className="account-subpage">
                <header className="subpage-heading">
                    <p className="eyebrow">Account settings</p>
                    <h2>My Details</h2>
                    <p>Manage the contact details saved with this browser profile.</p>
                </header>

                <form className="details-form" onSubmit={handleSave}>
                    <label>
                        Full name
                        <input
                            type="text"
                            autoComplete="name"
                            value={profile.name || ""}
                            onChange={(event) => updateField("name", event.target.value)}
                            placeholder="Your full name"
                            required
                        />
                    </label>
                    <label>
                        Email address
                        <input
                            type="email"
                            autoComplete="email"
                            value={profile.email || ""}
                            onChange={(event) => updateField("email", event.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </label>
                    <label>
                        Phone number <span className="optional-label">Optional</span>
                        <input
                            type="tel"
                            autoComplete="tel"
                            value={profile.phone || ""}
                            onChange={(event) => updateField("phone", event.target.value)}
                            placeholder="Your phone number"
                        />
                    </label>
                    <div className="details-form-actions">
                        <button className="account-primary-action" type="submit">Save details</button>
                        {saved && <p className="account-success" role="status">Your details are saved on this device.</p>}
                    </div>
                    <p className="local-data-note">Temporary storage: these details stay in this browser and are not synced to an online account.</p>
                </form>

                <section className="details-form recovery-settings" aria-labelledby="recovery-settings-title">
                    <div>
                        <h3 id="recovery-settings-title">Password recovery</h3>
                        <p className="local-data-note">Add a security question for password recovery. Your answer is hidden and stored as a hash.</p>
                    </div>
                    {isLoadingSecurity ? (
                        <p className="local-data-note" role="status">Loading recovery settings...</p>
                    ) : needsSignIn ? (
                        <p className="local-data-note">
                            <Link to="/login">Sign in</Link> to view or set password recovery details.
                        </p>
                    ) : securityQuestion ? (
                        <p className="account-success" role="status">Recovery question is set. The question and answer are hidden for privacy.</p>
                    ) : (
                        <form className="recovery-settings-form" onSubmit={handleSecuritySave}>
                            <label>
                                Security question
                                <select
                                    value={selectedQuestion}
                                    onChange={(event) => setSelectedQuestion(event.target.value)}
                                    required
                                >
                                    <option value="">Choose a question</option>
                                    <option value="What was the name of your first school?">What was the name of your first school?</option>
                                    <option value="What city were you born in?">What city were you born in?</option>
                                    <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                                </select>
                            </label>
                            <label>
                                Security answer
                                <input
                                    type="password"
                                    autoComplete="new-password"
                                    value={securityAnswer}
                                    onChange={(event) => setSecurityAnswer(event.target.value)}
                                    required
                                />
                            </label>
                            {securityError && <p className="auth-error" role="alert">{securityError}</p>}
                            {securitySaved && <p className="account-success" role="status">Recovery settings saved.</p>}
                            <div className="details-form-actions">
                                <button className="account-primary-action" type="submit" disabled={isSavingSecurity}>
                                    {isSavingSecurity ? "Saving..." : "Save recovery settings"}
                                </button>
                            </div>
                        </form>
                    )}
                </section>
            </main>
        </div>
    );
}

export default MyDetails;
