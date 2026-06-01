import React, { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode as reduxToggleDarkMode } from '@/store/slices/uiSlice';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const dispatch = useDispatch();
    const darkMode = useSelector((state) => state.ui.darkMode);

    useEffect(() => {
        const root = window.document.documentElement;
        // Force dark theme only
        root.classList.add('dark');
    }, [darkMode]);

    const toggleDarkMode = () => dispatch(reduxToggleDarkMode());

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
