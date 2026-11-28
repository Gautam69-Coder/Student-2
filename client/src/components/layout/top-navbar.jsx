import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
    Bell,
    ChevronDown,
    Search,
    Shield,
    Key,
    PanelLeftOpen,
    PanelLeftClose,
    User as UserIcon,
    LogOut,
    X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { saveApiKey } from "@/Api/api";
import { customMessage } from "@/Utils/customMessage";
import { useData } from "@/context/DataContext";
import NotificationPanel from "@/components/common/notification";
import { ThemeToggle } from "@/components/common/theme-toggle";

export function TopNavBar({
    userName,
    userEmail,
    userAvatar,
    searchQuery,
    setSearchQuery,
    isBell,
    setisBell,
    onLogout,
    isSidebarCollapsed,
    onToggleSidebar,
}) {
    const { user } = useData();
    const isAdmin = user?.role === "admin" || user?.role === "superadmin";
    const hasApiKey = Boolean(user?.apiKey);

    const [showProfile, setShowProfile] = useState(false);
    const [showAddKeyModal, setShowAddKeyModal] = useState(false);
    const [apiKeyInput, setApiKeyInput] = useState("");
    const [savingApiKey, setSavingApiKey] = useState(false);
    const [apiKeyError, setApiKeyError] = useState("");

    const searchInputRef = useRef(null);
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" ? window.innerWidth < 768 : false
    );

    useEffect(() => {
        if (!showAddKeyModal) {
            setApiKeyInput("");
            setApiKeyError("");
            setSavingApiKey(false);
        }
    }, [showAddKeyModal]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Cmd/Ctrl + K quick search shortcut
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleSaveApiKey = async () => {
        setSavingApiKey(true);
        setApiKeyError("");
        try {
            const res = await saveApiKey({ apiKeyInput });
            if (res.data.message) {
                setShowAddKeyModal(false);
                return customMessage({
                    type: "success",
                    content: `${res.data.message}!`,
                });
            }
        } catch (e) {
            setApiKeyError(e?.response?.data?.error || e?.message || "Failed to save API key");
        } finally {
            setSavingApiKey(false);
        }
    };

    return (
        <motion.header
            animate={{
                left: isMobile ? 0 : isSidebarCollapsed ? 0 : 252,
            }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="flex fixed top-0 right-0 left-0 z-40 h-[68px] items-center justify-between px-3 sm:px-6 border-b border-border bg-card/85 backdrop-blur-xl"
        >
            {/* Left: Sidebar toggle + Profile Menu */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    className="hidden md:inline-flex items-center justify-center min-h-[40px] min-w-[40px] rounded-xl border border-border bg-background hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={isSidebarCollapsed ? "Show Sidebar" : "Hide Sidebar"}
                    title={isSidebarCollapsed ? "Show Sidebar" : "Hide Sidebar"}
                >
                    {isSidebarCollapsed ? (
                        <PanelLeftOpen size={17} aria-hidden="true" />
                    ) : (
                        <PanelLeftClose size={17} aria-hidden="true" />
                    )}
                </button>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowProfile(!showProfile)}
                        aria-expanded={showProfile}
                        aria-label="Open account menu"
                        className="flex items-center gap-2.5 px-2 sm:px-2.5 py-1.5 rounded-xl hover:bg-secondary transition-colors"
                    >
                        {userAvatar ? (
                            <img
                                src={userAvatar}
                                alt={userName}
                                className="w-8 h-8 rounded-lg object-cover border border-border"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary border border-primary/25 flex items-center justify-center text-xs font-extrabold uppercase">
                                {(userName || "S").charAt(0)}
                            </div>
                        )}
                        <div className="text-left hidden sm:block max-w-[140px]">
                            <div className="text-xs font-bold text-foreground truncate">{userName}</div>
                            <div className="text-[11px] text-muted-foreground truncate">{userEmail}</div>
                        </div>
                        <ChevronDown
                            size={14}
                            className={`text-muted-foreground transition-transform duration-200 ${
                                showProfile ? "rotate-180" : ""
                            }`}
                            aria-hidden="true"
                        />
                    </button>

                    {showProfile && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowProfile(false)}
                            />
                            <div className="absolute left-0 top-full mt-2 w-52 rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl z-20 p-1.5">
                                <button
                                    type="button"
                                    className="w-full flex items-center gap-2.5 text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-secondary transition-colors"
                                    onClick={() => {
                                        setShowProfile(false);
                                        navigate("/dashboard/profile");
                                    }}
                                >
                                    <UserIcon size={14} className="text-muted-foreground" aria-hidden="true" />
                                    View Profile
                                </button>
                                <div className="h-px my-1 bg-border" />
                                <button
                                    type="button"
                                    className="w-full flex items-center gap-2.5 text-left px-3 py-2 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
                                    onClick={() => {
                                        setShowProfile(false);
                                        onLogout?.();
                                    }}
                                >
                                    <LogOut size={14} aria-hidden="true" />
                                    Sign Out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Center: Command-style Global Search */}
            <div className="flex-1 max-w-md mx-2 sm:mx-6">
                <div className="relative flex items-center">
                    <Search
                        className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none"
                        aria-hidden="true"
                    />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search notes, subjects, practicals..."
                        aria-label="Search workspace"
                        name="search"
                        value={searchQuery || ""}
                        onChange={(e) => setSearchQuery?.(e.target.value)}
                        className="w-full h-10 pl-9 pr-14 bg-background border border-input rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                    />
                    {searchQuery ? (
                        <button
                            type="button"
                            onClick={() => setSearchQuery?.("")}
                            aria-label="Clear search"
                            className="absolute right-2.5 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary"
                        >
                            <X className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                    ) : (
                        <kbd className="hidden sm:inline-flex absolute right-2.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-muted-foreground bg-secondary border border-border rounded-md pointer-events-none">
                            ⌘K
                        </kbd>
                    )}
                </div>
            </div>

            {/* Right: AI Key, Theme Toggle, Notifications, Admin Switch */}
            <div className="flex items-center gap-2 shrink-0 relative">
                {!hasApiKey && (
                    <button
                        type="button"
                        onClick={() => setShowAddKeyModal(true)}
                        className="inline-flex items-center gap-1.5 min-h-[40px] px-3 sm:px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border dark:border-emerald-500/30 dark:hover:bg-emerald-500/25 text-white text-xs font-bold transition-all active:scale-[0.98]"
                    >
                        <Key size={14} aria-hidden="true" />
                        <span className="hidden sm:inline">Add AI Key</span>
                    </button>
                )}

                <ThemeToggle />

                <button
                    type="button"
                    onClick={() => setisBell?.(!isBell)}
                    aria-label="Toggle notifications"
                    aria-expanded={isBell}
                    className={`relative inline-flex items-center justify-center min-h-[40px] min-w-[40px] rounded-xl border transition-colors ${
                        isBell
                            ? "bg-primary/10 border-primary/30 text-primary"
                            : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                >
                    <Bell size={17} aria-hidden="true" />
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                </button>

                {isAdmin && (
                    <button
                        type="button"
                        onClick={() => navigate("/admin")}
                        aria-label="Switch to Admin Panel"
                        title="Admin Workspace"
                        className="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-2.5 sm:px-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/20 text-xs font-bold transition-colors"
                    >
                        <Shield size={15} aria-hidden="true" />
                        <span className="hidden lg:inline">Admin</span>
                    </button>
                )}

                {isBell && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setisBell?.(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 z-20">
                            <NotificationPanel onClose={() => setisBell?.(false)} />
                        </div>
                    </>
                )}

                {showAddKeyModal && (
                    <>
                        <div
                            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs"
                            onClick={() => setShowAddKeyModal(false)}
                        />
                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="connect-groq-title"
                            className="fixed right-4 left-4 sm:left-auto sm:right-6 top-20 z-50 sm:w-[28rem] rounded-3xl border border-border bg-card text-card-foreground shadow-2xl overflow-hidden"
                        >
                            <div className="px-6 py-5 border-b border-border bg-emerald-500/10 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-emerald-600 rounded-xl text-white">
                                        <Key size={18} aria-hidden="true" />
                                    </div>
                                    <div>
                                        <h3 id="connect-groq-title" className="text-base font-bold text-foreground">
                                            Connect Groq API
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            Enable fast AI explanations and code help.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowAddKeyModal(false)}
                                    aria-label="Close modal"
                                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
                                >
                                    <X size={16} aria-hidden="true" />
                                </button>
                            </div>

                            <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="p-3.5 rounded-2xl bg-background border border-border">
                                        <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold mb-2">
                                            1
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Visit the{" "}
                                            <a
                                                href="https://console.groq.com/"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                                            >
                                                Groq Console
                                            </a>
                                            .
                                        </p>
                                    </div>
                                    <div className="p-3.5 rounded-2xl bg-background border border-border">
                                        <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold mb-2">
                                            2
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Generate a new API key and paste it below.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                    <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                                    <div>
                                        <h4 className="text-xs font-bold text-foreground">Encrypted Storage</h4>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Your key is stored encrypted and never exposed publicly.
                                        </p>
                                    </div>
                                </div>

                                {apiKeyError && (
                                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs font-semibold">
                                        {apiKeyError}
                                    </div>
                                )}
                            </div>

                            <div className="p-5 bg-secondary/40 border-t border-border flex flex-col sm:flex-row items-center gap-2.5">
                                <input
                                    type="password"
                                    name="apiKey"
                                    aria-label="Groq API key"
                                    value={apiKeyInput}
                                    onChange={(e) => setApiKeyInput(e.target.value)}
                                    placeholder="gsk_xxxxxxxxxxxxxxxxxxxx"
                                    className="w-full flex-1 min-h-[44px] px-3.5 border border-input rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={handleSaveApiKey}
                                    disabled={savingApiKey || !apiKeyInput.trim()}
                                    className="w-full sm:w-auto min-h-[44px] px-5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {savingApiKey ? "Connecting..." : "Connect Key"}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </motion.header>
    );
}
