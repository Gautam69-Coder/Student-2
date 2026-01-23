
import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, FileText, FlaskConical, Upload, BarChart3, LogOut, Shield, X, Sparkles, GraduationCap, MessageSquare } from "lucide-react"
import { useLocation, Link } from "react-router-dom"

const navItems = [
    { id: "users", label: "Manage Users", icon: Users },
    { id: "subjects", label: "Manage Subjects", icon: GraduationCap },
    { id: "content", label: "Content Manager", icon: FileText },
    { id: "practicals", label: "Add Practical", icon: FlaskConical },
    { id: "pyqs", label: "Upload PYQs", icon: Upload },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "feedback", label: "User Feedback", icon: MessageSquare },
]

export function AdminSidebar({ isOpen, setIsOpen, onLogout }) {
    const location = useLocation();
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
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
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
                        className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-50 shadow-2xl"
                    >
                        <div className="flex flex-col h-full p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-orange-500">
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-lg font-bold text-white tracking-tight">Admin Panel</span>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 rounded-md hover:bg-slate-800 transition-colors lg:hidden"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
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
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${isActive
                                                ? "bg-white text-slate-900 shadow-md"
                                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 ${isActive ? "text-slate-900" : "text-slate-400 group-hover:text-white"}`} />
                                            <span>{item.label}</span>
                                        </Link>
                                    )
                                })}
                            </nav>

                            {/* Logout */}
                            <div className="pt-6 border-t border-slate-800 mt-auto">
                                <button
                                    onClick={onLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all duration-200 font-medium"
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
