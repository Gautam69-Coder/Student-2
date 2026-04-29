import React, { useState, useEffect, useMemo, useCallback } from "react"
import { Routes, Route, useNavigate, Navigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import PracticalUpload from "../../components/user/practical-upload"
import { Link } from "react-router-dom"
import {
    fetchSections,
    fetchPracticals,
    fetchNotes,
} from "@/Api/api"


import { Upload, Search, Command, Menu, Users, CloudCog, Code, FileText, Download, X, Bell } from "lucide-react"
import { ThemeToggle } from "@/components/common/theme-toggle"
import { BottomNavbar } from "@/components/user/bottom-navbar"
import { UploadModal } from "@/components/user/upload-modal"
import { userDetail } from "@/lib/user";
import { useTheme } from "@/context/ThemeContext";
import { useTitle } from "@/hooks/useTitle";
import { useData } from "@/context/DataContext";
import { toUpperName } from "@/Utils/ToUpperName";

import { Home } from "./Home";
import { Notes } from "./Notes";
import { Practicals } from "./Practicals";
import { Feedback } from "./Feedback";
import { Profile } from "./Profile";
import { AboutContact } from "./AboutContact";
import { Community } from "./Community";
import { PracticalCard } from "@/components/user/practical-card";
import Notification from "@/components/user/notification";

import { StudentNavbar } from "@/components/user/student-navbar"
import { AuthModal } from "@/components/common/auth-modal"

export function StudentDashboard({ onLogout, onSwitchToAdmin, onAuth }) {
    useTitle("Dashboard");
    const { darkMode, toggleDarkMode } = useTheme();
    const {
        user,
        subjects,
        practicals,
        notes,
        loading,
        refreshNotes
    } = useData();

    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [practicalUploadOpen, setPracticalUploadOpen] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedNote, setSelectedNote] = useState(null);
    const [isBell, setisBell] = useState(false);
    const navigate = useNavigate();

    const isAuthenticated = !!user;

    const handleAuthRequired = useCallback((action) => {
        if (!isAuthenticated) {
            setAuthModalOpen(true);
            return false;
        }
        if (action) action();
        return true;
    }, [isAuthenticated]);

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

    const searchResults = useMemo(() => {
        if (!searchQuery) return { subjects: [], practicals: [], notes: [] };

        const query = searchQuery.toLowerCase();
        return {
            subjects: subjects.filter(s => (s.name)?.toLowerCase()?.includes(query) || (s.code)?.toLowerCase()?.includes(query)),
            practicals: displayedPracticals.filter(p => (p.questions[0]?.question)?.toLowerCase()?.includes(query) || (p.section)?.toLowerCase()?.includes(query)),
            notes: displayedNotes.filter(n => (n.title)?.toLowerCase()?.includes(query) || (n.content)?.toLowerCase()?.includes(query)),
        };
    }, [searchQuery, subjects, practicals, notes]);

    const subjectPracticals = useMemo(() => {
        return practicals.reduce((acc, practical) => {
            if (!acc[practical.section]) {
                acc[practical.section] = [];
            }
            acc[practical.section].push(practical);
            return acc;
        }, {});
    }, [practicals]);

    const userName = user?.username || "Student";
    const role = user?.role || "user";
    const isGuest = !isAuthenticated;

    // Limit content for guests
    const displayedNotes = isAuthenticated ? notes : notes.slice(-3).reverse();
    const displayedPracticals = isAuthenticated ? practicals : practicals.slice(-3).reverse();

    return (
        <div className="flex flex-col min-h-screen bg-background dark:bg-slate-950 transition-colors duration-300">
            <StudentNavbar
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

            <main className="flex-1 w-full max-w-8xl mx-auto pt-24 px-4 sm:px-8">
                {!isAuthenticated && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-6 rounded-3xl bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-indigo-500/20 backdrop-blur-sm relative overflow-hidden"
                    >
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">You're exploring as a Guest</h2>
                            </div>
                            <button
                                onClick={() => setAuthModalOpen(true)}
                                className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                            >
                                Get Full Access
                            </button>
                        </div>
                        {/* Decorative blobs */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                    </motion.div>
                )}
                <div className="pb-24 lg:pb-8">
                    {searchQuery ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                    Search Results for "{searchQuery}"
                                </h2>
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="text-sm text-slate-500 hover:text-slate-900 font-medium"
                                >
                                    Clear Search
                                </button>
                            </div>

                            {/* Practicals Results */}
                            {searchResults.practicals.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg  font-semibold text-slate-700">Practicals</h3>
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
                            <Route path="profile" element={
                                isAuthenticated ? (
                                    <Profile onLogout={onLogout} />
                                ) : (
                                    <Navigate to="/dashboard" replace />
                                )
                            } />
                            <Route path="about-contact" element={<AboutContact />} />
                            <Route path="*" element={<Navigate to="" replace />} />
                        </Routes>
                    )}
                </div>

                {/* Footer */}
                <footer className="py-12 border-t border-border dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-t-3xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl mx-auto px-4">
                        <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500 text-sm font-medium">
                            <Link to="/dashboard/about-contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">About Us</Link>
                            <span>•</span>
                            <Link to="/dashboard/about-contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</Link>
                            <span>•</span>
                            <Link to="/dashboard/feedback" className="hover:text-slate-900 dark:hover:text-white transition-colors">Feedback</Link>
                        </div>
                        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">
                            © 2026 Student Hub. Built with ❤️ for students.
                        </p>
                    </div>
                </footer>
            </main >

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
            <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                onAuth={onAuth}
            />
            <BottomNavbar />
        </div >
    )
}
