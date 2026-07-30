import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Loader2, Sparkles, Trophy, Code2 } from "lucide-react";
import { fetchNotifications, notificationStatusUpdate } from '@/Api/api';

const NotificationPanel = ({ onClose }) => {
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
            setNotifications(prev =>
                prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
            );
        } catch (error) {
            console.error("Error updating notification status:", error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const unread = notifications.filter(n => !n.isRead);
            await Promise.all(
                unread.map(n => n._id ? notificationStatusUpdate({ isRead: true, notificationId: n._id }) : Promise.resolve())
            );
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Error marking all read:", error);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

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
            return { icon: Code2, color: "text-purple-600", bg: "rgba(168, 85, 247, 0.1)" };
        }
        if (t.includes("achievement") || t.includes("streak") || t.includes("trophy") || t.includes("won")) {
            return { icon: Trophy, color: "text-amber-600", bg: "rgba(245, 158, 11, 0.1)" };
        }
        if (t.includes("new") || t.includes("feature") || t.includes("live")) {
            return { icon: Sparkles, color: "text-emerald-600", bg: "rgba(16, 185, 129, 0.1)" };
        }
        return { icon: Bell, color: "text-indigo-600", bg: "rgba(79, 70, 229, 0.1)" };
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="sm:w-96 w-80 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
                            <Bell size={15} />
                        </div>
                        <div>
                            <p className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                                Notifications
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200/50">
                                        {unreadCount} new
                                    </span>
                                )}
                            </p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                {unreadCount > 0
                                    ? `${unreadCount} unread update${unreadCount > 1 ? 's' : ''}`
                                    : 'All caught up'}
                            </p>
                        </div>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold border border-indigo-100 bg-indigo-50/50 text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer"
                        >
                            <Check size={11} />
                            Mark all read
                        </button>
                    )}
                </div>

                {/* Body */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100" data-lenis-prevent>
                    {loading ? (
                        <div className="flex items-center justify-center gap-2 py-10">
                            <Loader2 size={16} className="animate-spin text-indigo-600" />
                            <span className="text-xs font-semibold text-slate-400">
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
                                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-all hover:bg-slate-50 ${
                                            !notification.isRead ? "bg-indigo-50/30" : "transparent"
                                        }`}
                                    >
                                        {/* Status indicator dot */}
                                        <div className="mt-2 shrink-0">
                                            {!notification.isRead ? (
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                                                </span>
                                            ) : (
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                            )}
                                        </div>

                                        {/* Icon */}
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 animate-in fade-in"
                                            style={{ backgroundColor: styleConfig.bg }}
                                        >
                                            <IconComponent size={14} className={styleConfig.color} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-xs font-bold text-slate-800 truncate">
                                                    {notification.title}
                                                </p>
                                                {notification.createdAt && (
                                                    <span className="text-[9px] text-slate-400 font-semibold shrink-0">
                                                        {getRelativeTime(notification.createdAt)}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] mt-0.5 text-slate-500 line-clamp-2 leading-relaxed">
                                                {notification.message}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 gap-2">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-200 text-slate-400">
                                <Bell size={18} />
                            </div>
                            <p className="text-xs font-bold text-slate-700">
                                No notifications yet
                            </p>
                            <p className="text-[10px] text-center px-8 text-slate-400 font-semibold leading-relaxed">
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
