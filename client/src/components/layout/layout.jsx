import React, { useState } from "react";
import { theme } from "@/lib/theme";
import { Bell, Sun, Moon } from "lucide-react";

export function DashboardHeader({ title, subtitle, timeRange = true, onSearch }) {
    const [isDark, setIsDark] = useState(false);
    const today = new Date();

    const formatDate = (d) =>
        d.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" });

    return (
        <div className="flex items-start justify-between gap-6 pb-6">
            <div>
                <div className="text-[30px] font-bold" style={{ color: theme.colors.dark }}>
                    {title}
                </div>
                {subtitle && (
                    <div className="text-[14px] font-medium" style={{ color: theme.colors.darkGray, marginTop: 4 }}>
                        {subtitle}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3">
                {/* Search */}
                <div
                    className="px-4 py-2 rounded-full flex items-center gap-2"
                    style={{
                        background: theme.colors.white,
                        border: `1px solid ${theme.colors.lightGray}`,
                    }}
                >
                    <input
                        type="text"
                        placeholder="Search..."
                        onChange={(e) => onSearch?.(e.target.value)}
                        className="bg-transparent text-sm outline-none"
                        style={{ color: theme.colors.dark }}
                    />
                    <span style={{ color: theme.colors.darkGray }}>🔍</span>
                </div>

                {/* Date Range */}
                {timeRange && (
                    <>
                        <div
                            className="px-3 py-2 rounded-full text-[12px] font-semibold cursor-pointer hover:opacity-80"
                            style={{
                                background: theme.colors.white,
                                border: `1px solid ${theme.colors.lightGray}`,
                                color: theme.colors.darkGray,
                            }}
                        >
                            <span className="font-bold" style={{ color: theme.colors.dark }}>
                                {formatDate(today)}
                            </span>
                        </div>
                        <div
                            className="px-3 py-2 rounded-full text-[12px] font-semibold cursor-pointer hover:opacity-80"
                            style={{
                                background: theme.colors.white,
                                border: `1px solid ${theme.colors.lightGray}`,
                                color: theme.colors.dark,
                            }}
                        >
                            This Week ▾
                        </div>
                    </>
                )}

                {/* Notification Icon */}
                <button
                    className="p-2 rounded-full hover:opacity-80 transition"
                    style={{
                        background: theme.colors.lime,
                        color: theme.colors.dark,
                    }}
                >
                    <Bell size={20} />
                </button>

                {/* Theme Toggle */}
                <button
                    onClick={() => setIsDark(!isDark)}
                    className="p-2 rounded-full hover:opacity-80 transition"
                    style={{
                        background: theme.colors.softGray,
                        color: theme.colors.dark,
                    }}
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </div>
    );
}


export function DashboardLayout({
    children,
    sidebar,
    topNavProps,
    css,
}) {
    return (
        <div className={`flex   w-full sm:mb-0 mb-10 `} style={{ background: "#F4F4F5" ,height: css||"100vh"}}>
            {/* Fixed Sidebar */}
            {sidebar}

            {/* Main Content - Offset for fixed sidebar */}
            <div className="flex-1 overflow-auto flex flex-col " >
                {/* Top Navbar - Sticky at top */}
                
                {/* Content */}
                <div className="sm:p-6 p-4  flex-1 ">
                    <div className="space-y-4">{children}</div>
                </div>
            </div>
        </div>
    );
}
