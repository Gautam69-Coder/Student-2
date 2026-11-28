import { useState, useMemo, useCallback, useEffect, lazy, Suspense } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { FileText, HomeIcon, Search, ArrowUpRight, BookOpen, FlaskConical, Users, MessageSquare, Code2 } from "lucide-react";
import { BottomNavbar } from "@/components/layout/bottom-navbar";
import { NotePreviewModal } from "@/components/features/notes/note-preview-modal";
import { useTitle } from "@/hooks/useTitle";
import { useData } from "@/context/DataContext";
import { useNotes } from "@/hooks/useNotes";
import { usePracticals } from "@/hooks/usePracticals";
import { useSubjects } from "@/hooks/useSubjects";
import { canAccessPracticals } from "@/Utils/vesCheck";
import { PracticalCard } from "@/components/features/practicals/practical-card";
import { TopNavBar } from "@/components/layout/top-navbar";
import { DashboardSidebar } from "@/components/layout/sidebar";
import { DashboardLayout } from "@/components/layout/layout";

const Home = lazy(() => import("./Home").then((m) => ({ default: m.Home })));
const Notes = lazy(() => import("./Notes").then((m) => ({ default: m.Notes })));
const Practicals = lazy(() => import("./Practicals").then((m) => ({ default: m.Practicals })));
const Feedback = lazy(() => import("./Feedback").then((m) => ({ default: m.Feedback })));
const Profile = lazy(() => import("./Profile").then((m) => ({ default: m.Profile })));
const Community = lazy(() => import("./Community").then((m) => ({ default: m.Community })));
const CodingPractice = lazy(() => import("./CodingPractice").then((m) => ({ default: m.CodingPractice })));
const CodeEditor = lazy(() => import("./CodeEditor"));
const PracticeDetails = lazy(() => import("./PracticeDetails"));

const SubpageLoader = () => (
    <div className="flex items-center justify-center min-h-[350px]">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
);

export function StudentDashboard({ onLogout, onSwitchToAdmin }) {
    useTitle("Dashboard");

    const { user } = useData();
    const [searchQuery, setSearchQuery] = useState("");
    const isSearching = !!searchQuery.trim();
    const { subjects = [] } = useSubjects({ enabled: isSearching });
    const { practicals = [] } = usePracticals({ enabled: isSearching && canAccessPracticals(user) });
    const { notes = [] } = useNotes({ enabled: isSearching });
    const [selectedNote, setSelectedNote] = useState(null);
    const [isBell, setisBell] = useState(false);
    const [activeSearchTab, setActiveSearchTab] = useState("all");
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        return localStorage.getItem("sidebar_collapsed") === "true";
    });

    const toggleSidebarCollapse = useCallback(() => {
        setIsSidebarCollapsed((prev) => {
            const next = !prev;
            localStorage.setItem("sidebar_collapsed", String(next));
            return next;
        });
    }, []);

    const navigate = useNavigate();

    useEffect(() => {
        setActiveSearchTab("all");
    }, [searchQuery]);

    const isAuthenticated = !!user;
    const userName = user?.username || "Student";
    const role = user?.role || "user";

    const searchResults = useMemo(() => {
        if (!searchQuery) return { subjects: [], practicals: [], notes: [] };

        const query = searchQuery.toLowerCase();
        const hasPracticalAccess = canAccessPracticals(user);
        return {
            subjects: subjects.filter(
                (s) => s.name?.toLowerCase()?.includes(query) || s.code?.toLowerCase()?.includes(query)
            ),
            practicals: hasPracticalAccess
                ? practicals.filter(
                      (p) =>
                          p.section?.toLowerCase()?.includes(query) ||
                          p.questions?.some(
                              (q) =>
                                  q?.question?.toLowerCase()?.includes(query) ||
                                  q?.code?.map((i) => i)?.includes(query)
                          )
                  )
                : [],
            notes: notes.filter(
                (n) => n.title?.toLowerCase()?.includes(query) || n.content?.toLowerCase()?.includes(query)
            ),
        };
    }, [searchQuery, subjects, practicals, notes, user]);

    const navItems = [
        { label: "Home", path: "/dashboard", icon: HomeIcon },
        { label: "Notes", path: "/dashboard/notes", icon: FileText },
        ...(canAccessPracticals(user)
            ? [{ label: "Practicals", path: "/dashboard/practicals", icon: FlaskConical }]
            : []),
        { label: "Practice", path: "/dashboard/coding-practice", icon: Code2 },
        { label: "Community", path: "/dashboard/community", icon: Users },
        { label: "Feedback", path: "/dashboard/feedback", icon: MessageSquare },
    ];

    const totalMatches =
        searchResults.subjects.length + searchResults.practicals.length + searchResults.notes.length;

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
            <div className="flex">
                <DashboardSidebar
                    isCollapsed={isSidebarCollapsed}
                    navItems={navItems}
                    isBell={isBell}
                    setisBell={setisBell}
                    onLogout={onLogout}
                    onShare={() => {
                        navigate("/dashboard/notes", { state: { openShare: true } });
                    }}
                />

                <div className="flex-1 min-w-0">
                    <TopNavBar
                        isSidebarCollapsed={isSidebarCollapsed}
                        onToggleSidebar={toggleSidebarCollapse}
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

                    <main className="flex-1 w-full mt-[68px]">
                        {searchQuery ? (
                            <DashboardLayout>
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    {/* Search Header */}
                                    <div className="flex flex-wrap items-center justify-between gap-4 p-5 surface-card rounded-2xl">
                                        <div>
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 bg-primary/10 border border-primary/20 rounded-full">
                                                Search Center
                                            </span>
                                            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground mt-2">
                                                Results for "{searchQuery}"
                                            </h2>
                                            <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                                                Found {totalMatches} {totalMatches === 1 ? "match" : "matches"}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery("")}
                                            className="px-4 min-h-[40px] text-xs font-bold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-all active:scale-[0.98]"
                                        >
                                            Clear Search
                                        </button>
                                    </div>

                                    {/* Segmented Search Tabs */}
                                    <div className="flex items-center border border-border bg-card p-1.5 rounded-2xl gap-1 overflow-x-auto">
                                        {[
                                            { id: "all", label: "All Results", count: totalMatches },
                                            { id: "subjects", label: "Subjects", count: searchResults.subjects.length },
                                            ...(canAccessPracticals(user)
                                                ? [{ id: "practicals", label: "Practicals", count: searchResults.practicals.length }]
                                                : []),
                                            { id: "notes", label: "My Notes", count: searchResults.notes.length },
                                        ].map((tab) => {
                                            const active = activeSearchTab === tab.id;
                                            return (
                                                <button
                                                    key={tab.id}
                                                    type="button"
                                                    onClick={() => setActiveSearchTab(tab.id)}
                                                    className={`px-3.5 min-h-[38px] text-xs font-bold rounded-xl transition-all text-nowrap flex items-center gap-2 ${
                                                        active
                                                            ? "bg-primary text-primary-foreground shadow-xs"
                                                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                                    }`}
                                                >
                                                    <span>{tab.label}</span>
                                                    <span
                                                        className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md tabular-nums ${
                                                            active
                                                                ? "bg-white/20 text-white"
                                                                : "bg-secondary text-muted-foreground"
                                                        }`}
                                                    >
                                                        {tab.count}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Results Lists */}
                                    <div className="space-y-8">
                                        {(activeSearchTab === "all" || activeSearchTab === "subjects") &&
                                            searchResults.subjects.length > 0 && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                        <BookOpen className="w-4 h-4 text-primary" aria-hidden="true" />
                                                        <span>Subjects ({searchResults.subjects.length})</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                        {searchResults.subjects.map((subject, index) => {
                                                            const subjectName = subject.name || subject;
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    onClick={() =>
                                                                        navigate("/dashboard/practicals", {
                                                                            state: { selectedSubject: subjectName },
                                                                        })
                                                                    }
                                                                    className="surface-card rounded-2xl p-5 cursor-pointer hover:-translate-y-0.5 flex flex-col justify-between h-32 group"
                                                                >
                                                                    <div>
                                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider group-hover:text-primary transition-colors">
                                                                            {subject.code || "SUBJECT"}
                                                                        </span>
                                                                        <h4 className="text-sm font-bold text-foreground truncate mt-1">
                                                                            {subjectName}
                                                                        </h4>
                                                                    </div>
                                                                    <span className="text-xs font-bold text-primary group-hover:underline flex items-center gap-1 mt-auto">
                                                                        View Solutions
                                                                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                        {(activeSearchTab === "all" || activeSearchTab === "practicals") &&
                                            searchResults.practicals.length > 0 && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                        <FlaskConical className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                                                        <span>Practicals ({searchResults.practicals.length})</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {searchResults.practicals.map((practical, index) => (
                                                            <PracticalCard key={index} practical={practical} />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                        {(activeSearchTab === "all" || activeSearchTab === "notes") &&
                                            searchResults.notes.length > 0 && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                        <FileText className="w-4 h-4 text-primary" aria-hidden="true" />
                                                        <span>Notes Matches ({searchResults.notes.length})</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {searchResults.notes.map((note) => (
                                                            <div
                                                                key={note._id}
                                                                className="surface-card rounded-2xl p-5 cursor-pointer hover:-translate-y-0.5 flex items-center justify-between"
                                                                onClick={() => setSelectedNote(note)}
                                                            >
                                                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                                                    <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0">
                                                                        <FileText className="w-5 h-5" aria-hidden="true" />
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                                                                            {note.section || "Resource"}
                                                                        </span>
                                                                        <h4 className="font-bold text-sm text-foreground truncate mt-0.5">
                                                                            {note.title}
                                                                        </h4>
                                                                        <p className="text-[11px] text-muted-foreground mt-1">
                                                                            Uploaded: {new Date(note.createdAt).toLocaleDateString()}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0 ml-2" aria-hidden="true" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                        {((activeSearchTab === "all" && totalMatches === 0) ||
                                            (activeSearchTab === "subjects" && searchResults.subjects.length === 0) ||
                                            (activeSearchTab === "practicals" && searchResults.practicals.length === 0) ||
                                            (activeSearchTab === "notes" && searchResults.notes.length === 0)) && (
                                            <div className="py-16 px-6 text-center surface-card rounded-2xl flex flex-col items-center justify-center max-w-md mx-auto">
                                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                                                    <Search className="w-6 h-6 text-primary" aria-hidden="true" />
                                                </div>
                                                <div className="text-base font-bold text-foreground">No results found</div>
                                                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                                                    We couldn't find matches for "{searchQuery}". Try simpler keywords.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <NotePreviewModal note={selectedNote} onClose={() => setSelectedNote(null)} />
                                </div>
                            </DashboardLayout>
                        ) : (
                            <Suspense fallback={<SubpageLoader />}>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="notes" element={<Notes />} />
                                    {canAccessPracticals(user) ? (
                                        <Route path="practicals" element={<Practicals />} />
                                    ) : (
                                        <Route path="practicals" element={<Navigate to="/dashboard" replace />} />
                                    )}
                                    <Route path="feedback" element={<Feedback user={user} />} />
                                    <Route path="community" element={<Community />} />
                                    <Route path="coding-practice" element={<CodingPractice user={user} />} />
                                    <Route path="coding-practice/:language" element={<PracticeDetails />} />
                                    <Route
                                        path="profile"
                                        element={
                                            isAuthenticated ? (
                                                <Profile onLogout={onLogout} />
                                            ) : (
                                                <Navigate to="/dashboard" replace />
                                            )
                                        }
                                    />
                                    <Route path="code-editor/:language/:problemId" element={<CodeEditor />} />
                                    <Route path="*" element={<Navigate to="" replace />} />
                                </Routes>
                            </Suspense>
                        )}
                    </main>
                </div>
            </div>

            <BottomNavbar />
        </div>
    );
}
