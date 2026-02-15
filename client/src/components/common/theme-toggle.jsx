
import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "../../context/ThemeContext"

export function ThemeToggle({ className = "" }) {
    const { darkMode, toggleDarkMode } = useTheme()

    return (
        <button
            onClick={toggleDarkMode}
            className={`relative flex items-center justify-center p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm ${className}`}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            <AnimatePresence mode="wait">
                {darkMode ? (
                    <motion.div
                        key="sun"
                        initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        <Sun className="w-5 h-5 text-orange-400" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="moon"
                        initial={{ scale: 0.5, opacity: 0, rotate: 90 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.5, opacity: 0, rotate: -90 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        <Moon className="w-5 h-5 text-slate-600" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Subtle glow effect for dark mode */}
            {darkMode && (
                <motion.div
                    layoutId="glow"
                    className="absolute inset-0 rounded-xl bg-orange-400/10 blur-md -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />
            )}
        </button>
    )
}
