
import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, FileText, FlaskConical, Upload, BarChart3, LogOut, X, GraduationCap, MessageSquare, Bell, MapPin, Code2 } from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'
import { useSocket } from '@/context/SocketContext'

const navItems = [
    { id: "users", label: "Manage Users", icon: Users, badge: true },
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
                        className="fixed inset-0 bg-slate-900/10 backdrop-blur-xs z-40 lg:hidden dark:bg-slate-900/30"
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
                        className="fixed left-0 top-0 h-full w-64 bg-[#e6eef8] dark:bg-[#1b202e] border-r border-slate-200/50 dark:border-slate-800/50 z-50 shadow-2xl lg:shadow-none select-none"
                    >
                        <div className="flex flex-col h-full p-5">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8 px-2">
                                <div className="flex items-center gap-3">
                                    <img src="/logo.png" alt="Student Hub Admin Logo" className="h-7 w-auto object-contain" />
                                    <span className="text-[10px] font-black tracking-widest text-[#4F46E5] dark:text-[#CCFF00] border border-[#4F46E5]/30 dark:border-[#CCFF00]/30 px-1.5 py-0.5 rounded bg-indigo-500/5 dark:bg-[#CCFF00]/5">
                                        Admin
                                    </span>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors lg:hidden"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 space-y-3">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname.includes(`/admin/${item.id}`) || (item.id === 'users' && (location.pathname === '/admin' || location.pathname === '/admin/'));
                                    const linkPath = item.id === 'users' ? '/admin' : `/admin/${item.id}`;

                                    return (
                                        <Link
                                            key={item.id}
                                            to={linkPath}
                                            onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                                            className={`group relative w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-xs font-black ${isActive
                                                ? "bg-[#e6eef8] dark:bg-[#1b202e] shadow-[inset_4px_4px_8px_#c8d0e7,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#0f121b,inset_-4px_-4px_8px_#272e41] text-[#4F46E5] dark:text-[#CCFF00]"
                                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:shadow-[4px_4px_8px_#c8d0e7,-4px_-4px_8px_#ffffff] dark:hover:shadow-[4px_4px_8px_#0f121b,-4px_-4px_8px_#272e41] hover:translate-x-1"
                                                }`}
                                        >
                                            <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-[#4F46E5] dark:text-[#CCFF00]" : "text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"}`} />
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
                            <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 mt-auto">
                                <button
                                    onClick={onLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:shadow-[4px_4px_8px_#c8d0e7,-4px_-4px_8px_#ffffff] dark:hover:shadow-[4px_4px_8px_#0f121b,-4px_-4px_8px_#272e41] transition-all duration-200 text-xs font-black cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
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
