
import React from 'react';
import { Home, FileText, FlaskConical, User, Users, Code2 } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "notes", label: "Notes", icon: FileText },
    { id: "practicals", label: "Practicals", icon: FlaskConical },
    { id: "coding-practice", label: "Practice", icon: Code2 },
    { id: "community", label: "Community", icon: Users },
    { id: "profile", label: "Profile", icon: User },
];

export function BottomNavbar() {
    const location = useLocation();

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 lg:hidden z-40">
            <nav className="flex justify-around items-center px-1 py-3 pb-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.id === 'home'
                        ? location.pathname === '/dashboard' || location.pathname === '/dashboard/'
                        : location.pathname.startsWith(`/dashboard/${item.id}`);

                    const linkPath = item.id === 'home' ? '/dashboard' : `/dashboard/${item.id}`;

                    return (
                        <Link
                            key={item.id}
                            to={linkPath}
                            className={`relative flex flex-col items-center justify-center w-full gap-1 transition-all duration-200 ${isActive
                                ? "text-slate-900 dark:text-white scale-105"
                                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                                }`}
                        >
                            <div className="relative p-1.5 rounded-full flex items-center justify-center">
                                {isActive && (
                                    <motion.div
                                        layoutId="bottomActiveTab"
                                        className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-full z-0"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                                <Icon className={`w-7 h-7 z-10 relative ${isActive ? "fill-current" : ""}`} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={`text-[10px] font-medium leading-none z-10 ${isActive ? "font-bold text-slate-900 dark:text-white" : ""}`}>
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    );
}
