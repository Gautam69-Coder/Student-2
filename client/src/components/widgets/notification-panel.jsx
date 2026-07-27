import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Sparkles, CheckCircle2, Trophy, Code2, X, ChevronRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchNotifications, notificationStatusUpdate } from "@/Api/api";

export function NotificationPanel({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  // Default system fallback notifications if server list is empty
  const defaultSystemNotifications = [
    {
      _id: "sys_1",
      title: "New DSA Track Available",
      message: "Graph Algorithms & Shortest Path problems are now live in Student Hub!",
      date: "Today",
      time: "Just now",
      isRead: false,
      type: "practice",
      link: "/dashboard/coding-practice/dsa",
    },
    {
      _id: "sys_2",
      title: "🔥 7-Day Streak Milestone!",
      message: "You solved 15+ coding problems this week. Keep up the momentum!",
      date: "Yesterday",
      time: "2:30 PM",
      isRead: false,
      type: "achievement",
      link: "/dashboard/coding-practice",
    },
    {
      _id: "sys_3",
      title: "AI Code Helper Online",
      message: "Connect your Groq API key in the top navbar to unlock AI explanations.",
      date: "2 days ago",
      time: "10:15 AM",
      isRead: true,
      type: "system",
      link: "/dashboard/chatbot",
    },
  ];

  // Fetch real notifications from backend
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetchNotifications();
      const list = res?.data?.data || res?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        setNotifications(list);
      } else {
        setNotifications(defaultSystemNotifications);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications(defaultSystemNotifications);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  // Mark single notification as read
  const handleMarkAsRead = async (id) => {
    try {
      if (id && !id.startsWith("sys_")) {
        await notificationStatusUpdate({ isRead: true, notificationId: id });
      }
      setNotifications((prev) =>
        prev.map((n) => (n._id === id || n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification read:", err);
    }
  };

  // Mark all notifications as read
  const handleMarkAllRead = async () => {
    try {
      const unread = notifications.filter((n) => !n.isRead);
      await Promise.all(
        unread.map((n) => {
          if (n._id && !n._id.startsWith("sys_")) {
            return notificationStatusUpdate({ isRead: true, notificationId: n._id });
          }
          return Promise.resolve();
        })
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Error marking all read:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "practice") return n.type === "practice" || n.title?.toLowerCase().includes("dsa");
    return true;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute right-0 top-14 w-80 sm:w-96 z-50 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xl text-slate-900 dark:text-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white tracking-wide flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-sm">
                    {unreadCount} NEW
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {unreadCount > 0 ? `${unreadCount} unread update${unreadCount > 1 ? "s" : ""}` : "All caught up"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-purple-600 dark:text-cyan-400 hover:underline transition-colors flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                Mark All Read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/40 text-xs">
          {["all", "unread", "practice"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-lg font-medium capitalize transition-all ${
                filter === tab
                  ? "bg-purple-100 dark:bg-purple-600/30 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/40 shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notifications List Body */}
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/40">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
              Loading notifications...
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No notifications found
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <div
                key={item._id || item.id}
                onClick={() => {
                  handleMarkAsRead(item._id || item.id);
                  if (item.link) navigate(item.link);
                  onClose();
                }}
                className={`flex gap-3.5 p-4 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                  !item.isRead ? "bg-purple-50/60 dark:bg-purple-950/20" : "opacity-85"
                }`}
              >
                {/* Status Dot / Icon */}
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-sm">
                    {item.type === "practice" ? (
                      <Code2 className="w-4 h-4" />
                    ) : item.type === "achievement" ? (
                      <Trophy className="w-4 h-4" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                  </div>
                  {!item.isRead && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-white dark:border-slate-900" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <h4
                      className={`text-xs font-bold truncate ${
                        !item.isRead
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                      {item.time || item.date}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.message || item.desc}
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 self-center shrink-0" />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800/80 text-center">
          <button
            onClick={() => {
              navigate("/dashboard/coding-practice");
              onClose();
            }}
            className="w-full py-1.5 rounded-xl text-xs font-bold text-purple-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-purple-400 dark:to-cyan-400 hover:opacity-90 transition-opacity"
          >
            Explore Practice Tracks →
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
