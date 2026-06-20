import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    useEffect(() => {
        const root = window.document.documentElement;
        // Keep theme fixed (no user/admin toggle)
        root.classList.add('dark');
    }, []);

    // No toggle exposed
    return (
        <ThemeContext.Provider value={{ darkMode: true, toggleDarkMode: undefined }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);

