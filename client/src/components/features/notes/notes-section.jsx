import React, { useState, useMemo, useCallback } from "react";
import { FileText, Layers, Sparkles, Filter, Upload } from "lucide-react";
import { deleteNote, makeNotePublic } from "@/Api/api";
import AddSections from "./add-sections";
import { NotePreviewModal } from "./note-preview-modal";
import { NoteCard } from "./note-card";
import { downloadFile } from "@/Utils/download";

export function NoteCardSkeleton() {
    return (
        <div className="rounded-2xl overflow-hidden border border-border bg-card p-5 flex flex-col h-[280px] justify-between animate-pulse">
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-muted shrink-0" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                </div>
                <div className="flex gap-2 mb-4">
                    <div className="h-3 bg-muted rounded w-1/4" />
                    <div className="h-3 bg-muted rounded w-1/6" />
                </div>
                <div className="mb-4">
                    <div className="h-20 bg-muted/70 rounded-2xl w-full" />
                </div>
            </div>
            <div className="flex gap-2 mt-auto">
                <div className="h-10 bg-muted rounded-xl flex-1" />
                <div className="h-10 bg-muted rounded-xl flex-1" />
            </div>
        </div>
    );
}

export function NotesSection({ notes = [], user, loading, onRefresh, onShare, onUpdate }) {
    const [selectedNote, setSelectedNote] = useState(null);
    const [copying, setCopying] = useState(null);
    const [activeSection, setActiveSection] = useState("All");
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

    const totalFiles = useMemo(() => notes.filter((note) => note.fileType !== "NAN").length, [notes]);
    const totalCodeNotes = useMemo(() => notes.filter((note) => note.fileType === "NAN").length, [notes]);

    const handleDelete = useCallback(
        async (id) => {
            if (!window.confirm("Are you sure you want to delete this note?")) return;
            try {
                await deleteNote(id);
                onRefresh?.();
            } catch (error) {
                console.error(error);
            }
        },
        [onRefresh]
    );

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

    const handleSelect = useCallback((note) => setSelectedNote(note), []);
    const handleShowCode = useCallback((note) => setSelectedNote(note), []);

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <div className="surface-card rounded-3xl p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                                Study Hub
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background text-muted-foreground px-3 py-1 text-xs font-semibold">
                                Organized by Sections
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                            Your Notes & Code Library
                        </h1>
                        <p className="mt-2 text-sm sm:text-base max-w-2xl text-muted-foreground">
                            Access uploaded documents, PDFs, and code snippets with instant AI review in one centralized workspace.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
                        <button
                            type="button"
                            onClick={() => setShowAddSection(true)}
                            className="px-4 min-h-[42px] rounded-xl text-xs sm:text-sm font-bold border border-border bg-background text-foreground hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                        >
                            <Layers className="w-4 h-4 text-primary" aria-hidden="true" />
                            Manage Sections
                        </button>
                        {onShare && (
                            <button
                                type="button"
                                onClick={onShare}
                                className="px-4 min-h-[42px] rounded-xl text-xs sm:text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition-all active:scale-[0.98] shadow-sm shadow-indigo-500/20 flex items-center justify-center gap-2"
                            >
                                <Upload size={16} aria-hidden="true" />
                                <span>Upload Note</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Stats Strip */}
                <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: "Total Notes", val: notes.length },
                        { label: "Sections", val: Math.max(0, sections.length - 1) },
                        { label: "Files / Documents", val: totalFiles },
                        { label: "Code Snippets", val: totalCodeNotes },
                    ].map((s) => (
                        <div key={s.label}>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                {s.label}
                            </p>
                            {loading ? (
                                <div className="h-6 bg-muted rounded w-12 mt-1.5 animate-pulse" />
                            ) : (
                                <p className="text-xl font-extrabold text-foreground mt-0.5 tabular-nums">
                                    {s.val}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Section Filter Tabs */}
            {loading ? (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
                    <Filter className="w-4 h-4 text-muted-foreground shrink-0 ml-1 mr-1" aria-hidden="true" />
                    <div className="h-9 bg-muted rounded-xl w-16 animate-pulse" />
                    <div className="h-9 bg-muted rounded-xl w-24 animate-pulse" />
                    <div className="h-9 bg-muted rounded-xl w-20 animate-pulse" />
                </div>
            ) : (
                sections.length > 2 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
                        <Filter className="w-4 h-4 text-muted-foreground shrink-0 ml-1 mr-1" aria-hidden="true" />
                        {sections.map((sec) => (
                            <button
                                key={sec}
                                type="button"
                                onClick={() => setActiveSection(sec)}
                                className={`px-4 min-h-[38px] rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                                    activeSection === sec
                                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                        : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-secondary"
                                }`}
                            >
                                {sec}
                            </button>
                        ))}
                    </div>
                )
            )}

            {/* Main Content */}
            {loading ? (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-5 bg-muted rounded w-28 animate-pulse" />
                        <div className="h-5 bg-muted rounded-full w-8 animate-pulse" />
                        <div className="h-px flex-1 bg-border" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <NoteCardSkeleton key={idx} />
                        ))}
                    </div>
                </div>
            ) : filteredGroups.length === 0 ? (
                <div className="text-center py-20 surface-card rounded-3xl">
                    <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" aria-hidden="true" />
                    <p className="text-lg font-bold text-foreground">No notes found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Upload files or code snippets to build your study library.
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {filteredGroups.map(([sectionName, sectionNotes]) => (
                        <div key={sectionName} className="space-y-4">
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg font-bold text-foreground tracking-tight">
                                    {sectionName}
                                </h2>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary text-muted-foreground border border-border tabular-nums">
                                    {sectionNotes.length}
                                </span>
                                <div className="h-px flex-1 bg-border" />
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

            {showAddSection && (
                <AddSections
                    isOpen={showAddSection}
                    onClose={() => setShowAddSection(false)}
                />
            )}

            <NotePreviewModal
                note={selectedNote}
                onClose={() => setSelectedNote(null)}
                onDownload={handleDownload}
                onRefresh={onRefresh}
            />
        </div>
    );
}
