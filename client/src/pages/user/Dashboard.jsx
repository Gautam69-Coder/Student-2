
import React, { useState, useEffect } from "react"
import { Routes, Route, useNavigate, Navigate } from "react-router-dom"
import {
    fetchSections,
    fetchPracticals,
} from "@/Api/api"

import { Upload, Search, Command, Menu, Users, CloudCog } from "lucide-react"
import { StudentSidebar } from "@/components/user/student-sidebar"
import { UploadModal } from "@/components/user/upload-modal"
import { userDetail } from "@/lib/user";

import { Home } from "./Home";
import { Notes } from "./Notes";
import { Practicals } from "./Practicals";
import { PYQs } from "./PYQs";
import { Feedback } from "./Feedback";
import { notes, pyqSubjects } from "@/data/student-data";
import { PracticalCard } from "@/components/user/practical-card";

export function StudentDashboard({ userName, onLogout, onSwitchToAdmin }) {
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024)
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [role, setrole] = useState("user");
    const [subjects, setSubjects] = useState([]);
    const [practicals, setPracticals] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [subjectPracticals, setSubjectPracticals] = useState([]);
    const navigate = useNavigate();

    const searchResults = React.useMemo(() => {
        if (!searchQuery) return { subjects: [], practicals: [], notes: [], pyqs: [] };

        const query = searchQuery.toLowerCase();

        return {
            subjects: subjects.filter(s => (s.name)?.toLowerCase()?.includes(query) || (s.code)?.toLowerCase()?.includes(query)),
            practicals: practicals.filter(p => (p.questions[0].question)?.toLowerCase()?.includes(query) || (p.section)?.toLowerCase()?.includes(query)),
            notes: notes.filter(n => (n.title)?.toLowerCase()?.includes(query) || (n.subject)?.toLowerCase()?.includes(query)),
            pyqs: pyqSubjects.filter(p => (p.name)?.toLowerCase()?.includes(query))
        };
    }, [searchQuery, subjects, practicals, notes, pyqSubjects]);

    const fetchSubjects = () => {
        const section = fetchSections();
        section.then((res) => {
            setSubjects(res.data)
        });
    }

    const fetchPractical = () => {
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
        });
    }

    useEffect(() => {
        fetchSubjects();
        fetchPractical();
    }, [])

    useEffect(() => {
        userDetail().then((user) => {
            setrole(user.role);
        })
    }, [])

    return (
        <div className="flex min-h-screen bg-[#FCFAF8]">
            <StudentSidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                onLogout={onLogout}
            />

            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "ml-0"}`}>
                {/* Header - Minimalist White Bar */}
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#E5E5E5]">
                    <div className="flex items-center justify-between sm:px-8 px-4 py-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-md hover:bg-slate-100 transition-colors lg:hidden"
                        >
                            <Menu className="w-5 h-5 text-slate-600" />
                        </button>

                        {/* Search Bar - Command K Style */}
                        <div className="flex-1 max-w-2xl mx-6">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search notes, practicals, PYQs..."
                                    className="w-full h-10 pl-10 pr-20 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-300 rounded-lg shadow-sm transition-all text-sm"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] font-medium text-slate-400">
                                    <Command className="w-3 h-3" />
                                    <span>K</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setUploadModalOpen(true)}
                                className="flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white px-4 h-10 rounded-lg gap-2 shadow-sm transition-all active:scale-[0.98] text-sm font-medium"
                            >
                                <Upload className="w-4 h-4" />
                                <span className="hidden sm:inline">Share Notes</span>
                            </button>
                            {(role === "admin" || role === "superadmin") && (
                                <button
                                    onClick={onSwitchToAdmin}
                                    className="flex items-center justify-center rounded-lg gap-2 border border-slate-200 bg-white px-4 h-10 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                                >
                                    <Users className="w-4 h-4" />
                                    <span className="hidden sm:inline">Admin View</span>
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-2 sm:p-8 sm:max-w-7xl max-w-2xl mx-auto">
                    {searchQuery ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between">
                                <h2 className="sm:text-2xl text-xl font-bold text-slate-900 tracking-tight">
                                    Search Results for "{searchQuery}"
                                </h2>
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="text-sm text-slate-500 hover:text-slate-900 font-medium"
                                >
                                    Clear Search
                                </button>
                            </div>

                            {/* Subjects Results */}
                            {/* {searchResults.subjects.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-slate-700">Subjects</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {searchResults.subjects.map((subject, index) => (
                                            <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                                <h4 className="font-bold text-slate-900">{subject.name}</h4>
                                                <p className="text-sm text-slate-500 mt-1">{subject.code}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )} */}

                            {/* Practicals Results */}
                            {searchResults.practicals.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-slate-700">Practicals</h3>
                                    <div className=" gap-6">
                                        {searchResults.practicals.map((practical, index) => (
                                            <div key={index} className="mb-4">
                                                <PracticalCard practical={practical} index={index} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Notes Results */}
                            {/* {searchResults.notes.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-slate-700">Notes</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {searchResults.notes.map((note, index) => (
                                            <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-start gap-4">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-slate-900">{note.title}</h4>
                                                    <p className="text-sm text-slate-500 mt-1">{note.subject} • {note.author}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )} */}

                            {/* PYQ Results */}
                            {/* {searchResults.pyqs.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-slate-700">Previous Year Questions</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {searchResults.pyqs.map((pyq, index) => (
                                            <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                                <h4 className="font-bold text-slate-900">{pyq.name}</h4>
                                                <p className="text-sm text-slate-500 mt-1">{pyq.papers.length} Papers Available</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )} */}

                            {searchQuery && Object.values(searchResults).every(arr => arr.length === 0) && (
                                <div className="text-center py-12">
                                    <h3 className="text-lg font-medium text-slate-900">No results found</h3>
                                    <p className="text-slate-500 mt-1">Try adjusting your search terms</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Routes>
                            <Route path="/" element={<Home userName={userName} subjects={subjects} subjectPracticals={subjectPracticals} practicals={practicals} />} />
                            <Route path="notes" element={<Notes />} />
                            <Route path="practicals" element={<Practicals practicals={practicals} subjects={subjects} />} />
                            <Route path="pyqs" element={<PYQs />} />
                            <Route path="feedback" element={<Feedback />} />
                            <Route path="*" element={<Navigate to="" replace />} />
                        </Routes>
                    )}
                </div>
            </main >

            <UploadModal open={uploadModalOpen} onOpenChange={setUploadModalOpen} />
        </div >
    )
}
