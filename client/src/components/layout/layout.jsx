import React from "react";
import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/common/theme-toggle";

export function DashboardHeader({ title, subtitle, timeRange = true, onSearch }) {
    const today = new Date();

    const formatDate = (d) =>
        d.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" });

    return (
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-sm font-medium text-muted-foreground mt-1">
                        {subtitle}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-2.5">
                {onSearch && (
                    <div className="px-3.5 py-2 rounded-xl flex items-center gap-2 bg-card border border-border">
                        <Search className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                        <input
                            type="text"
                            placeholder="Search..."
                            onChange={(e) => onSearch?.(e.target.value)}
                            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-36 sm:w-48"
                        />
                    </div>
                )}

                {timeRange && (
                    <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-card border border-border text-foreground tabular-nums">
                        {formatDate(today)}
                    </div>
                )}

                <ThemeToggle />
            </div>
        </div>
    );
}

export function DashboardLayout({
    children,
    sidebar,
    css,
}) {
    return (
        <div className="flex w-full pb-20 md:pb-0 min-h-[calc(100vh-4.25rem)] bg-background text-foreground transition-colors duration-200">
            {sidebar}

            <div className="flex-1 min-w-0 overflow-x-hidden flex flex-col">
                <div className={`flex-1 max-w-7xl w-full mx-auto ${css || "p-4 sm:p-6 lg:p-8"}`}>
                    {css ? children : <div className="space-y-6">{children}</div>}
                </div>
            </div>
        </div>
    );
}
