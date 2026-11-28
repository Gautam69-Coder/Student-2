import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className = "" }) {
    const { darkMode = false, toggleDarkMode } = useTheme() || {};

    return (
        <button
            type="button"
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className={cn(
                "relative inline-flex items-center justify-center min-h-[40px] min-w-[40px] p-2 rounded-xl",
                "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary",
                "transition-all duration-200 active:scale-[0.96] shadow-xs",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className
            )}
        >
            <AnimatePresence mode="wait" initial={false}>
                {darkMode ? (
                    <motion.div
                        key="sun"
                        initial={{ scale: 0.6, opacity: 0, rotate: -60 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.6, opacity: 0, rotate: 60 }}
                        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="moon"
                        initial={{ scale: 0.6, opacity: 0, rotate: 60 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.6, opacity: 0, rotate: -60 }}
                        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Moon className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
}
