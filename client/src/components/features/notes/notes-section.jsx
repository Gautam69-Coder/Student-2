import React, { useState, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    Download,
    Eye,
    Calendar,
    Trash2,
    Copy,
    Check,
    X,
    Code,
    Layers,
    File,
    Image as ImageIcon,
    Sparkles,
    Filter,
    Upload
} from "lucide-react";
import { deleteNote, makeNotePublic } from "@/Api/api";
import { CodeModal } from "@/components/features/coding/code-modal";
import RippleLoader from "@/components/ui/nurui/ripple-loader";
import AddSections from "./add-sections";
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card";
import { theme } from "@/lib/theme";

const NoteCard = memo(
    ({ note, user, copying, onDelete, onCopy, onDownload, onPublic, onSelect, onShowCode }) => {
        const isOwner = user?._id === note.user;
        const hasFile = note.fileType !== "NAN";
        const isImage = note.fileType?.startsWith("image/");
        const isPdf = note.fileType === "application/pdf";

        return (
            <Card
                className="rounded-2xl overflow-hidden h-full"
                style={{
                    background: theme.colors.white,
                    borderColor: theme.colors.lightGray,
                    boxShadow: "0 10px 0 rgba(17,17,19,0.05)",
                }}
            >
                <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <div
                                className="p-2.5 rounded-xl flex-shrink-0 border"
                                style={{
                                    background: hasFile ? theme.colors.limeDim : theme.colors.softGray,
                                    borderColor: theme.colors.lightGray,
                                    color: theme.colors.dark,
                                }}
                            >
                                {hasFile ? (
                                    isImage ? (
                                        <ImageIcon className="w-5 h-5" />
                                    ) : (
                                        <File className="w-5 h-5" />
                                    )
                                ) : (
                                    <Code className="w-5 h-5" />
                                )}
                            </div>
                            <h3 className="font-bold text-base truncate" style={{ color: theme.colors.dark }}>
                                {note.title}
                            </h3>
                        </div>

                        {isOwner && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(note._id);
                                }}
                                className="p-2 rounded-xl transition-colors"
                                style={{
                                    background: "rgba(239,68,68,0.08)",
                                    color: "#DC2626",
                                }}
                                aria-label="Delete note"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex justify-between items-center mb-4 text-[11px] font-semibold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5" style={{ color: theme.colors.darkGray }}>
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(note.createdAt).toLocaleDateString()}
                        </span>

                        {isOwner && (
                            <button
                                className={`rounded-full border px-3 py-1.5 text-[11px] font-bold transition-colors ${
                                    note.isGlobal
                                        ? "bg-indigo-600 text-white border-indigo-600"
                                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                                }`}
                                onClick={() => onPublic(note._id)}
                            >
                                {note.isGlobal ? "Public" : "Private"}
                            </button>
                        )}
                    </div>

                    <div className="flex-1 mb-4">
                        {hasFile ? (
                            isImage ? (
                                <img
                                    src={note.fileData}
                                    alt={note.title}
                                    onClick={() => onSelect(note)}
                                    className="w-full h-40 object-cover rounded-2xl border cursor-pointer hover:opacity-90 transition-opacity"
                                    style={{ borderColor: theme.colors.lightGray }}
                                    loading="lazy"
                                />
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => onSelect(note)}
                                    className="w-full p-4 rounded-2xl border flex items-center gap-3 text-left transition-colors hover:bg-slate-50"
                                    style={{
                                        background: theme.colors.softGray,
                                        borderColor: theme.colors.lightGray,
                                    }}
                                >
                                    <FileText className="w-8 h-8" style={{ color: theme.colors.dark }} />
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold truncate" style={{ color: theme.colors.dark }}>
                                            {note.fileName}
                                        </p>
                                        <p className="text-[11px]" style={{ color: theme.colors.darkGray }}>
                                            {isPdf ? "PDF Document" : "Attachment"}
                                        </p>
                                    </div>
                                </button>
                            )
                        ) : (
                            <div className="relative group/code">
                                <button
                                    onClick={() => onCopy(note._id, note.content)}
                                    className="absolute top-2 right-2 p-1.5 rounded-md border shadow-sm opacity-0 group-hover/code:opacity-100 z-10 transition-opacity"
                                    style={{
                                        background: theme.colors.white,
                                        borderColor: theme.colors.lightGray,
                                        color: theme.colors.darkGray,
                                    }}
                                >
                                    {copying === note._id ? (
                                        <Check className="w-3.5 h-3.5" style={{ color: "#16A34A" }} />
                                    ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                    )}
                                </button>

                                <div
                                    className="p-4 rounded-2xl border max-h-40 overflow-hidden relative"
                                    style={{
                                        background: theme.colors.softGray,
                                        borderColor: theme.colors.lightGray,
                                    }}
                                >
                                    <pre
                                        className="font-mono text-xs whitespace-pre-wrap"
                                        style={{ color: theme.colors.darkGray }}
                                    >
                                        {note.content}
                                    </pre>
                                    <div
                                        className="absolute inset-x-0 bottom-0 h-10"
                                        style={{
                                            background:
                                                "linear-gradient(180deg, rgba(244,244,245,0) 0%, rgba(244,244,245,1) 100%)",
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {hasFile ? (
                            <>
                                {isPdf ? (
                                    <>
                                        <button
                                            className="flex-1 hidden sm:flex justify-center items-center gap-2 py-2.5 border rounded-xl text-sm font-semibold transition-colors hover:bg-slate-50"
                                            style={{
                                                background: theme.colors.white,
                                                borderColor: theme.colors.lightGray,
                                                color: theme.colors.dark,
                                            }}
                                            onClick={() => onSelect(note)}
                                        >
                                            <Eye className="w-4 h-4" />
                                            Open
                                        </button>

                                        <button
                                            className="flex-1 sm:hidden flex justify-center items-center gap-2 py-2.5 border rounded-xl text-sm font-semibold transition-colors hover:bg-slate-50"
                                            style={{
                                                background: theme.colors.white,
                                                borderColor: theme.colors.lightGray,
                                                color: theme.colors.dark,
                                            }}
                                            onClick={() => {
                                                window.open(note.fileData, "_blank");
                                            }}
                                        >
                                            <Eye className="w-4 h-4" />
                                            View File
                                        </button>
                                    </>
                                ) : null}

                                <button
                                    onClick={() => onDownload(note)}
                                    className="flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-transform active:scale-[0.99] shadow-md shadow-indigo-100"
                                >
                                    <Download className="w-4 h-4" />
                                    Download


                                </button>

                            </>
                        ) : (
                            <button
                                onClick={() => onShowCode(note)}
                                className="w-full flex justify-center items-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-transform active:scale-[0.99] shadow-md shadow-indigo-100"
                            >
                                <Code className="w-4 h-4" />
                                View Code
                            </button>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }
);

export function NotesSection({ notes = [], user, loading, onRefresh, requireAuth = (cb) => cb && cb(), onShare }) {
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

    const handleCopy = useCallback(
        (id, content) => {
            requireAuth(() => {
                navigator.clipboard.writeText(content);
                setCopying(id);
                setTimeout(() => setCopying(null), 2000);
            });
        },
        [requireAuth]
    );

    const handleDownload = useCallback(
        (note) => {
            requireAuth(async() => {
                const res = await fetch(note.fileData);
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = note.fileName || "note";
                a.click();
            });
        },
        [requireAuth]
    );

    const handlePublic = useCallback(
        async (id) => {
            if (!window.confirm("Change visibility?")) return;
            try {
                await makeNotePublic(id);
                onRefresh?.();
            } catch (error) {
                console.error(error);
            }
        },
        [onRefresh]
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <RippleLoader />
                <p className="font-medium tracking-tight" style={{ color: theme.colors.darkGray }}>
                    Loading your notes...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            <Card
                className="rounded-2xl"
                style={{
                    background: theme.colors.white,
                    borderColor: theme.colors.lightGray,
                    boxShadow: "0 10px 0 rgba(17,17,19,0.05)",
                }}
            >
                <CardContent className="p-4 sm:p-4">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3">
                                <div
                                    className="h-10 w-10 rounded-xl flex items-center justify-center"
                                    style={{ background: theme.colors.limeDim }}
                                >
                                    <Sparkles className="w-5 h-5" style={{ color: theme.colors.dark }} />
                                </div>
                                <div>
                                    <div className="text-[13px] font-bold uppercase tracking-[0.18em]" style={{ color: theme.colors.darkGray }}>
                                        Notes Library
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-black mt-1" style={{ color: theme.colors.dark }}>
                                        Your saved notes
                                    </h2>
                                </div>
                            </div>
                            <p className="mt-3 max-w-2xl text-sm sm:text-base leading-7" style={{ color: theme.colors.darkGray }}>
                                Browse your code notes, files, and attachments in a clean dashboard layout.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div>
                                {onShare && (
                                    <button
                                        onClick={onShare}
                                        className="w-full justify-center gap-5 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                                    >
                                        <Upload size={16} />
                                        <span>Upload Note</span>
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div
                                    className="rounded-2xl border px-4 py-3"
                                    style={{
                                        background: theme.colors.softGray,
                                        borderColor: theme.colors.lightGray,
                                    }}
                                >
                                    <div className="text-[12px] font-medium" style={{ color: theme.colors.darkGray }}>
                                        Total Notes
                                    </div>
                                    <div className="text-lg font-bold" style={{ color: theme.colors.dark }}>
                                        {notes.length}
                                    </div>
                                </div>

                                <div
                                    className="rounded-2xl border px-4 py-3"
                                    style={{
                                        background: theme.colors.softGray,
                                        borderColor: theme.colors.lightGray,
                                    }}
                                >
                                    <div className="text-[12px] font-medium" style={{ color: theme.colors.darkGray }}>
                                        Files
                                    </div>
                                    <div className="text-lg font-bold" style={{ color: theme.colors.dark }}>
                                        {totalFiles}
                                    </div>
                                </div>

                                <div
                                    className="rounded-2xl border px-4 py-3 col-span-2 sm:col-span-1"
                                    style={{
                                        background: theme.colors.softGray,
                                        borderColor: theme.colors.lightGray,
                                    }}
                                >
                                    <div className="text-[12px] font-medium" style={{ color: theme.colors.darkGray }}>
                                        Code Notes
                                    </div>
                                    <div className="text-lg font-bold" style={{ color: theme.colors.dark }}>
                                        {totalCodeNotes}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center"
                        style={{ background: theme.colors.limeDim }}
                    >
                        <Filter className="w-5 h-5" style={{ color: theme.colors.dark }} />
                    </div>
                    <div>
                        <div className="text-sm font-bold" style={{ color: theme.colors.dark }}>
                            Filter by section
                        </div>
                        <div className="text-xs" style={{ color: theme.colors.darkGray }}>
                            Select a category to narrow your notes
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
                    {sections.map((sec) => (
                        <button
                            key={sec}
                            onClick={() => setActiveSection(sec)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
                                activeSection === sec
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                            }`}
                        >
                            {sec}
                        </button>
                    ))}
                </div>
            </div>

            {!notes.length ? (
                <Card
                    className="rounded-2xl"
                    style={{
                        background: theme.colors.white,
                        borderColor: theme.colors.lightGray,
                        boxShadow: "0 10px 0 rgba(17,17,19,0.05)",
                    }}
                >
                    <CardContent className="flex flex-col items-center justify-center py-20">
                        <FileText className="w-12 h-12" style={{ color: theme.colors.darkGray }} />
                        <h3 className="mt-4 text-lg font-bold" style={{ color: theme.colors.dark }}>
                            No notes yet
                        </h3>
                        <p className="mt-1 text-sm" style={{ color: theme.colors.darkGray }}>
                            Add your first note to get started.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-10">
                    {filteredGroups.map(([section, sectionNotes]) => (
                        <div key={section} className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className="h-10 w-10 rounded-xl flex items-center justify-center"
                                    style={{ background: theme.colors.limeDim }}
                                >
                                    <Layers className="w-5 h-5" style={{ color: theme.colors.dark }} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold" style={{ color: theme.colors.dark }}>
                                        {section}
                                    </h3>
                                    <p className="text-sm" style={{ color: theme.colors.darkGray }}>
                                        {sectionNotes.length} note{sectionNotes.length === 1 ? "" : "s"}
                                    </p>
                                </div>
                                <div className="flex-1 h-px" style={{ background: theme.colors.lightGray }} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {sectionNotes.map((note) => (
                                    <NoteCard
                                        key={note._id}
                                        note={note}
                                        user={user}
                                        copying={copying}
                                        onDelete={handleDelete}
                                        onCopy={handleCopy}
                                        onDownload={handleDownload}
                                        onPublic={handlePublic}
                                        onSelect={(n) => requireAuth(() => setSelectedNote(n))}
                                        onShowCode={(n) =>
                                            requireAuth(() => {
                                                setSelectedNote(n);
                                                setShowCodeModal(true);
                                            })
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

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

            <AnimatePresence>
                {selectedNote && selectedNote.fileType !== "NAN" && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedNote(null)}
                            className="absolute inset-0 backdrop-blur-sm"
                            style={{ background: "rgba(17,17,19,0.25)" }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full  max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border"
                            style={{
                                background: theme.colors.white,
                                borderColor: theme.colors.lightGray,
                            }}
                        >
                            <div
                                className="flex justify-between items-center p-4 sm:p-6 border-b"
                                style={{ borderColor: theme.colors.lightGray }}
                            >
                                <h2 className="text-xl font-bold" style={{ color: theme.colors.dark }}>
                                    {selectedNote.title}
                                </h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDownload(selectedNote)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                    <button
                                        onClick={() => setSelectedNote(null)}
                                        className="p-2 rounded-xl transition-colors"
                                        style={{
                                            background: theme.colors.softGray,
                                            color: theme.colors.darkGray,
                                        }}
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-auto p-6 flex justify-center" style={{ background: theme.colors.softGray }}>
                                {selectedNote.fileType?.startsWith("image/") ? (
                                    <img
                                        src={selectedNote.fileData}
                                        alt=""
                                        className="max-w-full max-h-full object-contain rounded-2xl shadow-xl"
                                    />
                                ) : selectedNote.fileType === "application/pdf" ? (
                                    <iframe
                                        src={selectedNote.fileData}
                                        className="w-full h-full rounded-2xl border"
                                        style={{ borderColor: theme.colors.lightGray }}
                                        title={selectedNote.title}
                                    />
                                ) : null}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
