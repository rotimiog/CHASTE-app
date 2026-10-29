import { useState } from "react";
import { ThemeContext } from "./themeContextStore";

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        const storedTheme = localStorage.getItem("theme");
        return storedTheme === "light" || storedTheme === "dark"
            ? storedTheme
            : document.documentElement.dataset.theme || "dark";
    });

    function toggleTheme() {
        const nextTheme = theme === "dark" ? "light" : "dark";
        localStorage.setItem("theme", nextTheme);
        document.documentElement.dataset.theme = nextTheme;
        setTheme(nextTheme);
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
