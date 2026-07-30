import React, { useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import { theme } from "@/lib/theme";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell, LogOut, Upload, Search, X } from "lucide-react";
import { Logo } from "../common/logo/logo";
import { useData } from "@/context/DataContext";

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
    const { user } = useData();

    return (
        <motion.aside
            className="hidden md:flex sticky flex-col h-screen overflow-y-auto gap-3 p-4 top-0 left-0 bg-white border-r border-slate-200 text-slate-800"
            style={{
                width: "250px",
            }}
        >
            {/* Logo */}
            <div className="text-2xl mb-12 font-bold px-2 pt-2">
               <Logo/>
            </div>

            {/* Navigation Items */}
            <LayoutGroup>
                <nav className="flex flex-col gap-1 flex-1 mx-1">
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
                                className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all overflow-hidden ${
                                    isActive
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                                }`}
                            >
                                <div className="relative z-10 flex items-center gap-3 w-full">
                                    <item.icon size={18} className={isActive ? "text-white" : "text-slate-500"} />
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {item.badge && (
                                        <span
                                            className={`ml-auto px-2 py-0.5 rounded-full text-xs font-black ${
                                                isActive
                                                    ? "bg-white text-indigo-700"
                                                    : "bg-indigo-100 text-indigo-700"
                                            }`}
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
            <div className="space-y-2 mx-1 border-t border-slate-200/80 pt-3">
                {/* Share Button */}
                {onShare && (
                    <button
                        onClick={onShare}
                        className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/60 transition-all"
                    >
                        <Upload size={16} />
                        <span>Upload Note</span>
                    </button>
                )}

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setisBell?.(!isBell)}
                        className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all"
                    >
                        <Bell size={16} className="text-slate-500" />
                        <span>Notifications</span>
                    </button>
                    {isBell && Notification && (
                        <div className="absolute bottom-12 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-w-xs p-2">
                            <Notification />
                        </div>
                    )}
                </div>

                {/* Logout */}
                {onLogout && (
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-all"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                )}
            </div>

            {/* Upgrade CTA - Pushed to bottom */}
            {user?.subscription !== "pro" && user?.subscription !== "lifetime" && (
                <div
                    className="p-3.5 rounded-2xl text-center mx-1 bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-50/50 border border-indigo-100 shadow-2xs mt-auto"
                >
                    <div className="text-xs font-black text-indigo-950">
                        Upgrade to Pro
                    </div>
                    <div className="text-[11px] mt-0.5 mb-2.5 text-slate-600 font-medium">
                        Unlock premium features
                    </div>
                    <button
                        onClick={() => navigate("/dashboard/upgrade")}
                        className="w-full py-2 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all cursor-pointer"
                    >
                        Upgrade
                    </button>
                </div>
            )}
        </motion.aside>
    );
}
