
import React, { useState, useMemo, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    FileText, Download, Eye, Calendar, Trash2, Copy, Check,
    X, Code, Loader2, Layers, File, Image as ImageIcon
} from "lucide-react"
import { deleteNote, makeNotePublic } from "@/Api/api"
import { CodeModal } from "@/components/common/code-modal"


const NoteCard = memo(function NoteCard({
    note, user, copying, onDelete, onCopy, onDownload, onPublic, onSelect, onShowCode
}) {
    const isOwner = user?._id === note.user;
    const hasFile = note.fileData !== "NAN";
    const isImage = note.fileType?.startsWith('image/');
    const isPdf = note.fileType === "application/pdf";

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col h-full">
            <div className="p-6 flex flex-col h-full">

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2.5 rounded-xl border flex-shrink-0 transition-colors ${hasFile
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400'
                            : 'bg-slate-900 dark:bg-slate-800 border-slate-800 dark:border-slate-700 text-white'}`}>
                            {hasFile
                                ? (isImage ? <ImageIcon className="w-5 h-5" /> : <File className="w-5 h-5" />)
                                : <Code className="w-5 h-5" />}
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white truncate text-base sm:text-lg">
                            {note.title}
                        </h3>
                    </div>
                    {isOwner && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(note._id); }}
                            className="ml-2 flex-shrink-0 p-1.5 rounded-lg opacity-100 sm:opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-600 transition-all"
                            title="Delete Note"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Meta */}
                <div className="flex flex-wrap justify-between items-center gap-3 mb-4 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                    {isOwner && (
                        <button
                            className="bg-blue-50 dark:bg-blue-950/20 border border-blue-600 dark:border-blue-500 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-colors text-blue-600 dark:text-blue-400 p-2 px-4 cursor-pointer rounded-md normal-case"
                            onClick={() => onPublic(note._id)}
                        >
                            {note.isGlobal ? "Public" : "Private"}
                        </button>
                    )}
                </div>

                {/* Content preview */}
                <div className="flex-1 mt-auto">
                    {hasFile ? (
                        isImage ? (
                            <div
                                onClick={() => onSelect(note)}
                                className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 cursor-pointer hover:opacity-90 transition-opacity mb-4"
                            >
                                <img
                                    src={note.fileData}
                                    alt={note.title}
                                    className="w-full h-40 object-cover"
                                    loading="lazy"
                                />
                            </div>
                        ) : (
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center gap-3 mb-4">
                                <FileText className="w-8 h-8 text-blue-500 flex-shrink-0" />
                                <div className="overflow-hidden">
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{note.fileName}</p>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                        {isPdf ? "PDF Document" : "Attachment"}
                                    </p>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="relative group/code mb-4">
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/code:opacity-100 transition-opacity z-10">
                                <button
                                    onClick={() => onCopy(note._id, note.content)}
                                    className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                >
                                    {copying === note._id
                                        ? <Check className="w-3.5 h-3.5 text-green-600" />
                                        : <Copy className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 max-h-40 overflow-hidden relative">
                                <pre className="font-mono text-xs leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                                    {note.content}
                                </pre>
                                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-2">
                    {hasFile ? (
                        <>
                            {isPdf && (
                                <button
                                    onClick={() => onSelect(note)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                                >
                                    <Eye className="w-4 h-4" />
                                    Open PDF
                                </button>
                            )}
                            <button
                                onClick={() => onDownload(note)}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition-all shadow-sm"
                            >
                                <Download className="w-4 h-4" />
                                Download
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => onShowCode(note)}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition-all shadow-sm"
                        >
                            <Code className="w-4 h-4" />
                            View Code
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
})

// ─── Main NotesSection ────────────────────────────────────────────────────────
// Receives data from parent (Dashboard) — no internal API fetching
export function NotesSection({ notes = [], user, loading, onRefresh }) {
    const [selectedNote, setSelectedNote] = useState(null)
    const [copying, setCopying] = useState(null)   // stores noteId
    const [activeSection, setActiveSection] = useState("All")
    const [showCodeModal, setShowCodeModal] = useState(false)

    // Derived state — recomputed only when notes change
    const groupedNotes = useMemo(() =>
        notes.reduce((acc, note) => {
            const section = note.section || "General"
            if (!acc[section]) acc[section] = []
            acc[section].push(note)
            return acc
        }, {}),
        [notes])

    const sections = useMemo(() => ["All", ...Object.keys(groupedNotes)], [groupedNotes])

    const filteredGroups = useMemo(() =>
        Object.entries(groupedNotes).filter(([section]) =>
            activeSection === "All" || activeSection === section
        ),
        [groupedNotes, activeSection])

    // Stable callbacks — won't cause child re-renders on parent re-render
    const handleDelete = useCallback(async (id) => {
        if (!window.confirm("Are you sure you want to delete this note?")) return
        try {
            await deleteNote(id)
            onRefresh?.()
        } catch (err) {
            console.error("Error deleting note:", err)
        }
    }, [onRefresh])

    const handleCopy = useCallback((noteId, content) => {
        navigator.clipboard.writeText(content)
        setCopying(noteId)
        setTimeout(() => setCopying(null), 2000)
    }, [])

    const handleDownload = useCallback((note) => {
        const link = document.createElement("a")
        link.href = note.fileData
        link.download = note.fileName || "note"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }, [])

    const handlePublicNote = useCallback(async (noteId) => {
        if (!window.confirm("Are you sure you want to do this action?")) return
        try {
            await makeNotePublic(noteId)
            onRefresh?.()
        } catch (err) {
            console.error("Error making note public:", err)
        }
    }, [onRefresh])

    const handleShowCode = useCallback((note) => {
        setSelectedNote(note)
        setShowCodeModal(true)
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
                <p className="text-slate-500 font-medium tracking-tight">Loading your notes...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header + Section Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">My Notes</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Access all your shared notes and code snippets.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                    {sections.map((sec) => (
                        <button
                            key={sec}
                            onClick={() => setActiveSection(sec)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeSection === sec
                                    ? "bg-white dark:bg-slate-800 text-black dark:text-white shadow-md border border-slate-200 dark:border-slate-700"
                                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                                }`}
                        >
                            {sec}
                        </button>
                    ))}
                </div>
            </div>

            {/* Empty state */}
            {notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                    <FileText className="w-12 h-12 text-slate-200 dark:text-slate-800 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No notes yet</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Click "Share Notes" above to create your first note.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {filteredGroups.map(([section, sectionNotes]) => (
                        <div key={section} className="space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-slate-900 dark:bg-slate-800 text-white shadow-sm">
                                    <Layers className="w-4 h-4" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                                    {section}
                                    <span className="ml-2 text-sm font-medium text-slate-400 dark:text-slate-500">
                                        ({sectionNotes.length})
                                    </span>
                                </h3>
                                <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800 ml-2" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {sectionNotes.map((note) => (
                                    <NoteCard
                                        key={note._id}
                                        note={note}
                                        user={user}
                                        copying={copying}
                                        onDelete={handleDelete}
                                        onCopy={handleCopy}
                                        onDownload={handleDownload}
                                        onPublic={handlePublicNote}
                                        onSelect={setSelectedNote}
                                        onShowCode={handleShowCode}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Code Modal */}
            {showCodeModal && selectedNote?.fileData === "NAN" && (
                <CodeModal
                    isOpen={showCodeModal}
                    onClose={() => { setShowCodeModal(false); setSelectedNote(null); }}
                    title={selectedNote.title}
                    code={selectedNote.content}
                />
            )}

            {/* File/Image Preview Modal */}
            <AnimatePresence>
                {selectedNote && selectedNote.fileData !== "NAN" && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedNote(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-7xl h-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col"
                        >
                            <div className="sm:flex space-y-2 sm:space-y-0 sm:items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedNote.title}</h2>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {selectedNote.section} • Created on {new Date(selectedNote.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleDownload(selectedNote)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium transition-all"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                    <button
                                        onClick={() => setSelectedNote(null)}
                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 p-6 flex items-center justify-center">
                                {selectedNote.fileType?.startsWith('image/') ? (
                                    <img
                                        src={selectedNote.fileData}
                                        alt={selectedNote.title}
                                        className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
                                    />
                                ) : selectedNote.fileType === "application/pdf" ? (
                                    <iframe
                                        src={selectedNote.fileData}
                                        title={selectedNote.title}
                                        className="w-full h-full rounded-lg border border-slate-200 dark:border-slate-700"
                                    />
                                ) : (
                                    <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                                        <FileText className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                                        <p className="text-slate-600 dark:text-slate-300 font-bold mb-2">Full File Preview Unavailable</p>
                                        <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">
                                            This {selectedNote.fileType?.split('/')[1] || 'file'} type cannot be displayed in-browser.
                                        </p>
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
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
