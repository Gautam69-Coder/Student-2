import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { fetchNotifications } from '@/Api/api';

const NotificationPanel = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotificationsData = async () => {
            try {
                const response = await fetchNotifications();
                setNotifications(response.data || []);
            } catch (err) {
                console.error("Error fetching notifications:", err);
            }
        };

        fetchNotificationsData();
    }, []);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                className="absolute sm:right-0 right-0 mt-3 sm:w-96 w-80 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200/70 dark:border-slate-700/70 overflow-hidden"
            >
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 backdrop-blur">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-indigo-100/80 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300">
                            <Bell className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                Notifications
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {notifications.length > 0
                                    ? `You have ${notifications.length} update${notifications.length > 1 ? 's' : ''}.`
                                    : 'All caught up for now.'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-h-72 overflow-y-auto" data-lenis-prevent>
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="px-4 py-3 border-b last:border-b-0 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                                            {notification.title}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                                            {notification.message}
                                        </p>
                                        <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
                                            {notification.date && (
                                                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                                                    {notification.date}
                                                </span>
                                            )}
                                            {notification.time && (
                                                <span>
                                                    {notification.time}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                            No notifications yet. New updates from your college or admins will appear here.
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default NotificationPanel;
