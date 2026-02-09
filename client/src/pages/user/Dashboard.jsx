
import React, { useState, useEffect, useMemo, useCallback } from "react"
import { Routes, Route, useNavigate, Navigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
    fetchSections,
    fetchPracticals,
    fetchNotes,
    fetchBookmarks,
    toggleBookmark,
} from "@/Api/api"

import { Upload, Search, Command, Menu, Users, CloudCog, Sun, Moon, Code, FileText, Download, X } from "lucide-react"
import { StudentSidebar } from "@/components/user/student-sidebar"
import { BottomNavbar } from "@/components/user/bottom-navbar"
import { UploadModal } from "@/components/user/upload-modal"
import { userDetail } from "@/lib/user";
import { useTheme } from "@/context/ThemeContext";

import { Home } from "./Home";
import { Notes } from "./Notes";
import { Practicals } from "./Practicals";
import { PYQs } from "./PYQs";
import { Feedback } from "./Feedback";
import { Profile } from "./Profile";
import { notes, pyqSubjects } from "@/data/student-data";
import { PracticalCard } from "@/components/user/practical-card";

export function StudentDashboard({ userName, onLogout, onSwitchToAdmin }) {
    const { darkMode, toggleDarkMode } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024)
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [role, setrole] = useState("user");
    const [currentUser, setCurrentUser] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [practicals, setPracticals] = useState([]);
    const [notes, setNotes] = useState([]);
    const [notesRefreshKey, setNotesRefreshKey] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [subjectPracticals, setSubjectPracticals] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [userBookmarks, setUserBookmarks] = useState([]);
    const [loadingPracticals, setLoadingPracticals] = useState(true);
    const navigate = useNavigate();

    const handleNoteCreated = useCallback(() => {
        setNotesRefreshKey(prev => prev + 1);
    }, []);

    const handleDownload = useCallback((note) => {
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = note.fileData; // Assuming fileData is the base64/url
        link.download = note.fileName || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, []);

    const searchResults = useMemo(() => {
        if (!searchQuery) return { subjects: [], practicals: [], notes: [], pyqs: [] };

        const query = searchQuery.toLowerCase();

        return {
            subjects: subjects.filter(s => (s.name)?.toLowerCase()?.includes(query) || (s.code)?.toLowerCase()?.includes(query)),
            practicals: practicals.filter(p => (p.questions[0]?.question)?.toLowerCase()?.includes(query) || (p.section)?.toLowerCase()?.includes(query)),
            notes: notes.filter(n => (n.title)?.toLowerCase()?.includes(query) || (n.content)?.toLowerCase()?.includes(query)),
            pyqs: pyqSubjects.filter(p => (p.name)?.toLowerCase()?.includes(query))
        };
    }, [searchQuery, subjects, practicals, notes]);

    const fetchSubjects = useCallback(() => {
        const section = fetchSections();
        section.then((res) => {
            setSubjects(res.data)
        });
    }, [])

    const fetchPractical = useCallback(() => {
        setLoadingPracticals(true);
        const practical = fetchPracticals();
        practical.then((res) => {
            setPracticals(res.data)
            const grouped = res.data.reduce((acc, practical) => {
                if (!acc[practical.section]) {
                    acc[practical.section] = [];
                }
                acc[practical.section].push(practical);
                return acc;
            }, {});
            setSubjectPracticals(grouped);
        }).finally(() => {
            setLoadingPracticals(false);
        });
    }, [])

    const fetchUserNotes = useCallback(() => {
        fetchNotes().then((res) => {
            setNotes(res.data);
        }).catch(err => console.error("Error fetching notes for search:", err));
    }, [])

    const fetchUserBookmarks = useCallback(async () => {
        try {
            const res = await fetchBookmarks();
            setUserBookmarks(res.data.map(b => b._id));
        } catch (err) {
            console.error("Error fetching bookmarks:", err);
        }
    }, []);

    const handleToggleBookmark = useCallback(async (practicalId) => {
        try {
            await toggleBookmark(practicalId);
            setUserBookmarks(prev => {
                if (prev.includes(practicalId)) {
                    return prev.filter(id => id !== practicalId);
                } else {
                    return [...prev, practicalId];
                }
            });
        } catch (err) {
            console.error("Error toggling bookmark:", err);
        }
    }, []);

    useEffect(() => {
        fetchSubjects();
        fetchPractical();
        fetchUserNotes();
        fetchUserBookmarks();
    }, [])

    useEffect(() => {
        if (notesRefreshKey > 0) {
            fetchUserNotes();
        }
    }, [notesRefreshKey])

    useEffect(() => {
        userDetail().then((user) => {
            setrole(user.role);
            setCurrentUser(user);
        })
    }, [])

    return (
        <div className="flex min-h-screen bg-background dark:bg-slate-950 transition-colors duration-300">
            <StudentSidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                onLogout={onLogout}
            />

            <main className={`flex-1 transition-[margin] duration-300 ${sidebarOpen ? "lg:ml-64" : "ml-0"}`}>
                {/* Header - Minimalist White Bar */}
                <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-b border-border dark:border-slate-800">
                    <div className="flex items-center justify-between sm:px-8 px-4 py-4">
                        {/* Search Bar - Command K Style */}
                        <div className="flex-1 max-w-2xl mx-6">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-slate-600 dark:group-focus-within:text-slate-300 transition-colors" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search notes, practicals, PYQs..."
                                    className="w-full h-10 pl-10 pr-20 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-slate-400/50 rounded-lg shadow-sm transition-all text-sm dark:text-white"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-[10px] font-medium text-slate-400 dark:text-slate-500">
                                    <Command className="w-3 h-3" />
                                    <span>K</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
                                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            >
                                {darkMode ? <Sun className="w-5 h-5 text-orange-400" /> : <Moon className="w-5 h-5" />}
                            </button>

                            <button
                                onClick={() => setUploadModalOpen(true)}
                                className="flex items-center justify-center bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white px-4 h-10 rounded-lg gap-2 shadow-sm transition-all active:scale-[0.98] text-sm font-bold"
                            >
                                <Upload className="w-4 h-4" />
                                <span className="hidden sm:inline">Share Notes</span>
                            </button>
                            {(role === "admin" || role === "superadmin") && (
                                <button
                                    onClick={onSwitchToAdmin}
                                    className="flex items-center justify-center rounded-lg gap-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 h-10 text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-700"
                                >
                                    <Users className="w-4 h-4" />
                                    <span className="hidden sm:inline">Admin View</span>
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-2 sm:p-8 sm:max-w-7xl max-w-2xl mx-auto pb-24 lg:pb-8">
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
                                    <h3 className="text-lg font-semibold text-slate-700">Practicals</h3>
                                    <div className=" gap-6">
                                        {searchResults.practicals.map((practical, index) => (
                                            <div key={index} className="mb-4">
                                                <PracticalCard
                                                    practical={practical}
                                                    isBookmarked={userBookmarks.includes(practical._id)}
                                                    onToggleBookmark={handleToggleBookmark}
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
                                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
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
                            <Route path="/" element={<Home userName={userName} subjects={subjects} subjectPracticals={subjectPracticals} practicals={practicals} loadingPracticals={loadingPracticals} userBookmarks={userBookmarks} setUserBookmarks={setUserBookmarks} onToggleBookmark={handleToggleBookmark} />} />
                            <Route path="notes" element={<Notes refreshKey={notesRefreshKey} />} />
                            <Route path="practicals" element={<Practicals practicals={practicals} subjects={subjects} userBookmarks={userBookmarks} onToggleBookmark={handleToggleBookmark} />} />
                            <Route path="pyqs" element={<PYQs />} />
                            <Route path="feedback" element={<Feedback user={currentUser} />} />
                            <Route path="profile" element={<Profile onLogout={onLogout} />} />
                            <Route path="*" element={<Navigate to="" replace />} />
                        </Routes>
                    )}
                </div>
            </main >

            <UploadModal
                open={uploadModalOpen}
                onOpenChange={setUploadModalOpen}
                onNoteCreated={handleNoteCreated}
            />

            <BottomNavbar />
        </div >
    )
}
