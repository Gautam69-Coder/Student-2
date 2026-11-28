import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    FlaskConical,
    BarChart3,
    LogOut,
    X,
    GraduationCap,
    MessageSquare,
    Bell,
    Code2,
    Send,
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useSocket } from "@/context/SocketContext";
import { Logo } from "@/components/common/logo/logo";

const navItems = [
    { id: "users", label: "Manage Users", icon: Users, badge: true },
    { id: "subjects", label: "Manage Subjects", icon: GraduationCap },
    { id: "practicals", label: "Add Practical", icon: FlaskConical },
    { id: "practice", label: "Manage Practice", icon: Code2 },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "feedback", label: "User Feedback", icon: MessageSquare },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "messages", label: "Send Message", icon: Send },
];

export function AdminSidebar({ isOpen, setIsOpen, onLogout }) {
    const location = useLocation();
    const { onlineUsers } = useSocket();

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        initial={{ x: -264 }}
                        animate={{ x: 0 }}
                        exit={{ x: -264 }}
                        transition={{ type: "spring", damping: 28, stiffness: 260 }}
                        className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border text-sidebar-foreground z-50 shadow-xl lg:shadow-none select-none flex flex-col p-4"
                    >
                        <div className="flex items-center justify-between mb-6 px-2 pt-1">
                            <div className="flex items-center gap-2">
                                <Logo />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-md bg-emerald-500/10">
                                    Admin
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close admin sidebar"
                                className="p-2 rounded-xl hover:bg-secondary transition-colors lg:hidden"
                            >
                                <X className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                            </button>
                        </div>

                        <nav aria-label="Admin navigation" className="flex-1 space-y-1 overflow-y-auto">
                            <span className="px-3 mb-1 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                Administration
                            </span>
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive =
                                    location.pathname.includes(`/admin/${item.id}`) ||
                                    (item.id === "users" &&
                                        (location.pathname === "/admin" || location.pathname === "/admin/"));
                                const linkPath = item.id === "users" ? "/admin" : `/admin/${item.id}`;

                                return (
                                    <Link
                                        key={item.id}
                                        to={linkPath}
                                        onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                                        className={`relative w-full flex items-center gap-3 px-3.5 min-h-[42px] rounded-xl transition-all duration-150 text-sm font-semibold ${
                                            isActive
                                                ? "bg-primary text-primary-foreground shadow-sm shadow-indigo-500/20"
                                                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                        }`}
                                    >
                                        <Icon
                                            className={`w-4 h-4 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`}
                                            aria-hidden="true"
                                        />
                                        <span className="truncate">{item.label}</span>

                                        {item.badge && onlineUsers.length > 0 && (
                                            <span className="ml-auto flex h-2 w-2" title={`${onlineUsers.length} online`}>
                                                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75" />
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="pt-3 border-t border-border mt-auto">
                            <button
                                type="button"
                                onClick={onLogout}
                                className="w-full flex items-center gap-3 px-3.5 min-h-[42px] rounded-xl text-destructive hover:bg-destructive/10 transition-colors text-sm font-semibold"
                            >
                                <LogOut className="w-4 h-4" aria-hidden="true" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}
