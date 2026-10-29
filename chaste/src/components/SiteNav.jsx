import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/useTheme";

function SiteNav() {
    const { theme, toggleTheme } = useTheme();
    const { pathname } = useLocation();
    const activePage = pathname === "/"
        ? "home"
        : pathname === "/about"
            ? "about"
            : pathname === "/shop" || pathname.startsWith("/product/")
                ? "shop"
                : "";

    return (
        <nav className="landing-nav" aria-label="Main navigation">
            <Link to="/" className="landing-brand" aria-label="CHASTE home">
                <span className="brand-mark" aria-hidden="true" />
                CHASTE
            </Link>

            <div className="landing-nav-links">
                <Link to="/" className={activePage === "home" ? "is-active" : ""}>Home</Link>
                <Link to="/shop" className={activePage === "shop" ? "is-active" : ""}>Shop</Link>
                <Link to="/about" className={activePage === "about" ? "is-active" : ""}>About</Link>
            </div>

            <div className="landing-nav-actions">
                <button
                    type="button"
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                    title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                >
                    {theme === "dark" ? (
                        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></svg>
                    ) : (
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.4A8.5 8.5 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z" /></svg>
                    )}
                </button>
                <Link to="/login" className="landing-login">Log In</Link>
                <Link to="/signup" className="landing-primary">Get Started</Link>
            </div>
        </nav>
    );
}

export default SiteNav;
