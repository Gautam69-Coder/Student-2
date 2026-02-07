import React, { useEffect } from 'react';
import { lineWobble } from 'ldrs';

/**
 * Premium Cyber-Minimalist Loader
 * Uses 'ldrs' (formerly UI Balls) for high-performance animations
 */
export const CyberLoader = ({ size = "80", speed = "1.75", color = "#7C3AED" }) => {
    useEffect(() => {
        // Registers the custom element
        lineWobble.register();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-6">
            <div className="relative">
                {/* Glow effect background */}
                <div className="absolute inset-0 blur-2xl opacity-20 bg-primary animate-pulse" />

                <l-line-wobble
                    size={size}
                    stroke="5"
                    bg-opacity="0.1"
                    speed={speed}
                    color={color}
                ></l-line-wobble>
            </div>

            <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-bold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400 animate-pulse">
                    Initializing
                </span>
                <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1 h-1 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1 h-1 rounded-full bg-primary/40 animate-bounce" />
                </div>
            </div>
        </div>
    );
};
