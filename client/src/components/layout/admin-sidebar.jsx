
import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, FileText, FlaskConical, Upload, BarChart3, LogOut, X, GraduationCap, MessageSquare, Bell, MapPin } from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'
import { useSocket } from '@/context/SocketContext'

const navItems = [
    { id: "users", label: "Manage Users", icon: Users, badge: true },
    { id: "guests", label: "Guest User Data", icon: MapPin },
    { id: "subjects", label: "Manage Subjects", icon: GraduationCap },
    { id: "practicals", label: "Add Practical", icon: FlaskConical },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "feedback", label: "User Feedback", icon: MessageSquare },
    { id: "notifications", label: "Notifications", icon: Bell },
]

export function AdminSidebar({ isOpen, setIsOpen, onLogout }) {
    const location = useLocation();
    const { onlineUsers } = useSocket();

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden dark:bg-slate-900/40"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-50 shadow-2xl dark:bg-slate-950 dark:border-slate-700"
                    >
                        <div className="flex flex-col h-full p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-3">
                                    <img src="/logo.png" alt="Student Hub Admin Logo" className="h-8 w-auto object-contain" />
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 rounded-md hover:bg-slate-800 transition-colors lg:hidden dark:hover:bg-slate-700"
                                >
                                    <X className="w-5 h-5 text-slate-400 dark:text-slate-300" />
                                </button>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 space-y-1.5">
                                {navItems.map((item) => {
                                    const Icon = item.icon
                                    // users is the default index route mostly, but let's be explicit
                                    const isActive = location.pathname.includes(`/admin/${item.id}`) || (item.id === 'users' && (location.pathname === '/admin' || location.pathname === '/admin/'));

                                    const linkPath = item.id === 'users' ? '/admin' : `/admin/${item.id}`;

                                    return (
                                        <Link
                                            key={item.id}
                                            to={linkPath}
                                            onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                                            className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-all duration-200 font-medium ${isActive
                                                ? "bg-white text-slate-900 shadow-md dark:bg-slate-800 dark:text-white"
                                                : "text-slate-400 hover:text-white hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 ${isActive ? "text-slate-900 dark:text-white" : "text-slate-400 group-hover:text-white dark:text-slate-400 dark:group-hover:text-white"}`} />
                                            <span>{item.label}</span>

                                            {item.badge && onlineUsers.length > 0 && (
                                                <span className="absolute right-4 flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                                </span>
                                            )}
                                        </Link>
                                    )
                                })}
                            </nav>
                            {/* Logout */}
                            <div className="pt-6 border-t border-slate-800 mt-auto">
                                <button
                                    onClick={onLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all duration-200 font-medium"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    )
}
