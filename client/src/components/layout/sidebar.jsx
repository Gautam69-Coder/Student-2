import { LayoutGroup, motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell, LogOut, Upload, Code2, Sparkles } from "lucide-react";
import { Logo } from "../common/logo/logo";

export function DashboardSidebar({
    isCollapsed,
    navItems,
    onLogout,
    onShare,
    isBell,
    setisBell,
    Notification,
}) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <motion.aside
            animate={{
                width: isCollapsed ? 0 : 252,
                paddingLeft: isCollapsed ? 0 : 14,
                paddingRight: isCollapsed ? 0 : 14,
                paddingTop: isCollapsed ? 0 : 16,
                paddingBottom: isCollapsed ? 0 : 16,
                borderRightWidth: isCollapsed ? 0 : 1,
                opacity: isCollapsed ? 0 : 1,
            }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="hidden md:flex sticky top-0 left-0 h-screen overflow-y-auto flex-col gap-4 bg-sidebar border-sidebar-border text-sidebar-foreground border-r overflow-x-hidden shrink-0 z-30"
        >
            {/* Brand Logo */}
            <div className="px-2 pt-1 pb-2 flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
                >
                    <Logo />
                </button>
            </div>

            {/* Primary Navigation */}
            <LayoutGroup>
                <nav aria-label="Dashboard navigation" className="flex flex-col gap-1 flex-1">
                    <span className="px-3 mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Workspace
                    </span>
                    {navItems?.map((item) => {
                        const isActive =
                            item.path === "/dashboard"
                                ? location.pathname === item.path
                                : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

                        return (
                            <button
                                key={item.path}
                                type="button"
                                onClick={() => navigate(item.path)}
                                className={`relative flex items-center gap-3 px-3.5 min-h-[42px] rounded-xl text-sm font-semibold transition-all duration-150 active:scale-[0.98] ${
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-sm shadow-indigo-500/20"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                }`}
                            >
                                <item.icon
                                    size={18}
                                    className={isActive ? "text-primary-foreground" : "text-muted-foreground"}
                                    aria-hidden="true"
                                />
                                <span className="flex-1 text-left truncate">{item.label}</span>
                                {item.badge && (
                                    <span
                                        className={`ml-auto px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${
                                            isActive
                                                ? "bg-white/20 text-white"
                                                : "bg-primary/10 text-primary"
                                        }`}
                                    >
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </LayoutGroup>

            {/* Quick Workspace Actions */}
            <div className="space-y-1.5 border-t border-border pt-3">
                {onShare && (
                    <button
                        type="button"
                        onClick={onShare}
                        className="w-full flex items-center gap-2.5 px-3.5 min-h-[40px] rounded-xl text-xs font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/15 border border-indigo-500/20 transition-all active:scale-[0.98]"
                    >
                        <Upload size={15} aria-hidden="true" />
                        <span>Upload Note</span>
                    </button>
                )}

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setisBell?.(!isBell)}
                        className="w-full flex items-center gap-2.5 px-3.5 min-h-[40px] rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                    >
                        <Bell size={15} aria-hidden="true" />
                        <span>Notifications</span>
                    </button>
                    {isBell && Notification && (
                        <div className="absolute bottom-12 left-0 right-0 bg-popover border border-border rounded-xl shadow-xl z-50 max-w-xs p-2">
                            <Notification />
                        </div>
                    )}
                </div>

                {onLogout && (
                    <button
                        type="button"
                        onClick={onLogout}
                        className="w-full flex items-center gap-2.5 px-3.5 min-h-[40px] rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 transition-all"
                    >
                        <LogOut size={15} aria-hidden="true" />
                        <span>Sign Out</span>
                    </button>
                )}
            </div>

            {/* Practice Focus Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-card to-emerald-500/10 border border-border space-y-2.5 mt-auto">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    <span>Daily Coding Sprint</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Solve 1 challenge in the Monaco IDE to build your weekly streak.
                </p>
                <button
                    type="button"
                    onClick={() => navigate("/dashboard/coding-practice")}
                    className="w-full min-h-[36px] rounded-xl font-bold text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs transition-all active:scale-[0.98] inline-flex items-center justify-center gap-1.5"
                >
                    <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
                    Open Practice
                </button>
            </div>
        </motion.aside>
    );
}
