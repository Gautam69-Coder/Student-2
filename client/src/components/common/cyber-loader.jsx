import React, { useEffect } from "react";
import { lineWobble } from "ldrs";

export const CyberLoader = ({ size = "80", speed = "1.75", color = "#4F46E5" }) => {
    useEffect(() => {
        lineWobble.register();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-5">
            <div className="relative">
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
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">
                    Loading Workspace
                </span>
            </div>
        </div>
    );
};
