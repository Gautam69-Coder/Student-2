
import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, FileText, FlaskConical, Upload, BarChart3, LogOut, X, GraduationCap, MessageSquare, Bell, MapPin, Code2 } from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'
import { useSocket } from '@/context/SocketContext'

const navItems = [
    { id: "users", label: "Manage Users", icon: Users, badge: true },
    { id: "guests", label: "Guest User Data", icon: MapPin },
    { id: "subjects", label: "Manage Subjects", icon: GraduationCap },
    { id: "practicals", label: "Add Practical", icon: FlaskConical },
    { id: "practice", label: "Manage Practice", icon: Code2 },
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
                        className="fixed left-0 top-0 h-full w-64 bg-[#090D16] border-r border-zinc-800/85 z-50 shadow-2xl select-none"
                    >
                        <div className="flex flex-col h-full p-5">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8 px-2">
                                <div className="flex items-center gap-3">
                                    <img src="/logo.png" alt="Student Hub Admin Logo" className="h-7 w-auto object-contain" />
                                    <span className="text-[10px] font-black tracking-widest text-[#CCFF00] uppercase border border-[#CCFF00]/30 px-1.5 py-0.5 rounded bg-[#CCFF00]/5">
                                        Admin
                                    </span>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 rounded-lg hover:bg-white/5 transition-colors lg:hidden"
                                >
                                    <X className="w-5 h-5 text-zinc-400" />
                                </button>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 space-y-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname.includes(`/admin/${item.id}`) || (item.id === 'users' && (location.pathname === '/admin' || location.pathname === '/admin/'));
                                    const linkPath = item.id === 'users' ? '/admin' : `/admin/${item.id}`;

                                    return (
                                        <Link
                                            key={item.id}
                                            to={linkPath}
                                            onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                                            className={`group relative w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 text-xs font-black ${isActive
                                                ? "bg-[#CCFF00] text-zinc-950 shadow-md shadow-[#CCFF00]/10"
                                                : "text-zinc-400 hover:text-white hover:bg-white/5 hover:translate-x-1"
                                                }`}
                                        >
                                            <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-zinc-950" : "text-zinc-500 group-hover:text-white"}`} />
                                            <span>{item.label}</span>

                                            {item.badge && onlineUsers.length > 0 && (
                                                <span className="absolute right-4 flex h-1.5 w-1.5">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                                </span>
                                            )}
                                        </Link>
                                    )
                                })}
                            </nav>
                            
                            {/* Logout */}
                            <div className="pt-4 border-t border-zinc-800/80 mt-auto">
                                <button
                                    onClick={onLogout}
                                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-xs font-black cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4 text-zinc-500 group-hover:text-red-400" />
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
