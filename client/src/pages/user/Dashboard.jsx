import React, { useState, useMemo, useCallback } from "react"
import { Routes, Route, useNavigate, Navigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import PracticalUpload from "../../components/features/practicals/practical-upload"
import { Link } from "react-router-dom"

import { Code, FileText, Download, X, HomeIcon } from "lucide-react"
import { BottomNavbar } from "@/components/layout/bottom-navbar"
import { UploadModal } from "@/components/features/notes/upload-modal"
import { useTheme } from "@/context/ThemeContext";
import { useTitle } from "@/hooks/useTitle";
import { useData } from "@/context/DataContext";

import { Home } from "./Home";
import { Notes } from "./Notes";
import { Practicals } from "./Practicals";
import { Feedback } from "./Feedback";
import { Profile } from "./Profile";
import { AboutContact } from "./AboutContact";
import { Community } from "./Community";
import { PracticalCard } from "@/components/features/practicals/practical-card";
import { CodingPractice } from "./CodingPractice";
import CodeEditor from "./CodeEditor";
import PracticeDeatils from "./PracticeDeatils";

import { StudentNavbar } from "@/components/layout/student-navbar";
import { TopNavBar } from "../../components/layout/top-navbar";
import { DashboardSidebar } from "@/components/layout/sidebar";
import { DashStatCard, DashStatCard as DashboardStatCard } from "@/components/widgets/stat-card";
import { DashboardLayout } from "@/components/layout/layout";

import {
    Bell,
    CheckCircle2,
    Clock,
    Plus,
    TrendingUp,
    Zap,
    BookOpen,
    LayoutGrid,
    FlaskConical,
    Users,
    MessageSquare,
    Info,
    BarChart3,
    Code2,
} from "lucide-react";

// NOTE: sidebar nav items expect icon COMPONENTS (functions/classes), not JSX literals like <Home />


export function StudentDashboard({ onLogout, onSwitchToAdmin, onAuth }) {
    useTitle("Dashboard");
    // Theme toggle is disabled (dark mode only enforced by ThemeContext)
    useTheme();

    const {
        user,
        subjects,
        practicals,
        notes,
        loading,
        refreshNotes,
    } = useData();

    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [practicalUploadOpen, setPracticalUploadOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedNote, setSelectedNote] = useState(null);
    const [isBell, setisBell] = useState(false);
    const navigate = useNavigate();

    const isAuthenticated = !!user;

    const handleAuthRequired = useCallback((action) => {
        if (!isAuthenticated) {
            navigate('/login');
            return false;
        }
        if (action) action();
        return true;
    }, [isAuthenticated, navigate]);

    const handleNoteCreated = useCallback(() => {
        refreshNotes();
    }, [refreshNotes]);

    const handleDownload = useCallback((note) => {
        const link = document.createElement('a');
        link.href = note.fileData;
        link.download = note.fileName || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, []);

    const userName = user?.username || "Student";
    const role = user?.role || "user";
    const isGuest = !isAuthenticated;

    // Limit content for guests - Memoized to prevent reference changes
    const displayedNotes = useMemo(() =>
        isAuthenticated ? notes : notes.slice(-3).reverse(),
        [isAuthenticated, notes]);

    const displayedPracticals = useMemo(() =>
        isAuthenticated ? practicals : practicals.slice(-3).reverse(),
        [isAuthenticated, practicals]);

    const subjectPracticals = useMemo(() => {
        if (!user) return [];
        return practicals.filter(p => p.subject?._id === user.subject?._id);
    }, [user, practicals]);

    const searchResults = useMemo(() => {
        if (!searchQuery) return { subjects: [], practicals: [], notes: [] };

        const query = searchQuery.toLowerCase();
        return {
            subjects: subjects.filter(s => (s.name)?.toLowerCase()?.includes(query) || (s.code)?.toLowerCase()?.includes(query)),
            practicals: displayedPracticals.filter(p => (p.questions[0]?.question)?.toLowerCase()?.includes(query) || (p.section)?.toLowerCase()?.includes(query)),
            notes: displayedNotes.filter(n => (n.title)?.toLowerCase()?.includes(query) || (n.content)?.toLowerCase()?.includes(query)),
        };
    }, [searchQuery, subjects, displayedPracticals, displayedNotes]);

    const navItems = [
        { label: "Home", path: "/dashboard", icon: HomeIcon },
        { label: "Notes", path: "/dashboard/notes", icon: FileText },
        { label: "Practicals", path: "/dashboard/practicals", icon: FlaskConical },
        { label: "Practice", path: "/dashboard/coding-practice", icon: Code2 },
        { label: "Community", path: "/dashboard/community", icon: Users },
        { label: "Feedback", path: "/dashboard/feedback", icon: MessageSquare },
        { label: "About", path: "/dashboard/about-contact", icon: Info },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background  transition-colors duration-300">
            <div className="flex">
                <div>
                    <DashboardSidebar
                        navItems={navItems}
                        userName={userName || "Student Name"}
                        userEmail={user?.email || "student@email.com"}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        isBell={isBell}
                        setisBell={isBell}
                        onLogout={() => {
                            // Handle logout
                            console.log("Logout clicked");
                            onLogout();

                        }}    // Add your logout logic here
                        onShare={() => {
                            // Handle share
                            console.log("Share clicked");
                            setUploadModalOpen(true);
                            // Add your share/upload logic here
                        }}
                    />
                </div>

                <div className="w-full">

                    <TopNavBar
                        userName={userName}
                        userEmail={user?.email}
                        userAvatar={user?.avatar}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onLogout={onLogout}
                        onSwitchToAdmin={onSwitchToAdmin}
                        role={role}
                        setUploadModalOpen={() => handleAuthRequired(() => setUploadModalOpen(true))}
                        isBell={isBell}
                        setisBell={setisBell}
                        requireAuth={handleAuthRequired}
                    />

                    <main className="flex-1 w-full  ">

                        <div className="">

                            {searchQuery ? (
                                <DashboardLayout>
                                    <div className="space-y-8  animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <div className="text-[22px] font-bold" style={{ color: "#0f172a" }}>
                                                    Study
                                                </div>
                                                <div className="text-[13px] font-medium" style={{ color: "#64748b", marginTop: 4 }}>
                                                    Search results for "{searchQuery}"
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => setSearchQuery("")}
                                                className="text-sm font-bold"
                                                style={{ color: "#84cc16" }}
                                            >
                                                Clear
                                            </button>
                                        </div>


                                        {/* Practicals Results */}
                                        {searchResults.practicals.length > 0 && (
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-bold" style={{ color: "#0f172a" }}>
                                                    Practicals
                                                </h3>
                                                <div className="gap-6 w-full grid grid-cols-1">

                                                    {searchResults.practicals.map((practical, index) => (
                                                        <div key={index}>
                                                            <PracticalCard
                                                                practical={practical}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Notes Results */}
                                        {searchResults.notes.length > 0 && (
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">My Notes</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    {searchResults.notes.map((note, index) => (
                                                        <div
                                                            key={note._id}
                                                            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:shadow-md transition-all"
                                                            onClick={() => setSelectedNote(note)}
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                                                    <Code className="w-5 h-5 text-slate-900 dark:text-white" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-slate-900 dark:text-white">{note.title}</h4>
                                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                                        {new Date(note.createdAt).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {selectedNote && (
                                            <AnimatePresence>
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
                                                    onClick={() => setSelectedNote(null)}
                                                >
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                        className="relative w-full max-w-4xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                                                            <div>
                                                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedNote.title}</h2>
                                                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                                    {selectedNote.section} • Created on {new Date(selectedNote.createdAt).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => handleDownload(selectedNote)}
                                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium transition-all"
                                                                >
                                                                    <Download className="w-4 h-4" />
                                                                    Download {selectedNote.fileName}
                                                                </button>
                                                                <button
                                                                    onClick={() => setSelectedNote(null)}
                                                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                                                >
                                                                    <X className="w-5 h-5 text-slate-400" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="flex-1 overflow-auto bg-slate-50 dark:bg-black p-6 flex items-center justify-center">
                                                            {selectedNote.fileType?.startsWith('image/') ? (
                                                                <img src={selectedNote.fileData} alt={selectedNote.title} className="max-w-full max-h-full object-contain rounded-lg shadow-xl" />
                                                            ) : (
                                                                <div className="text-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                                                    <FileText className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                                                                    <p className="text-slate-600 dark:text-slate-300 font-bold mb-2">Full File Preview Unavailable</p>
                                                                    <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">This {selectedNote.fileType?.split('/')[1] || 'file'} type cannot be displayed in-browser.</p>
                                                                    <button
                                                                        onClick={() => handleDownload(selectedNote)}
                                                                        className="px-6 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                                                                    >
                                                                        Download to View
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                </motion.div>
                                            </AnimatePresence>
                                        )}
                                        {searchQuery && Object.values(searchResults).every(arr => arr.length === 0) && (
                                            <div className="text-center py-12">
                                                <h3 className="text-lg font-medium text-slate-900">No results found</h3>
                                                <p className="text-slate-500 mt-1">Try adjusting your search terms</p>
                                            </div>
                                        )}
                                    </div>
                                </DashboardLayout>
                            ) : (
                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            <Home
                                                userName={userName}
                                                subjects={subjects}
                                                subjectPracticals={subjectPracticals}
                                                practicals={displayedPracticals}
                                                loadingPracticals={loading.practicals}
                                                requireAuth={handleAuthRequired}
                                                isGuest={isGuest}
                                                stats={{
                                                    notesCount: notes.length,
                                                    visitCount: user?.visitCount || 0,
                                                    lastVisit: user?.lastVisit || null,
                                                }}
                                            />
                                        }
                                    />
                                    <Route path="notes" element={
                                        <Notes
                                            notes={displayedNotes}
                                            user={user}
                                            loading={loading.notes}
                                            onRefresh={handleNoteCreated}
                                            requireAuth={handleAuthRequired}
                                        />
                                    } />
                                    <Route path="practicals" element={<Practicals practicals={displayedPracticals} setPracticalUploadOpen={() => handleAuthRequired(() => setPracticalUploadOpen(true))} subjects={subjects} requireAuth={handleAuthRequired} />} />
                                    <Route path="feedback" element={<Feedback user={user} requireAuth={handleAuthRequired} />} />
                                    <Route path="community" element={<Community requireAuth={handleAuthRequired} />} />
                                    <Route path="coding-practice" element={<CodingPractice user={user} />} />
                                    <Route path="coding-practice/:language" element={<PracticeDeatils />} />
                                    <Route path="profile" element={
                                        isAuthenticated ? (

                                            <Profile onLogout={onLogout} />
                                        ) : (
                                            <Navigate to="/dashboard" replace />
                                        )
                                    } />
                                    <Route path="about-contact" element={<AboutContact />} />
                                    <Route path="code-editor/:language/:problemId" element={<CodeEditor />} />
                                    <Route path="*" element={<Navigate to="" replace />} />
                                </Routes>
                            )}

                        </div>

                    </main >

                </div>



            </div>







            <UploadModal
                open={uploadModalOpen}
                onOpenChange={setUploadModalOpen}
                onNoteCreated={handleNoteCreated}
            />

            <PracticalUpload
                open={practicalUploadOpen}
                onOpenChange={setPracticalUploadOpen}
                uniqueSubjects={subjects}
            />
            <BottomNavbar />
        </div >
    )
}
