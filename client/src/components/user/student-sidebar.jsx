
import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, FileText, BookOpen, FlaskConical, LogOut, Sparkles, X, MessageSquare } from "lucide-react"
import { useLocation, Link } from "react-router-dom"
import { Logo } from "../logo/logo"

const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "notes", label: "My Notes", icon: FileText },
    { id: "pyqs", label: "PYQs", icon: BookOpen },
    { id: "practicals", label: "Practicals", icon: FlaskConical },
    { id: "feedback", label: "Feedback", icon: MessageSquare },
]

export function StudentSidebar({ isOpen, setIsOpen, onLogout }) {
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
                        className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-[#E5E5E5] z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
                    >
                        <div className="flex flex-col h-full p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2  bg-slate-900">
                                        <Logo />
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 rounded-md hover:bg-slate-100 transition-colors lg:hidden"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 space-y-1.5">
                                {navItems.map((item) => {
                                    const Icon = item.icon
                                    // Helper to check if active. 
                                    // Home is active if pathname is exactly "/dashboard" or "/dashboard/"
                                    // Others are active if pathname starts with /dashboard/{id}
                                    const isActive = item.id === 'home'
                                        ? location.pathname === '/dashboard' || location.pathname === '/dashboard/'
                                        : location.pathname.startsWith(`/dashboard/${item.id}`);

                                    const linkPath = item.id === 'home' ? '/dashboard' : `/dashboard/${item.id}`;

                                    return (
                                        <Link
                                            key={item.id}
                                            to={linkPath}
                                            onClick={() => window.innerWidth < 1024 && setIsOpen(false)} // Close sidebar on mobile on click
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${isActive
                                                ? "bg-white text-black shadow-sm"
                                                : "text-white hover:text-black hover:bg-white"
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 ${isActive ? "text-black" : "text-slate-400 group-hover:text-slate-900"}`} />
                                            <span>{item.label}</span>
                                        </Link>
                                    )
                                })}
                            </nav>

                            {/* Logout */}
                            <div className="pt-6 border-t border-slate-100 mt-auto">
                                <button
                                    onClick={onLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 font-medium"
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
