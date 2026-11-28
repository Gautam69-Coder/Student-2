import React from "react";

export const Logo = ({ className = "" }) => {
    return (
        <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
            <img
                className="h-8 w-8 rounded-lg object-contain shrink-0"
                src="/circle_logo.png"
                alt="Student Hub Logo"
            />
            <span className="text-base font-extrabold tracking-tight text-foreground">
                Student Hub
            </span>
        </div>
    );
};

export const CircleLogo = () => {
    return (
        <img
            className="h-8 w-8 rounded-full object-contain"
            src="/circle_logo.png"
            alt="Student Hub Circle Logo"
        />
    );
};
