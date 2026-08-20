import React, { useState, useEffect } from "react"
import { Routes, Route, useNavigate, Navigate } from "react-router-dom"
import {
    fetchUsers,
    fetchContent,
    fetchSections
} from "@/Api/api"


import { GraduationCap, Menu, X } from "lucide-react"
import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { useSocket } from "@/context/SocketContext"

import { ManageUsers } from "./ManageUsers"
import { ManageSubjects } from "./ManageSubjects"
import { ManagePracticals } from "./ManagePracticals"
import { ManageNotification } from "./ManageNotification"
import { AnalyticsDashboard } from "./AnalyticsDashboard"
import { ManageFeedback } from "./ManageFeedback"
import { MessageSender } from "./MessageSender"
import { ManagePractice } from "./ManagePractice"
import { motion, AnimatePresence } from "framer-motion"
import { useTitle } from "@/hooks/useTitle"

export function AdminPanel({ userName, onLogout }) {
    useTitle("Admin Panel");
    // Theme toggle removed from admin
    const { onlineUsers, lastVisit, socket } = useSocket();
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024)
    const [users, setUsers] = useState([]);
    const [subjects, setSubjects] = useState([])
    const [uniqueSubjectSections, setUniqueSubjectSections] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const res = await fetchUsers();
                setUsers(res.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch users:", err);
            }
        };

        const loadContent = async () => {
            try {
                const res = await fetchContent();
                setSubjects(res.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch content/subjects:", err);
            }
        };

        const loadSectionsData = async () => {
            try {
                const res = await fetchSections();
                const list = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
                setUniqueSubjectSections(list);
            } catch (err) {
                console.error("Failed to fetch sections:", err);
            }
        };

        loadUsers();
        loadContent();
        loadSectionsData();
    }, [])

    // Real-time Visit Stats Listener
    useEffect(() => {
        if (!socket) return;

        socket.on('user_stats_update', (data) => {
            // console.log('📊 Received user_stats_update:', data);
            setUsers(currentUsers => currentUsers.map(user =>
                user._id === data.userId ? { ...user, visitCount: data.visitCount } : user
            ));
            // console.log('📊 Updated users with new visit count:', data.visitCount);
        });

        return () => socket.off('user_stats_update');
    }, [socket]);

    useEffect(() => {
        if (lastVisit && lastVisit.username !== userName) {
            const id = Date.now();
            setNotifications(prev => [...prev, { id, ...lastVisit }]);
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== id));
            }, 5000);
        }
    }, [lastVisit]);

    return (
        <div className={`flex min-h-screen transition-colors duration-300 bg-[#e6eef8] dark:bg-[#1b202e]`}>
            <AdminSidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                onLogout={onLogout}
            />

            <main className={`flex-1 w-full transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "ml-0"}`}>
                {/* Header */}
                <header className="sticky top-0 z-40 bg-[#e6eef8]/80 dark:bg-[#1b202e]/80 backdrop-blur-md transition-all select-none border-b border-slate-200/50 dark:border-slate-800/50">
                    <div className="flex items-center justify-between sm:px-8 px-4 py-4">
                        <div className="flex items-center sm:gap-4 gap-2">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="p-2.5 rounded-xl neo-btn lg:hidden"
                            >
                                <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            </button>
                            <div>
                                <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">
                                    Admin Workspace
                                </h1>
                                <p className="text-[11px] text-slate-400 font-bold mt-1">
                                    Operator: {userName}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 shadow-[inset_2px_2px_4px_#c8d0e7,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#0f121b,inset_-2px_-2px_4px_#272e41] rounded-xl bg-transparent">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{onlineUsers.length} Active</span>
                            </div>

                            <button
                                onClick={() => { navigate("/dashboard"); }}
                                className="inline-flex items-center justify-center rounded-xl gap-1.5 neo-btn active:scale-[0.98] px-4 py-2.5 text-xs font-black text-slate-800 dark:text-white transition-all cursor-pointer"
                            >
                                <GraduationCap className="w-4 h-4 text-indigo-500 dark:text-[#CCFF00]" />
                                Student View
                            </button>
                        </div>
                    </div>
                </header>

                <div className="sm:p-8  mx-auto overflow-hidden relative">
                    <Routes>
                        <Route path="/" element={<ManageUsers users={users} setUsers={setUsers} subjects={subjects} />} />
                        <Route path="subjects" element={<ManageSubjects subjects={subjects} uniqueSubjectSections={uniqueSubjectSections} setUniqueSubjectSections={setUniqueSubjectSections} />} />
                        <Route path="practicals" element={<ManagePracticals uniqueSubjectSections={uniqueSubjectSections} />} />
                        <Route path="practice" element={<ManagePractice />} />
                        <Route path="analytics" element={<AnalyticsDashboard users={users} />} />
                        <Route path="feedback" element={<ManageFeedback />} />
                        <Route path="messages" element={<MessageSender users={users} />} />
                        <Route path="notifications" element={<ManageNotification />} />
                        <Route path="*" element={<Navigate to="" replace />} />
                    </Routes>
                </div>

                {/* Real-time Notifications */}
                <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
                    <AnimatePresence>
                        {notifications.map((notification) => (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                                className="pointer-events-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-4 rounded-[10px] shadow-2xl border border-slate-800 dark:border-slate-200 flex items-center gap-4 min-w-[280px]"
                            >
                                <div className="w-10 h-10 rounded-[10px] bg-slate-800 dark:bg-slate-100 flex items-center justify-center font-bold text-white dark:text-slate-900">
                                    {notification.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{notification.username} is here!</p>
                                    <p className="text-[10px] uppercase tracking-widest opacity-60 font-black">Just visited the website</p>
                                </div>
                                <button
                                    onClick={() => setNotifications(n => n.filter(x => x.id !== notification.id))}
                                    className="ml-auto p-1 opacity-40 hover:opacity-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </main >
        </div >
    )
}
