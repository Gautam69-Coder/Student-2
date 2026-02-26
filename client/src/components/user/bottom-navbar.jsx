
import React from 'react';
import { Home, FileText, FlaskConical, User, Users } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "notes", label: "Notes", icon: FileText },
    { id: "practicals", label: "Practicals", icon: FlaskConical },
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
                            className={`flex flex-col items-center justify-center w-full gap-1 transition-all duration-200 ${isActive
                                ? "text-slate-900 dark:text-white scale-105"
                                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                                }`}
                        >
                            <div className={`p-1.5 rounded-full ${isActive ? "bg-slate-100 dark:bg-slate-800" : ""}`}>
                                <Icon className={`w-7 h-7 ${isActive ? "fill-current" : ""}`} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={`text-[10px] font-medium leading-none ${isActive ? "font-bold" : ""}`}>
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    );
}
