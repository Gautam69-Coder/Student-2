import React from "react";
import { Home, FileText, FlaskConical, User, Users, Code2 } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useData } from "@/context/DataContext";
import { canAccessPracticals } from "@/Utils/vesCheck";

const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "notes", label: "Notes", icon: FileText },
    { id: "practicals", label: "Labs", icon: FlaskConical },
    { id: "coding-practice", label: "Code", icon: Code2 },
    { id: "community", label: "Peers", icon: Users },
    { id: "profile", label: "Profile", icon: User },
];

export function BottomNavbar() {
    const location = useLocation();
    const { user } = useData();

    const allowedNavItems = navItems.filter(
        (item) => item.id !== "practicals" || canAccessPracticals(user)
    );

    return (
        <div
            className="fixed bottom-2 left-2 right-2 md:hidden z-40 rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-lg"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
            <nav aria-label="Mobile navigation" className="flex justify-around items-center px-1 py-1.5">
                {allowedNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        item.id === "home"
                            ? location.pathname === "/dashboard" || location.pathname === "/dashboard/"
                            : location.pathname.startsWith(`/dashboard/${item.id}`);

                    const linkPath = item.id === "home" ? "/dashboard" : `/dashboard/${item.id}`;

                    return (
                        <Link
                            key={item.id}
                            to={linkPath}
                            className={`relative flex flex-col items-center justify-center min-h-[48px] w-full gap-1 rounded-xl transition-colors duration-150 ${
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <div className="relative px-3 py-1 rounded-full flex items-center justify-center">
                                {isActive && (
                                    <motion.div
                                        layoutId="bottomActiveTab"
                                        className="absolute inset-0 rounded-full bg-primary/15 border border-primary/25 z-0"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                                <Icon className="w-5 h-5 z-10 relative" strokeWidth={isActive ? 2.25 : 1.9} aria-hidden="true" />
                            </div>
                            <span className="text-[10px] font-bold leading-none z-10">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
