import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeContext = createContext({
    darkMode: false,
    theme: 'light',
    toggleDarkMode: () => {},
    setThemeMode: () => {},
});

const STORAGE_KEY = 'studenthub_theme';

export function ThemeProvider({ children }) {
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window === 'undefined') return false;
        return localStorage.getItem(STORAGE_KEY) === 'dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (darkMode) {
            root.classList.add('dark');
            root.style.colorScheme = 'dark';
            localStorage.setItem(STORAGE_KEY, 'dark');
        } else {
            root.classList.remove('dark');
            root.style.colorScheme = 'light';
            localStorage.setItem(STORAGE_KEY, 'light');
        }
    }, [darkMode]);

    const toggleDarkMode = useCallback(() => {
        setDarkMode((prev) => !prev);
    }, []);

    const setThemeMode = useCallback((mode) => {
        setDarkMode(mode === 'dark');
    }, []);

    return (
        <ThemeContext.Provider
            value={{
                darkMode,
                theme: darkMode ? 'dark' : 'light',
                toggleDarkMode,
                setThemeMode,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
