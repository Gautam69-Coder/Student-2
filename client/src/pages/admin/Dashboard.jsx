import React, { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { fetchUsers, fetchContent, fetchSections } from "@/Api/api";
import { GraduationCap, Menu, X } from "lucide-react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { useSocket } from "@/context/SocketContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTitle } from "@/hooks/useTitle";
import { ThemeToggle } from "@/components/common/theme-toggle";

const ManageUsers = lazy(() => import("./ManageUsers").then((m) => ({ default: m.ManageUsers })));
const ManageSubjects = lazy(() => import("./ManageSubjects").then((m) => ({ default: m.ManageSubjects })));
const ManagePracticals = lazy(() => import("./ManagePracticals").then((m) => ({ default: m.ManagePracticals })));
const ManagePractice = lazy(() => import("./ManagePractice").then((m) => ({ default: m.ManagePractice })));
const AnalyticsDashboard = lazy(() => import("./AnalyticsDashboard").then((m) => ({ default: m.AnalyticsDashboard })));
const ManageFeedback = lazy(() => import("./ManageFeedback").then((m) => ({ default: m.ManageFeedback })));
const MessageSender = lazy(() => import("./MessageSender").then((m) => ({ default: m.MessageSender })));
const ManageNotification = lazy(() => import("./ManageNotification").then((m) => ({ default: m.ManageNotification })));

const AdminSubLoader = () => (
    <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
);

export function AdminPanel({ userName, onLogout }) {
    useTitle("Admin Panel");
    const { onlineUsers, lastVisit, socket } = useSocket();
    const [sidebarOpen, setSidebarOpen] = useState(
        typeof window !== "undefined" ? window.innerWidth >= 1024 : true
    );
    const [users, setUsers] = useState([]);
    const [subjects, setSubjects] = useState([]);
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
                const list = Array.isArray(res.data?.data)
                    ? res.data.data
                    : Array.isArray(res.data)
                    ? res.data
                    : [];
                setUniqueSubjectSections(list);
            } catch (err) {
                console.error("Failed to fetch sections:", err);
            }
        };

        loadUsers();
        loadContent();
        loadSectionsData();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on("user_stats_update", (data) => {
            setUsers((currentUsers) =>
                currentUsers.map((user) =>
                    user._id === data.userId ? { ...user, visitCount: data.visitCount } : user
                )
            );
        });

        return () => socket.off("user_stats_update");
    }, [socket]);

    useEffect(() => {
        if (lastVisit && lastVisit.username !== userName) {
            const id = Date.now();
            setNotifications((prev) => [...prev, { id, ...lastVisit }]);
            setTimeout(() => {
                setNotifications((prev) => prev.filter((n) => n.id !== id));
            }, 5000);
        }
    }, [lastVisit]);

    return (
        <div className="flex min-h-screen transition-colors duration-200 bg-background text-foreground">
            <AdminSidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                onLogout={onLogout}
            />

            <main className={`flex-1 min-w-0 transition-all duration-200 ${sidebarOpen ? "lg:ml-64" : "ml-0"}`}>
                <header className="sticky top-0 z-30 bg-card/85 backdrop-blur-xl border-b border-border">
                    <div className="flex items-center justify-between px-4 sm:px-8 h-16">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen((v) => !v)}
                                aria-label="Toggle admin sidebar"
                                className="inline-flex items-center justify-center min-h-[40px] min-w-[40px] rounded-xl border border-border bg-background hover:bg-secondary text-foreground transition-colors"
                            >
                                <Menu className="w-5 h-5" aria-hidden="true" />
                            </button>
                            <div>
                                <h1 className="text-base sm:text-lg font-extrabold text-foreground leading-none">
                                    Admin Workspace
                                </h1>
                                <p className="text-[11px] text-muted-foreground font-medium mt-1">
                                    Operator: {userName}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" aria-hidden="true" />
                                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
                                    {onlineUsers.length} Online
                                </span>
                            </div>

                            <ThemeToggle />

                            <button
                                type="button"
                                onClick={() => navigate("/dashboard")}
                                className="inline-flex items-center justify-center rounded-xl gap-1.5 border border-border bg-card hover:bg-secondary active:scale-[0.98] px-3.5 min-h-[40px] text-xs font-bold text-foreground transition-all"
                            >
                                <GraduationCap className="w-4 h-4 text-primary" aria-hidden="true" />
                                <span>Student View</span>
                            </button>
                        </div>
                    </div>
                </header>

                <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-x-hidden relative">
                    <Suspense fallback={<AdminSubLoader />}>
                        <Routes>
                            <Route path="/" element={<ManageUsers users={users} setUsers={setUsers} subjects={subjects} />} />
                            <Route
                                path="subjects"
                                element={
                                    <ManageSubjects
                                        subjects={subjects}
                                        uniqueSubjectSections={uniqueSubjectSections}
                                        setUniqueSubjectSections={setUniqueSubjectSections}
                                    />
                                }
                            />
                            <Route path="practicals" element={<ManagePracticals uniqueSubjectSections={uniqueSubjectSections} />} />
                            <Route path="practice" element={<ManagePractice />} />
                            <Route path="analytics" element={<AnalyticsDashboard users={users} />} />
                            <Route path="feedback" element={<ManageFeedback />} />
                            <Route path="messages" element={<MessageSender users={users} />} />
                            <Route path="notifications" element={<ManageNotification />} />
                            <Route path="*" element={<Navigate to="" replace />} />
                        </Routes>
                    </Suspense>
                </div>

                {/* Live Activity Toast */}
                <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
                    <AnimatePresence>
                        {notifications.map((notification) => (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, x: 60, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                                className="pointer-events-auto bg-popover text-popover-foreground px-4 py-3.5 rounded-2xl shadow-2xl border border-border flex items-center gap-3 min-w-[260px]"
                            >
                                <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                                    {notification.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-foreground truncate">
                                        {notification.username} is online
                                    </p>
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                                        Active now
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setNotifications((n) => n.filter((x) => x.id !== notification.id))}
                                    aria-label="Dismiss notification"
                                    className="ml-auto p-1 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-4 h-4" aria-hidden="true" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
