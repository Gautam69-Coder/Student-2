import React, { useState, useMemo, useCallback } from "react";
import {
    FileText,
    Download,
    Eye,
    Trash2,
    Check,
    Code,
    Layers,
    Sparkles,
    Filter,
    Upload,
} from "lucide-react";
import { deleteNote, makeNotePublic } from "@/Api/api";
import { CodeModal } from "@/components/features/coding/code-modal";
import RippleLoader from "@/components/ui/nurui/ripple-loader";
import AddSections from "./add-sections";
import { theme } from "@/lib/theme";
import { NotePreviewModal } from "./note-preview-modal";
import { NoteCard } from "./note-card";
import { downloadFile } from "@/Utils/download";

export function NoteCardSkeleton() {
    return (
        <div
            className="rounded-2xl overflow-hidden border p-5 flex flex-col h-[280px] justify-between animate-pulse"
            style={{
                background: theme.colors.white,
                borderColor: theme.colors.lightGray,
                boxShadow: "0 10px 0 rgba(17,17,19,0.05)",
            }}
        >
            <div>
                {/* Top row: Icon + Title */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-200/70 shrink-0" />
                    <div className="h-4 bg-slate-200/70 rounded w-2/3" />
                </div>

                {/* Middle row: Date / Badge */}
                <div className="flex gap-2 mb-4">
                    <div className="h-3 bg-slate-200/70 rounded w-1/4" />
                    <div className="h-3 bg-slate-200/70 rounded w-1/6" />
                </div>

                {/* Main content: file or code box */}
                <div className="mb-4">
                    <div className="h-20 bg-slate-200/50 rounded-2xl w-full" />
                </div>
            </div>

            {/* Bottom row: Button placeholders */}
            <div className="flex gap-2 mt-auto">
                <div className="h-9 bg-slate-200/70 rounded-xl flex-1" />
                <div className="h-9 bg-slate-200/70 rounded-xl flex-1" />
            </div>
        </div>
    );
}

export function NotesSection({ notes = [], user, loading, onRefresh, onShare,onUpdate }) {
    const [selectedNote, setSelectedNote] = useState(null);
    const [copying, setCopying] = useState(null);
    const [activeSection, setActiveSection] = useState("All");
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [showAddSection, setShowAddSection] = useState(false);

    const groupedNotes = useMemo(() => {
        return notes.reduce((acc, note) => {
            (acc[note.section || "General"] ||= []).push(note);
            return acc;
        }, {});
    }, [notes]);

    const sections = useMemo(() => ["All", ...Object.keys(groupedNotes)], [groupedNotes]);

    const filteredGroups = useMemo(() => {
        return Object.entries(groupedNotes).filter(
            ([sec]) => activeSection === "All" || activeSection === sec
        );
    }, [groupedNotes, activeSection]);

    const totalFiles = useMemo(
        () => notes.filter((note) => note.fileType !== "NAN").length,
        [notes]
    );

    const totalCodeNotes = useMemo(
        () => notes.filter((note) => note.fileType === "NAN").length,
        [notes]
    );

    const handleDelete = useCallback(
        async (id) => {
            if (!window.confirm("Are you sure?")) return;
            try {
                await deleteNote(id);
                onRefresh?.();
            } catch (error) {
                console.error(error);
            }
        },
        [onRefresh]
    );

    // const handleUpdate = useCallback(
    //     async (id) => {
    //         console.log("NOte id : ", id)
    //     }
    // )



    const handleCopy = useCallback((id, content) => {
        navigator.clipboard.writeText(content);
        setCopying(id);
        setTimeout(() => setCopying(null), 2000);
    }, []);

    const handleDownload = useCallback((note) => {
        downloadFile(note.fileData, note.fileName || note.title);
    }, []);

    const handlePublic = useCallback(
        async (id) => {
            try {
                await makeNotePublic(id);
                onRefresh?.();
            } catch (error) {
                console.error(error);
            }
        },
        [onRefresh]
    );

    const handleSelect = useCallback((note) => {
        setSelectedNote(note);
    }, []);

    const handleShowCode = useCallback((note) => {
        setSelectedNote(note);
        setShowCodeModal(true);
    }, []);

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <div
                className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border"
                style={{
                    background: theme.colors.white,
                    borderColor: theme.colors.lightGray,
                }}
            >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span
                                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider"
                                style={{
                                    background: theme.colors.limeDim,
                                    color: theme.colors.dark,
                                    borderColor: theme.colors.limeDim,
                                }}
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                Study Hub
                            </span>
                            <span
                                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
                                style={{
                                    background: theme.colors.white,
                                    color: theme.colors.darkGray,
                                    borderColor: theme.colors.lightGray,
                                }}
                            >
                                Organized by Sections
                            </span>
                        </div>

                        <h1
                            className="text-2xl sm:text-4xl font-black tracking-tight"
                            style={{ color: theme.colors.dark }}
                        >
                            Your Notes & Code Library
                        </h1>

                        <p
                            className="mt-2 text-sm sm:text-base max-w-2xl"
                            style={{ color: theme.colors.darkGray }}
                        >
                            Access your uploaded documents, files, and code snippets in one centralized dashboard.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => setShowAddSection(true)}
                            className="px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors hover:bg-slate-50 flex items-center justify-center gap-2"
                            style={{
                                background: theme.colors.white,
                                borderColor: theme.colors.lightGray,
                                color: theme.colors.dark,
                            }}
                        >
                            <Layers className="w-4 h-4" />
                            Manage Sections
                        </button>
                        {onShare && (
                            <button
                                onClick={onShare}
                                className="px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
                            >
                                <Upload size={16} />
                                <span>Upload Note</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Quick Stats Banner */}
                <div
                    className="mt-6 pt-6 border-t grid grid-cols-2 sm:grid-cols-4 gap-4"
                    style={{ borderColor: theme.colors.lightGray }}
                >
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Notes</p>
                        {loading ? (
                            <div className="h-6 bg-slate-200/70 rounded w-12 mt-1.5 animate-pulse" />
                        ) : (
                            <p className="text-xl font-black text-slate-900 mt-0.5">{notes.length}</p>
                        )}
                    </div>
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sections</p>
                        {loading ? (
                            <div className="h-6 bg-slate-200/70 rounded w-12 mt-1.5 animate-pulse" />
                        ) : (
                            <p className="text-xl font-black text-slate-900 mt-0.5">{sections.length - 1}</p>
                        )}
                    </div>
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Files / Documents</p>
                        {loading ? (
                            <div className="h-6 bg-slate-200/70 rounded w-12 mt-1.5 animate-pulse" />
                        ) : (
                            <p className="text-xl font-black text-slate-900 mt-0.5">{totalFiles}</p>
                        )}
                    </div>
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Code Snippets</p>
                        {loading ? (
                            <div className="h-6 bg-slate-200/70 rounded w-12 mt-1.5 animate-pulse" />
                        ) : (
                            <p className="text-xl font-black text-slate-900 mt-0.5">{totalCodeNotes}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Section Filter Tabs */}
            {loading ? (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1 mr-1" />
                    <div className="h-9 bg-slate-200/70 rounded-xl w-16 animate-pulse" />
                    <div className="h-9 bg-slate-200/70 rounded-xl w-24 animate-pulse" />
                    <div className="h-9 bg-slate-200/70 rounded-xl w-20 animate-pulse" />
                </div>
            ) : (
                sections.length > 2 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1 mr-1" />
                        {sections.map((sec) => (
                            <button
                                key={sec}
                                onClick={() => setActiveSection(sec)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${activeSection === sec
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                                    }`}
                            >
                                {sec}
                            </button>
                        ))}
                    </div>
                )
            )}

            {/* Main Content Area */}
            {loading ? (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-5 bg-slate-200/70 rounded w-28 animate-pulse" />
                        <div className="h-5 bg-slate-200/70 rounded-full w-8 animate-pulse" />
                        <div className="h-[1px] flex-1 bg-slate-200/60" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <NoteCardSkeleton key={idx} />
                        ))}
                    </div>
                </div>
            ) : filteredGroups.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-lg font-bold text-slate-700">No notes found</p>
                    <p className="text-sm text-slate-400 mt-1">Upload files or code snippets to get started.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {filteredGroups.map(([sectionName, sectionNotes]) => (
                        <div key={sectionName} className="space-y-4">
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                                    {sectionName}
                                </h2>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                                    {sectionNotes.length}
                                </span>
                                <div className="h-[1px] flex-1 bg-slate-200" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {sectionNotes.map((note) => (
                                    <NoteCard
                                        key={note._id}
                                        note={note}
                                        user={user}
                                        copying={copying}
                                        onDelete={handleDelete}
                                        onUpdate={onUpdate}
                                        onCopy={handleCopy}
                                        onDownload={handleDownload}
                                        onPublic={handlePublic}
                                        onSelect={handleSelect}
                                        onShowCode={handleShowCode}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modals */}
            {showCodeModal && selectedNote && (
                <CodeModal
                    isOpen={showCodeModal}
                    onClose={() => {
                        setShowCodeModal(false);
                        setSelectedNote(null);
                    }}
                    title={selectedNote.title}
                    code={selectedNote.content}
                />
            )}

            {showAddSection && (
                <AddSections
                    isOpen={showAddSection}
                    onClose={() => {
                        setShowAddSection(false);
                    }}
                />
            )}

            <NotePreviewModal
                note={selectedNote}
                onClose={() => setSelectedNote(null)}
                onDownload={handleDownload}
            />

        </div>
    );
}
