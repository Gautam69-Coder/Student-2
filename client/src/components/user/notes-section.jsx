
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Download, Eye, Calendar, User, Trash2, Copy, Check, X, Code, Loader2, Layers, File, Image as ImageIcon } from "lucide-react"
import { fetchNotes, deleteNote } from "@/Api/api"
import { CodeModal } from "@/components/common/code-modal"

export function NotesSection({ refreshKey }) {
    const [notes, setNotes] = useState([])
    const [groupedNotes, setGroupedNotes] = useState({})
    const [loading, setLoading] = useState(true)
    const [selectedNote, setSelectedNote] = useState(null)
    const [copying, setCopying] = useState(false)
    const [activeSection, setActiveSection] = useState("All")
    const [showCodeModal, setShowCodeModal] = useState(false)

    useEffect(() => {
        loadNotes()
    }, [refreshKey])

    const loadNotes = async () => {
        setLoading(true)
        try {
            const res = await fetchNotes()
            const fetchedNotes = res.data
            setNotes(fetchedNotes)

            // Group notes by section
            const grouped = fetchedNotes.reduce((acc, note) => {
                const section = note.section || "General"
                if (!acc[section]) {
                    acc[section] = []
                }
                acc[section].push(note)
                return acc
            }, {})
            setGroupedNotes(grouped)
        } catch (err) {
            console.error("Error loading notes:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this note?")) return
        try {
            await deleteNote(id)
            const updatedNotes = notes.filter(note => note._id !== id)
            setNotes(updatedNotes)

            // Re-group
            const grouped = updatedNotes.reduce((acc, note) => {
                const section = note.section || "General"
                if (!acc[section]) {
                    acc[section] = []
                }
                acc[section].push(note)
                return acc
            }, {})
            setGroupedNotes(grouped)
        } catch (err) {
            console.error("Error deleting note:", err)
        }
    }

    const handleCopy = (content) => {
        navigator.clipboard.writeText(content)
        setCopying(true)
        setTimeout(() => setCopying(false), 2000)
    }

    const handleDownload = (note) => {
        const link = document.createElement("a");
        link.href = note.fileData;
        link.download = note.fileName || "note";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const sections = ["All", ...Object.keys(groupedNotes)]

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
                <p className="text-slate-500 font-medium tracking-tight">Loading your notes...</p>
            </div>
        )
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">My Notes</h2>
                    <p className="text-sm text-slate-500 mt-1">Access all your shared notes and code snippets.</p>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                    {sections.map((sec) => (
                        <button
                            key={sec}
                            onClick={() => setActiveSection(sec)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeSection === sec
                                ? "bg-slate-900 text-white shadow-sm"
                                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400 hover:text-slate-900"
                                }`}
                        >
                            {sec}
                        </button>
                    ))}
                </div>
            </div>

            {notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                    <FileText className="w-12 h-12 text-slate-200 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900">No notes yet</h3>
                    <p className="text-sm text-slate-500 mt-1">Click "Share Notes" above to create your first note.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {Object.entries(groupedNotes)
                        .filter(([section]) => activeSection === "All" || activeSection === section)
                        .map(([section, sectionNotes], sIdx) => (
                            <div key={section} className="space-y-5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-slate-900 text-white shadow-sm">
                                        <Layers className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                                        {section}
                                        <span className="ml-2 text-sm font-medium text-slate-400">
                                            ({sectionNotes.length})
                                        </span>
                                    </h3>
                                    <div className="flex-1 h-px bg-slate-100 ml-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {sectionNotes.map((note, index) => (
                                        <motion.div
                                            key={note._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col h-full"
                                        >
                                            <div className="p-6 flex flex-col h-full">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2.5 rounded-xl border transition-colors ${note.fileData ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-900 border-slate-800 text-white'}`}>
                                                            {note.fileData ? (
                                                                note.fileType?.startsWith('image/') ? <ImageIcon className="w-5 h-5" /> : <File className="w-5 h-5" />
                                                            ) : (
                                                                <Code className="w-5 h-5" />
                                                            )}
                                                        </div>
                                                        <h3 className="font-bold text-slate-900 truncate text-base sm:text-lg pr-2">
                                                            {note.title}
                                                        </h3>
                                                    </div>

                                                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(note._id); }}
                                                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                                                            title="Delete Note"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-3 mb-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {new Date(note.createdAt).toLocaleDateString()}
                                                    </span>
                                                    {note.isGlobal && (
                                                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                                                            Public
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Card Content Area */}
                                                <div className="flex-1 mt-auto">
                                                    {note.fileData ? (
                                                        note.fileType?.startsWith('image/') ? (
                                                            <div
                                                                onClick={() => setSelectedNote(note)}
                                                                className="rounded-xl overflow-hidden border border-slate-100 cursor-pointer hover:opacity-90 transition-opacity mb-4"
                                                            >
                                                                <img src={note.fileData} alt={note.title} className="w-full h-40 object-cover" />
                                                            </div>
                                                        ) : (
                                                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3 mb-4">
                                                                <FileText className="w-8 h-8 text-blue-500" />
                                                                <div className="overflow-hidden">
                                                                    <p className="text-sm font-bold text-slate-700 truncate">{note.fileName}</p>
                                                                    <p className="text-xs text-slate-400 capitalize">{note.fileType?.split('/')[1] || 'file'}</p>
                                                                </div>
                                                            </div>
                                                        )
                                                    ) : (
                                                        <div className="relative group/code mb-4">
                                                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/code:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => handleCopy(note.content)}
                                                                    className="p-1.5 bg-white border border-slate-200 rounded-md shadow-sm text-slate-500 hover:text-slate-900"
                                                                >
                                                                    {copying ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                                                                </button>
                                                            </div>
                                                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-h-40 overflow-hidden relative">
                                                                <pre className="font-mono text-xs leading-relaxed text-slate-600 whitespace-pre-wrap">
                                                                    {note.content}
                                                                </pre>
                                                                <div className="absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-slate-50 to-transparent" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Actions Footer */}
                                                <div className="flex items-center gap-2 mt-2">
                                                    {note.fileData ? (
                                                        <button
                                                            onClick={() => handleDownload(note)}
                                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 border border-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-sm"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                            Download
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => { setSelectedNote(note); setShowCodeModal(true); }}
                                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 border border-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-sm"
                                                        >
                                                            <Code className="w-4 h-4" />
                                                            View Code
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>
            )}

            {showCodeModal && selectedNote && !selectedNote.fileData && (
                <CodeModal
                    isOpen={showCodeModal}
                    onClose={() => { setShowCodeModal(false); setSelectedNote(null); }}
                    title={selectedNote.title}
                    code={selectedNote.content}
                />
            )}

            <AnimatePresence>
                {selectedNote && selectedNote.fileData && (
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
                            className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">{selectedNote.title}</h2>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {selectedNote.section} • Created on {new Date(selectedNote.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleDownload(selectedNote)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-all"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download {selectedNote.fileName}
                                    </button>
                                    <button
                                        onClick={() => setSelectedNote(null)}
                                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-auto bg-slate-50 p-6 flex items-center justify-center">
                                {selectedNote.fileType?.startsWith('image/') ? (
                                    <img src={selectedNote.fileData} alt={selectedNote.title} className="max-w-full max-h-full object-contain rounded-lg shadow-xl" />
                                ) : (
                                    <div className="text-center p-12 bg-white rounded-2xl border border-slate-200">
                                        <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-600 font-bold mb-2">Full File Preview Unavailable</p>
                                        <p className="text-slate-400 text-sm mb-6">This {selectedNote.fileType?.split('/')[1] || 'file'} type cannot be displayed in-browser.</p>
                                        <button
                                            onClick={() => handleDownload(selectedNote)}
                                            className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
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
        </motion.div>
    )
}
