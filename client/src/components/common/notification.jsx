import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Loader2, Sparkles, Trophy, Code2 } from "lucide-react";
import { fetchNotifications, notificationStatusUpdate } from "@/Api/api";

const NotificationPanel = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const response = await fetchNotifications();
            const list = response?.data?.data || response?.data || [];
            setNotifications(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error("Error fetching notifications:", err);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const handleMarkAsRead = async (notificationId) => {
        try {
            if (notificationId) {
                await notificationStatusUpdate({ isRead: true, notificationId });
            }
            setNotifications((prev) =>
                prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
            );
        } catch (error) {
            console.error("Error updating notification status:", error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const unread = notifications.filter((n) => !n.isRead);
            await Promise.all(
                unread.map((n) =>
                    n._id ? notificationStatusUpdate({ isRead: true, notificationId: n._id }) : Promise.resolve()
                )
            );
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Error marking all read:", error);
        }
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const getRelativeTime = (createdAt) => {
        if (!createdAt) return "";
        const d = new Date(createdAt);
        if (Number.isNaN(d.getTime())) return "";
        const now = new Date();
        const diffMs = now - d;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    const getNotificationIcon = (title) => {
        const t = title?.toLowerCase() || "";
        if (t.includes("dsa") || t.includes("code") || t.includes("practice")) {
            return { icon: Code2, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-500/10" };
        }
        if (t.includes("achievement") || t.includes("streak") || t.includes("trophy") || t.includes("won")) {
            return { icon: Trophy, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" };
        }
        if (t.includes("new") || t.includes("feature") || t.includes("live")) {
            return { icon: Sparkles, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" };
        }
        return { icon: Bell, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-500/10" };
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="sm:w-96 w-80 rounded-2xl overflow-hidden bg-popover text-popover-foreground border border-border shadow-2xl"
            >
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-border bg-secondary/40">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
                            <Bell size={15} aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
                                Notifications
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/15 text-primary tabular-nums">
                                        {unreadCount} new
                                    </span>
                                )}
                            </p>
                            <p className="text-[11px] text-muted-foreground font-medium">
                                {unreadCount > 0
                                    ? `${unreadCount} unread update${unreadCount > 1 ? "s" : ""}`
                                    : "All caught up"}
                            </p>
                        </div>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={handleMarkAllRead}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border border-border bg-card text-primary hover:bg-secondary transition-colors"
                        >
                            <Check size={11} aria-hidden="true" />
                            Mark all read
                        </button>
                    )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-border" data-lenis-prevent>
                    {loading ? (
                        <div className="flex items-center justify-center gap-2 py-10">
                            <Loader2 size={16} className="animate-spin text-primary" aria-hidden="true" />
                            <span className="text-xs font-medium text-muted-foreground">
                                Loading notifications...
                            </span>
                        </div>
                    ) : notifications.length > 0 ? (
                        <div>
                            {notifications.map((notification, i) => {
                                const styleConfig = getNotificationIcon(notification.title);
                                const IconComponent = styleConfig.icon;
                                return (
                                    <div
                                        key={notification._id || i}
                                        onClick={() => handleMarkAsRead(notification._id)}
                                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-secondary/50 ${
                                            !notification.isRead ? "bg-indigo-500/5" : ""
                                        }`}
                                    >
                                        <div className="mt-2 shrink-0">
                                            {!notification.isRead ? (
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                                                </span>
                                            ) : (
                                                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                                            )}
                                        </div>

                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${styleConfig.bg}`}>
                                            <IconComponent size={14} className={styleConfig.color} aria-hidden="true" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-xs font-bold text-foreground truncate">
                                                    {notification.title}
                                                </p>
                                                {notification.createdAt && (
                                                    <span className="text-[10px] text-muted-foreground font-medium tabular-nums shrink-0">
                                                        {getRelativeTime(notification.createdAt)}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] mt-0.5 text-muted-foreground line-clamp-2 leading-relaxed">
                                                {notification.message}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 gap-2">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary border border-border text-muted-foreground">
                                <Bell size={18} aria-hidden="true" />
                            </div>
                            <p className="text-xs font-bold text-foreground">No notifications yet</p>
                            <p className="text-[11px] text-center px-8 text-muted-foreground leading-relaxed">
                                New updates from your academic mentors will appear here.
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default NotificationPanel;
