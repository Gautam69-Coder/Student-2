import React, { useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import { theme } from "@/lib/theme";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell, LogOut, Upload, Search, X } from "lucide-react";
import { Logo } from "../logo/logo"; 

export function DashboardSidebar({
    navItems,
    userName,
    userEmail,
    userAvatar,
    onLogout,
    onShare,
    searchQuery,
    setSearchQuery,
    isBell,
    setisBell,
    Notification,
}) {
    const navigate = useNavigate();
    const location = useLocation();
    const [showSearch, setShowSearch] = useState(false);

    return (
        <motion.aside
         
            className="hidden md:flex sticky flex-col h-screen overflow-y-auto gap-3 p-4 top-0 left-0"
            style={{
                width: "250px",
                background: theme.colors.dark,
                color: theme.colors.white,
                borderRight: `1px solid ${theme.colors.lightGray}20`,
            }}
        >
            {/* Logo */}
            <div className="text-2xl mb-15 font-bold px-2" style={{ color: theme.colors.lime }}>
               <Logo/>
            </div>

            
          

            {/* Navigation Items */}
            <LayoutGroup>
                <nav className="flex flex-col gap-1 flex-1 mx-2">
                    {navItems?.map((item) => {
                        const isActive =
                            item.path === "/dashboard"
                                ? location.pathname === item.path
                                : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

                        return (
                            <motion.button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                layout
                                whileHover={{ x: 4, scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all overflow-hidden"
                                style={{
                                    background: isActive ? theme.colors.lime : "transparent",
                                    color: isActive ? theme.colors.dark : theme.colors.white,
                                    opacity: isActive ? 1 : 0.7,
                                }}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active-route"
                                        className="absolute inset-0 rounded-lg"
                                        style={{
                                            background: theme.colors.lime,
                                            boxShadow: "0 8px 18px rgba(204, 255, 0, 0.16)",
                                        }}
                                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                    />
                                )}
                                <div className="relative z-10 flex items-center gap-3 w-full">
                                    <item.icon size={18} />
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {item.badge && (
                                        <span
                                            className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold"
                                            style={{
                                                background: isActive ? theme.colors.dark : theme.colors.lime,
                                                color: isActive ? theme.colors.lime : theme.colors.dark,
                                            }}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                            </motion.button>
                        );
                    })}
                </nav>
            </LayoutGroup>

            {/* Action Buttons Section */}
            <div className="space-y-2 mx-2 border-t border-slate-700 pt-3">
                {/* Share Button */}
                {onShare && (
                    <button
                        onClick={onShare}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                            background: theme.colors.lime,
                            color: theme.colors.dark,
                        }}
                    >
                        <Upload size={16} />
                        <span>Upload Note</span>
                    </button>
                )}

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setisBell?.(!isBell)}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                            background: isBell ? "rgba(204, 255, 0, 0.2)" : "rgba(255, 255, 255, 0.1)",
                            color: theme.colors.white,
                        }}
                    >
                        <Bell size={16} />
                        <span>Notifications</span>
                    </button>
                    {isBell && Notification && (
                        <div className="absolute bottom-12 left-0 right-0 bg-slate-800 rounded-lg shadow-lg z-50 max-w-xs">
                            <Notification />
                        </div>
                    )}
                </div>

                {/* Logout */}
                {onLogout && (
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all text-red-400 hover:bg-red-900/20"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                )}
            </div>

            {/* Upgrade CTA - Pushed to bottom */}
            <div
                className="p-3 rounded-xl text-center mx-2"
                style={{ background: theme.colors.lime }}
            >
                <div className="text-xs font-bold" style={{ color: theme.colors.dark }}>
                    Upgrade to Pro
                </div>
                <div className="text-xs mt-1 mb-2" style={{ color: theme.colors.dark }}>
                    Unlock premium
                </div>
                <button
                    className="w-full py-1.5 rounded-lg font-bold text-xs"
                    style={{
                        background: theme.colors.dark,
                        color: theme.colors.lime,
                    }}
                >
                    Upgrade
                </button>
            </div>
        </motion.aside>
    );
}
