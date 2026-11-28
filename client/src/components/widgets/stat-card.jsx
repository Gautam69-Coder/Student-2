import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DotLoader } from "@/Utils/loaders";

export function TrendBadge({ text, variant = "success" }) {
    const cls =
        variant === "danger"
            ? "bg-destructive/10 text-destructive border-destructive/25"
            : "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/25";

    return (
        <span
            className={`hidden sm:inline-flex items-center justify-center px-2.5 py-1 rounded-full border text-xs font-bold tabular-nums ${cls}`}
        >
            {text}
        </span>
    );
}

export function DashStatCard({ icon: Icon, title, value }) {
    return (
        <Card className="rounded-2xl h-full surface-card py-5 gap-3">
            <CardHeader className="px-5 pb-0">
                <div className="flex items-start justify-between">
                    <div className="p-2.5 rounded-xl shrink-0 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        <Icon size={18} aria-hidden="true" />
                    </div>
                </div>
                <CardTitle className="mt-3 text-xs sm:text-sm font-semibold text-muted-foreground">
                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent className="px-5 pt-0">
                <div className="text-2xl lg:text-3xl font-extrabold tabular-nums text-foreground">
                    {value === null || value === "" || value === 0 ? (
                        <DotLoader size="20" color="#4F46E5" />
                    ) : (
                        value
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export function Pill({ children, className = "" }) {
    return (
        <span
            className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full font-bold text-xs border border-border bg-secondary text-foreground ${className}`}
        >
            {children}
        </span>
    );
}
