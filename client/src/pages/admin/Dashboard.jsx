
import React, { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import {
    fetchUsers,
    fetchContent,
    fetchSections,
    deleteUser
} from "@/Api/api"

import { GraduationCap, Menu, X, Sun, Moon } from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { useTheme } from "@/context/ThemeContext"
import { useSocket } from "@/context/SocketContext"
import { ManageUsers } from "./ManageUsers"
import { ManageSubjects } from "./ManageSubjects"
import { ManageContent } from "./ManageContent"
import { ManagePracticals } from "./ManagePracticals"
import { ManagePYQs } from "./ManagePYQs"
import { ManageNotification } from "./ManageNotification"
import { AnalyticsDashboard } from "./AnalyticsDashboard"
import { ManageFeedback } from "./ManageFeedback"
import { MessageSender } from "./MessageSender"
import { motion, AnimatePresence } from "framer-motion"
import { useTitle } from "@/hooks/useTitle"
import { Navigate, useNavigate } from "react-router-dom"


const initialSubjects = [
    { name: "Java Programming", code: "CS301", progress: 75, color: "#f97316" },
    { name: "Scilab", code: "CS302", progress: 60, color: "#06b6d4" },
    { name: "Data Structures", code: "CS303", progress: 45, color: "#8b5cf6" },
    { name: "Web Development", code: "CS304", progress: 90, color: "#10b981" },
]

const pendingNotes = [
    { id: 1, title: "Advanced Java Streams", author: "Rahul S.", subject: "Java", date: "Today" },
    { id: 2, title: "Scilab Signal Processing", author: "Priya K.", subject: "Scilab", date: "Yesterday" },
    { id: 3, title: "Graph Algorithms Notes", author: "Vikram T.", subject: "DSA", date: "2 days ago" },
]

export function AdminPanel({ userName, onLogout, onSwitchToStudent }) {
    useTitle("Admin Panel");
    const { darkMode, toggleDarkMode } = useTheme();
    const { onlineUsers, lastVisit, socket } = useSocket();
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024)
    const [users, setUsers] = useState([])
    const [subjects, setSubjects] = useState(initialSubjects)
    const [uniqueSubjectSections, setUniqueSubjectSections] = useState([]);
    const [notifications, setNotifications] = useState([]);
     const navigate=useNavigate();

    useEffect(() => {
        const user = fetchUsers();
        user.then((res) => {
            setUsers(res.data);
            // console.log("Fetched users:", res.data);
        });

        const content = fetchContent();
        content.then((res) => {
            setSubjects(res.data)
        });

        const section = fetchSections();
        section.then((res) => {
            setUniqueSubjectSections(res.data)
        });
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
        <div className={`flex min-h-screen transition-colors duration-300 ${darkMode ? "bg-slate-950" : "bg-[#FCFAF8]"}`}>
            <AdminSidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                onLogout={onLogout}
            />

            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "ml-0"}`}>
                {/* Header */}
                <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-[#E5E5E5] dark:border-slate-800 transition-colors">
                    <div className="flex items-center justify-between sm:px-8 px-4 py-5">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
                            >
                                <Menu className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Admin Command Center</h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Welcome back, {userName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">{onlineUsers.length} Online</span>
                            </div>

                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all"
                                title="Toggle Theme"
                            >
                                {darkMode ? <Sun className="w-5 h-5 text-orange-400" /> : <Moon className="w-5 h-5" />}
                            </button>

                            <button
                                onClick={()=>{navigate("/dashboard");}}
                                className="inline-flex items-center justify-center rounded-lg gap-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                            >
                                <GraduationCap className="w-4 h-4" />
                                <span className="hidden sm:inline">Student View</span>
                            </button>
                        </div>
                    </div>
                </header>

                <div className="sm:p-8 p-4 max-w-7xl mx-auto overflow-hidden relative">
                    <Routes>
                        <Route path="/" element={<ManageUsers users={users} setUsers={setUsers} subjects={subjects} />} />
                        <Route path="subjects" element={<ManageSubjects subjects={subjects} uniqueSubjectSections={uniqueSubjectSections} setUniqueSubjectSections={setUniqueSubjectSections} />} />
                        <Route path="content" element={<ManageContent pendingNotes={pendingNotes} />} />
                        <Route path="practicals" element={<ManagePracticals uniqueSubjectSections={uniqueSubjectSections} />} />
                        <Route path="pyqs" element={<ManagePYQs />} />
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
                                className="pointer-events-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-4 rounded-2xl shadow-2xl border border-slate-800 dark:border-slate-200 flex items-center gap-4 min-w-[280px]"
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-800 dark:bg-slate-100 flex items-center justify-center font-bold text-white dark:text-slate-900">
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
