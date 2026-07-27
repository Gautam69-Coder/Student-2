import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ChevronRight, Check, Loader2 } from "lucide-react";
import { fetchNotifications, notificationStatusUpdate } from '@/Api/api';
import { theme } from "@/lib/theme";

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

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="sm:w-96 w-80 rounded-xl overflow-hidden"
                style={{
                    background: theme.colors.white,
                    border: `1px solid ${theme.colors.lightGray}`,
                    boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-4 py-3"
                    style={{ borderBottom: `1px solid ${theme.colors.lightGray}` }}
                >
                    <div className="flex items-center gap-2.5">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: theme.colors.softGray }}
                        >
                            <Bell size={15} style={{ color: theme.colors.dark }} />
                        </div>
                        <div>
                            <p className="text-sm font-bold" style={{ color: theme.colors.dark }}>
                                Notifications
                                {unreadCount > 0 && (
                                    <span
                                        className="ml-2 px-1.5 py-0.5 rounded-md text-[10px] font-black"
                                        style={{
                                            background: theme.colors.lime,
                                            color: theme.colors.dark,
                                        }}
                                    >
                                        {unreadCount} new
                                    </span>
                                )}
                            </p>
                            <p className="text-[11px]" style={{ color: theme.colors.darkGray }}>
                                {unreadCount > 0
                                    ? `${unreadCount} unread update${unreadCount > 1 ? 's' : ''}`
                                    : 'All caught up'}
                            </p>
                        </div>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors hover:opacity-80"
                            style={{
                                background: theme.colors.limeDim,
                                color: theme.colors.dark,
                                border: `1px solid ${theme.colors.limeLight}`,
                            }}
                        >
                            <Check size={11} />
                            Mark all read
                        </button>
                    )}
                </div>

                {/* Body */}
                <div className="max-h-80 overflow-y-auto" data-lenis-prevent>
                    {loading ? (
                        <div className="flex items-center justify-center gap-2 py-10">
                            <Loader2 size={16} className="animate-spin" style={{ color: theme.colors.darkGray }} />
                            <span className="text-xs" style={{ color: theme.colors.darkGray }}>
                                Loading...
                            </span>
                        </div>
                    ) : notifications.length > 0 ? (
                        <div>
                            {notifications.map((notification, i) => (
                                <div
                                    key={notification._id || i}
                                    onClick={() => handleMarkAsRead(notification._id)}
                                    className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-all"
                                    style={{
                                        borderBottom: i < notifications.length - 1 ? `1px solid ${theme.colors.lightGray}` : 'none',
                                        background: !notification.isRead ? theme.colors.limeDim : 'transparent',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = theme.colors.softGray;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = !notification.isRead ? theme.colors.limeDim : 'transparent';
                                    }}
                                >
                                    {/* Unread dot */}
                                    <div className="mt-1.5 shrink-0">
                                        {!notification.isRead ? (
                                            <div
                                                className="w-2 h-2 rounded-full"
                                                style={{ background: theme.colors.lime, boxShadow: `0 0 6px ${theme.colors.lime}` }}
                                            />
                                        ) : (
                                            <div className="w-2 h-2 rounded-full" style={{ background: theme.colors.lightGray }} />
                                        )}
                                    </div>

                                    {/* Icon */}
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ background: theme.colors.softGray }}
                                    >
                                        <Bell size={14} style={{ color: theme.colors.dark }} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className="text-xs font-bold truncate"
                                            style={{ color: theme.colors.dark }}
                                        >
                                            {notification.title}
                                        </p>
                                        <p
                                            className="text-[11px] mt-0.5 line-clamp-2 leading-relaxed"
                                            style={{ color: theme.colors.darkGray }}
                                        >
                                            {notification.message}
                                        </p>
                                        {(notification.date || notification.time) && (
                                            <div className="flex items-center gap-2 mt-1.5">
                                                {notification.date && (
                                                    <span
                                                        className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                                                        style={{
                                                            background: theme.colors.softGray,
                                                            color: theme.colors.darkGray,
                                                        }}
                                                    >
                                                        {notification.date}
                                                    </span>
                                                )}
                                                {notification.time && (
                                                    <span className="text-[10px]" style={{ color: theme.colors.darkGray }}>
                                                        {notification.time}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 gap-2">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ background: theme.colors.softGray }}
                            >
                                <Bell size={18} style={{ color: theme.colors.darkGray }} />
                            </div>
                            <p className="text-xs font-medium" style={{ color: theme.colors.darkGray }}>
                                No notifications yet
                            </p>
                            <p className="text-[11px] text-center px-6" style={{ color: theme.colors.darkGray }}>
                                New updates from your admins will appear here.
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default NotificationPanel;
