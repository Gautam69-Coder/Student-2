import React, { useState, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText, Download, Eye, Calendar, Trash2, Copy, Check,
    X, Code, Loader2, Layers, File, Image as ImageIcon
} from "lucide-react";
import { deleteNote, makeNotePublic } from "@/Api/api";
import { CodeModal } from "@/components/common/code-modal";

const NoteCard = memo(({ note, user, copying, onDelete, onCopy, onDownload, onPublic, onSelect, onShowCode }) => {
    const isOwner = user?._id === note.user;
    const hasFile = note.fileData !== "NAN";
    const isImage = note.fileType?.startsWith('image/');
    const isPdf = note.fileType === "application/pdf";

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex flex-col h-full overflow-hidden">
            <div className="p-5 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2.5 rounded-xl flex-shrink-0 ${hasFile ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-slate-900 dark:bg-slate-800 text-white'}`}>
                            {hasFile ? (isImage ? <ImageIcon className="w-5 h-5" /> : <File className="w-5 h-5" />) : <Code className="w-5 h-5" />}
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white truncate text-base">{note.title}</h3>
                    </div>
                    {isOwner && (
                        <button onClick={(e) => { e.stopPropagation(); onDelete(note._id); }} className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 transition-all">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Meta */}
                <div className="flex justify-between items-center mb-4 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(note.createdAt).toLocaleDateString()}</span>
                    {isOwner && (
                        <button className="bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 p-1.5 px-3 rounded-md hover:bg-blue-600 hover:text-white transition-colors border border-blue-600 dark:border-blue-500" onClick={() => onPublic(note._id)}>
                            {note.isGlobal ? "Public" : "Private"}
                        </button>
                    )}
                </div>

                {/* Content Preview */}
                <div className="flex-1 mb-4">
                    {hasFile ? (
                        isImage ? (
                            <img src={note.fileData} alt={note.title} onClick={() => onSelect(note)} className="w-full h-40 object-cover rounded-xl border border-slate-100 dark:border-slate-800 cursor-pointer hover:opacity-90 transition-opacity" loading="lazy" />
                        ) : (
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                <FileText className="w-8 h-8 text-blue-500" />
                                <div className="overflow-hidden">
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{note.fileName}</p>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{isPdf ? "PDF Document" : "Attachment"}</p>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="relative group/code">
                            <button onClick={() => onCopy(note._id, note.content)} className="absolute top-2 right-2 p-1.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-md shadow-sm opacity-0 group-hover/code:opacity-100 z-10 transition-opacity">
                                {copying === note._id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />}
                            </button>
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 max-h-40 overflow-hidden relative">
                                <pre className="font-mono text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{note.content}</pre>
                                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    {hasFile ? (
                        <>
                            {isPdf && <button onClick={() => onSelect(note)} className="flex-1 flex justify-center items-center gap-2 py-2 border dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800"><Eye className="w-4 h-4" /> Open</button>}
                            <button onClick={() => onDownload(note)} className="flex-1 flex justify-center items-center gap-2 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-700 shadow-sm"><Download className="w-4 h-4" /> Download</button>
                        </>
                    ) : (
                        <button onClick={() => onShowCode(note)} className="w-full flex justify-center items-center gap-2 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-700 shadow-sm"><Code className="w-4 h-4" /> View Code</button>
                    )}
                </div>
            </div>
        </div>
    );
});

export function NotesSection({ notes = [], user, loading, onRefresh, requireAuth }) {
    const [selectedNote, setSelectedNote] = useState(null);
    const [copying, setCopying] = useState(null);
    const [activeSection, setActiveSection] = useState("All");
    const [showCodeModal, setShowCodeModal] = useState(false);

    // Grouping notes efficiently
    const groupedNotes = useMemo(() => notes.reduce((acc, note) => {
        (acc[note.section || "General"] ||= []).push(note);
        return acc;
    }, {}), [notes]);

    const sections = useMemo(() => ["All", ...Object.keys(groupedNotes)], [groupedNotes]);
    const filteredGroups = useMemo(() => Object.entries(groupedNotes).filter(([sec]) => activeSection === "All" || activeSection === sec), [groupedNotes, activeSection]);

    const handleDelete = useCallback(async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try { await deleteNote(id); onRefresh?.(); } catch (err) { console.error(err); }
    }, [onRefresh]);

    const handleCopy = useCallback((id, content) => {
        requireAuth(() => {
            navigator.clipboard.writeText(content);
            setCopying(id);
            setTimeout(() => setCopying(null), 2000);
        });
    }, [requireAuth]);

    const handleDownload = useCallback((note) => {
        requireAuth(() => {
            const a = document.createElement("a");
            a.href = note.fileData; a.download = note.fileName || "note";
            a.click();
        });
    }, [requireAuth]);

    const handlePublic = useCallback(async (id) => {
        if (!window.confirm("Change visibility?")) return;
        try { await makeNotePublic(id); onRefresh?.(); } catch (err) { console.error(err); }
    }, [onRefresh]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
            <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">Loading your notes...</p>
        </div>
    );

    return (
        <div className="space-y-8 pb-10">
            {/* Header / Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Mumbai IT Student Notes & Resources</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Access your premium VESIT notes and shared study materials.</p>
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
                    {sections.map((sec) => (
                        <button key={sec} onClick={() => setActiveSection(sec)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeSection === sec ? "bg-slate-900 dark:bg-slate-800 text-white shadow-md" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                            {sec}
                        </button>
                    ))}
                </div>
            </div>

            {/* Empty State vs List */}
            {!notes.length ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                    <FileText className="w-12 h-12 text-slate-200 dark:text-slate-800 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No notes yet</h3>
                </div>
            ) : (
                <div className="space-y-12">
                    {filteredGroups.map(([section, sectionNotes]) => (
                        <div key={section} className="space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-slate-900 dark:bg-slate-800 text-white shadow-sm"><Layers className="w-4 h-4" /></div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{section} <span className="text-sm text-slate-400 dark:text-slate-500 font-medium">({sectionNotes.length})</span></h3>
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
                                        onPublic={handlePublic} 
                                        onSelect={(n) => requireAuth(() => setSelectedNote(n))} 
                                        onShowCode={(n) => requireAuth(() => { setSelectedNote(n); setShowCodeModal(true); })} 
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Code Modal */}
            {showCodeModal && selectedNote && (
                <CodeModal isOpen={showCodeModal} onClose={() => { setShowCodeModal(false); setSelectedNote(null); }} title={selectedNote.title} code={selectedNote.content} />
            )}

            {/* File Modal */}
            <AnimatePresence>
                {selectedNote && selectedNote.fileData !== "NAN" && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedNote(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-5xl h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedNote.title}</h2>
                                <div className="flex gap-2">
                                    <button onClick={() => handleDownload(selectedNote)} className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"><Download className="w-4 h-4" /> Download</button>
                                    <button onClick={() => setSelectedNote(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 p-6 flex justify-center">
                                {selectedNote.fileType?.startsWith('image/') 
                                    ? <img src={selectedNote.fileData} alt="" className="max-w-full max-h-full object-contain rounded-lg shadow-xl" /> 
                                    : selectedNote.fileType === "application/pdf" 
                                        ? <iframe src={selectedNote.fileData} className="w-full h-full rounded-lg border border-slate-200 dark:border-slate-700" title={selectedNote.title} /> 
                                        : null}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
