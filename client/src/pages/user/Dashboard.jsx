import React, { useState, useMemo, useCallback, useEffect } from "react"
import { Routes, Route, useNavigate, Navigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import { Code, FileText, Download, X, HomeIcon, Search, ArrowUpRight } from "lucide-react"
import { BottomNavbar } from "@/components/layout/bottom-navbar"
import { NotePreviewModal } from "@/components/features/notes/note-preview-modal"
import { downloadFile } from "@/Utils/download";
import { useTitle } from "@/hooks/useTitle";
import { useData } from "@/context/DataContext";

import { Home } from "./Home";
import { Notes } from "./Notes";
import { Chatbot } from "./Chatbot";
import { Practicals } from "./Practicals";
import { Feedback } from "./Feedback";
import { Profile } from "./Profile";
import { AboutContact } from "./AboutContact";
import { Community } from "./Community";
import { Upgrade } from "./Upgrade";
import { PracticalCard } from "@/components/features/practicals/practical-card";
import { CodingPractice } from "./CodingPractice";
import CodeEditor from "./CodeEditor";
import PracticeDeatils from "./PracticeDeatils";
import Test from "@/Utils/Test";

import { TopNavBar } from "@/components/layout/top-navbar";
import { DashboardSidebar } from "@/components/layout/sidebar";
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
    Sparkles,
} from "lucide-react";

// NOTE: sidebar nav items expect icon COMPONENTS (functions/classes), not JSX literals like <Home />


export function StudentDashboard({ onLogout, onSwitchToAdmin, onAuth }) {
    useTitle("Dashboard");
    // Theme toggle is disabled (dark mode only enforced by ThemeContext)

    const {
        user,
        subjects,
        practicals,
        notes,
        loading,
        refreshNotes,
    } = useData();


    const [searchQuery, setSearchQuery] = useState("");
    const [selectedNote, setSelectedNote] = useState(null);
    const [isBell, setisBell] = useState(false);
    const [activeSearchTab, setActiveSearchTab] = useState("all"); // "all" | "subjects" | "practicals" | "notes"
    const navigate = useNavigate();

    useEffect(() => {
        setActiveSearchTab("all");
    }, [searchQuery]);

    const isAuthenticated = !!user;

    const handleNoteCreated = useCallback(() => {
        refreshNotes();
    }, [refreshNotes]);

    const handleDownload = useCallback((note) => {
        downloadFile(note.fileData, note.fileName || note.title);
    }, []);

    const userName = user?.username || "Student";
    const role = user?.role || "user";

    const searchResults = useMemo(() => {
        if (!searchQuery) return { subjects: [], practicals: [], notes: [] };

        const query = searchQuery.toLowerCase();
        return {
            subjects: subjects.filter(s =>
                (s.name)?.toLowerCase()?.includes(query) ||
                (s.code)?.toLowerCase()?.includes(query)
            ),
            practicals: practicals.filter(p =>
                (p.section)?.toLowerCase()?.includes(query) ||
                p.questions?.some(q => q?.question?.toLowerCase()?.includes(query) || q?.code?.toLowerCase()?.includes(query))
            ),
            notes: notes.filter(n =>
                (n.title)?.toLowerCase()?.includes(query) ||
                (n.content)?.toLowerCase()?.includes(query)
            ),
        };
    }, [searchQuery, subjects, practicals, notes]);

    const navItems = [
        { label: "Home", path: "/dashboard", icon: HomeIcon },
        { label: "Notes", path: "/dashboard/notes", icon: FileText },
        { label: "Practicals", path: "/dashboard/practicals", icon: FlaskConical },
        { label: "Practice", path: "/dashboard/coding-practice", icon: Code2 },
        { label: "AI Chatbot", path: "/dashboard/chatbot", icon: Sparkles },
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
                        setisBell={setisBell}
                        onLogout={() => {
                            // Handle logout
                            onLogout();

                        }}    // Add your logout logic here
                        onShare={() => {
                            navigate("/dashboard/notes", { state: { openShare: true } });
                        }}
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <TopNavBar
                        userName={userName}
                        userEmail={user?.email}
                        userAvatar={user?.avatar}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onLogout={onLogout}
                        onSwitchToAdmin={onSwitchToAdmin}
                        role={role}
                        isBell={isBell}
                        setisBell={setisBell}
                    />

                    {/* SideBar */}
                    <main className="flex-1 w-full sm:mt-20 mt-17 ">
                        <div className="">
                            {searchQuery ? (
                                <DashboardLayout>
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 select-none">

                                        {/* Search Header */}
                                        <div className="flex items-center justify-between gap-4 p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-black uppercase tracking-wider text-indigo-650 px-2 py-0.5 bg-indigo-50 border border-indigo-200 rounded">
                                                        Search Center
                                                    </span>
                                                </div>
                                                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mt-2 select-text">
                                                    Results for "{searchQuery}"
                                                </h2>
                                                <p className="text-xs text-zinc-400 mt-1">
                                                    Found {searchResults.subjects.length + searchResults.practicals.length + searchResults.notes.length} matches
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => setSearchQuery("")}
                                                className="px-4 py-2.5 text-xs font-black text-white bg-zinc-950 hover:bg-zinc-800 rounded-xl transition-all shadow-sm cursor-pointer"
                                            >
                                                Clear Search
                                            </button>
                                        </div>

                                        {/* Segmented Search Tabs */}
                                        <div className="flex items-center border border-zinc-200 bg-white p-1 rounded-xl gap-1 overflow-x-auto">
                                            <button
                                                onClick={() => setActiveSearchTab("all")}
                                                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all text-nowrap cursor-pointer flex items-center gap-2 ${activeSearchTab === "all"
                                                    ? "bg-zinc-950 text-white shadow-sm"
                                                    : "text-zinc-650 hover:bg-zinc-50"
                                                    }`}
                                            >
                                                All Results
                                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${activeSearchTab === "all" ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-400"
                                                    }`}>
                                                    {searchResults.subjects.length + searchResults.practicals.length + searchResults.notes.length}
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => setActiveSearchTab("subjects")}
                                                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all text-nowrap cursor-pointer flex items-center gap-2 ${activeSearchTab === "subjects"
                                                    ? "bg-zinc-950 text-white shadow-sm"
                                                    : "text-zinc-650 hover:bg-zinc-50"
                                                    }`}
                                            >
                                                Subjects
                                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${activeSearchTab === "subjects" ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-400"
                                                    }`}>
                                                    {searchResults.subjects.length}
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => setActiveSearchTab("practicals")}
                                                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all text-nowrap cursor-pointer flex items-center gap-2 ${activeSearchTab === "practicals"
                                                    ? "bg-zinc-950 text-white shadow-sm"
                                                    : "text-zinc-650 hover:bg-zinc-50"
                                                    }`}
                                            >
                                                Practicals
                                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${activeSearchTab === "practicals" ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-400"
                                                    }`}>
                                                    {searchResults.practicals.length}
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => setActiveSearchTab("notes")}
                                                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all text-nowrap cursor-pointer flex items-center gap-2 ${activeSearchTab === "notes"
                                                    ? "bg-zinc-950 text-white shadow-sm"
                                                    : "text-zinc-650 hover:bg-zinc-50"
                                                    }`}
                                            >
                                                My Notes
                                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${activeSearchTab === "notes" ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-400"
                                                    }`}>
                                                    {searchResults.notes.length}
                                                </span>
                                            </button>
                                        </div>

                                        {/* Results Lists */}
                                        <div className="space-y-8 mt-2">

                                            {/* Subjects Matches */}
                                            {(activeSearchTab === "all" || activeSearchTab === "subjects") && searchResults.subjects.length > 0 && (
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2 text-xs font-black text-zinc-400 uppercase tracking-wide">
                                                        <BookOpen className="w-4 h-4 text-indigo-500" />
                                                        <span>Subjects ({searchResults.subjects.length})</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                        {searchResults.subjects.map((subject, index) => {
                                                            const subjectName = subject.name || subject;
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    onClick={() => navigate('/dashboard/practicals', { state: { selectedSubject: subjectName } })}
                                                                    className="bg-white border border-zinc-200 hover:border-indigo-500 rounded-2xl p-5 hover:shadow-md cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 flex flex-col justify-between h-32 group"
                                                                >
                                                                    <div>
                                                                        <span className="text-[10px] font-black text-zinc-450 uppercase tracking-wider group-hover:text-indigo-655 transition-colors">
                                                                            {subject.code || "SUBJ"}
                                                                        </span>
                                                                        <h4 className="text-sm font-black text-zinc-850 truncate mt-1">
                                                                            {subjectName}
                                                                        </h4>
                                                                    </div>
                                                                    <span className="text-xs font-bold text-indigo-600 group-hover:underline flex items-center gap-1 mt-auto select-none">
                                                                        View Solutions
                                                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Practicals Matches */}
                                            {(activeSearchTab === "all" || activeSearchTab === "practicals") && searchResults.practicals.length > 0 && (
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2 text-xs font-black text-zinc-400 uppercase tracking-wide">
                                                        <FlaskConical className="w-4 h-4 text-indigo-500" />
                                                        <span>Practicals ({searchResults.practicals.length})</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-5">
                                                        {searchResults.practicals.map((practical, index) => (
                                                            <PracticalCard
                                                                key={index}
                                                                practical={practical}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Notes Matches */}
                                            {(activeSearchTab === "all" || activeSearchTab === "notes") && searchResults.notes.length > 0 && (
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2 text-xs font-black text-zinc-400 uppercase tracking-wide">
                                                        <FileText className="w-4 h-4 text-indigo-500" />
                                                        <span>Notes Matches ({searchResults.notes.length})</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                        {searchResults.notes.map((note) => (
                                                            <div
                                                                key={note._id}
                                                                className="bg-white rounded-2xl p-5 border border-zinc-200 hover:border-indigo-500 shadow-xs cursor-pointer hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-between"
                                                                onClick={() => setSelectedNote(note)}
                                                            >
                                                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                                                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-150 text-indigo-650 shrink-0">
                                                                        <FileText className="w-5 h-5" />
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">
                                                                            {note.section || "Resource"}
                                                                        </span>
                                                                        <h4 className="font-bold text-zinc-900 truncate mt-0.5">{note.title}</h4>
                                                                        <p className="text-[10px] text-zinc-455 mt-1 font-medium">
                                                                            Uploaded: {new Date(note.createdAt).toLocaleDateString()}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <ArrowUpRight className="w-4 h-4 text-zinc-400 shrink-0 ml-2" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Empty States */}
                                            {searchQuery && (
                                                (activeSearchTab === "all" && Object.values(searchResults).every(arr => arr.length === 0)) ||
                                                (activeSearchTab === "subjects" && searchResults.subjects.length === 0) ||
                                                (activeSearchTab === "practicals" && searchResults.practicals.length === 0) ||
                                                (activeSearchTab === "notes" && searchResults.notes.length === 0)
                                            ) && (
                                                    <div className="py-20 text-center select-none bg-white rounded-2xl border border-zinc-200 shadow-xs flex flex-col items-center justify-center max-w-sm mx-auto">
                                                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100">
                                                            <Search className="w-6 h-6 text-indigo-650" />
                                                        </div>
                                                        <div className="text-base font-bold text-zinc-950">
                                                            No results found
                                                        </div>
                                                        <div className="mt-1 text-xs text-zinc-400 leading-relaxed">
                                                            We couldn't find matches for "{searchQuery}" in {activeSearchTab === "all" ? "any category" : activeSearchTab}. Try using simpler keywords.
                                                        </div>
                                                    </div>
                                                )}

                                        </div>

                                        <NotePreviewModal
                                            note={selectedNote}
                                            onClose={() => setSelectedNote(null)}
                                        />
                                    </div>
                                </DashboardLayout>
                            ) : (
                                <Routes>
                                    {/* All Path */}
                                    <Route path="/" element={<Home />} />

                                    {/* Test Route */}
                                    <Route path="test" element={<Test />} />

                                    {/* Notes Route */}
                                    <Route path="notes" element={<Notes />} />

                                    {/* Practicals Route */}
                                    <Route path="practicals" element={<Practicals />} />

                                    {/* ChatBot Route */}
                                    <Route path="chatbot" element={<Chatbot />} />

                                    {/* Feedback and Community Routes */}
                                    <Route path="feedback" element={<Feedback user={user} />} />
                                    <Route path="community" element={<Community />} />

                                    {/* Upgrade Route */}
                                    <Route path="upgrade" element={<Upgrade />} />

                                    {/* Code pratice */}
                                    <Route path="coding-practice" element={<CodingPractice user={user} />} />
                                    <Route path="coding-practice/:language" element={<PracticeDeatils />} />

                                    {/* Profile route */}
                                    <Route path="profile" element={
                                        isAuthenticated ? (

                                            <Profile onLogout={onLogout} />
                                        ) : (
                                            <Navigate to="/dashboard" replace />
                                        )
                                    } />

                                    {/* About and Contact Route */}
                                    <Route path="about-contact" element={<AboutContact />} />
                                    <Route path="code-editor/:language/:problemId" element={<CodeEditor />} />
                                    <Route path="*" element={<Navigate to="" replace />} />
                                </Routes>
                            )}
                        </div>
                    </main >
                </div>
            </div>

            <BottomNavbar />
        </div >
    )
}
