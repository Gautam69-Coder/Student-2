
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Download, Eye, Calendar, User, Trash2, Copy, Check, X, Code, Loader2, Layers, File, Image as ImageIcon } from "lucide-react"
import { fetchNotes, deleteNote } from "@/Api/api"

export function NotesSection({ refreshKey }) {
    const [notes, setNotes] = useState([])
    const [groupedNotes, setGroupedNotes] = useState({})
    const [loading, setLoading] = useState(true)
    const [selectedNote, setSelectedNote] = useState(null)
    const [copying, setCopying] = useState(false)
    const [activeSection, setActiveSection] = useState("All")

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
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">My Notes</h2>
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
                                            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`p-3 rounded-xl border transition-colors ${note.fileData ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-600 group-hover:bg-slate-900 group-hover:text-white'}`}>
                                                    {note.fileData ? (
                                                        note.fileType?.startsWith('image/') ? <ImageIcon className="w-5 h-5" /> : <File className="w-5 h-5" />
                                                    ) : (
                                                        <Code className="w-5 h-5" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-slate-900 truncate text-lg group-hover:text-slate-900">
                                                        {note.title}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs font-medium text-slate-400">
                                                        <span className="flex items-center gap-1.5">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            {new Date(note.createdAt).toLocaleDateString()}
                                                        </span>
                                                        {note.fileName && (
                                                            <span className="text-blue-500 truncate max-w-[100px]">
                                                                {note.fileName}
                                                            </span>
                                                        )}
                                                        {note.isGlobal && (
                                                            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[10px]">
                                                                Global
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {note.fileData ? (
                                                        <button
                                                            onClick={() => handleDownload(note)}
                                                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"
                                                            title="Download File"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => setSelectedNote(note)}
                                                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                                                            title="View Content"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(note._id)}
                                                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                                                        title="Delete Note"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Preview functionality for images */}
                                            {note.fileData && note.fileType?.startsWith('image/') && (
                                                <div
                                                    onClick={() => setSelectedNote(note)}
                                                    className="mt-4 rounded-xl overflow-hidden border border-slate-100 cursor-pointer hover:opacity-90 transition-opacity"
                                                >
                                                    <img src={note.fileData} alt={note.title} className="w-full h-32 object-cover" />
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>
            )}

            <AnimatePresence>
                {selectedNote && (
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
                                    {selectedNote.fileData ? (
                                        <button
                                            onClick={() => handleDownload(selectedNote)}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-all"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download {selectedNote.fileName}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleCopy(selectedNote.content)}
                                            className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-medium transition-all"
                                        >
                                            {copying ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                            {copying ? "Copied!" : "Copy Code"}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setSelectedNote(null)}
                                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-auto bg-slate-50 p-6 flex items-center justify-center">
                                {selectedNote.fileData ? (
                                    selectedNote.fileType?.startsWith('image/') ? (
                                        <img src={selectedNote.fileData} alt={selectedNote.title} className="max-w-full max-h-full object-contain rounded-lg" />
                                    ) : (
                                        <div className="text-center p-12">
                                            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                            <p className="text-slate-600 font-medium">This file type cannot be previewed. Please download it to view.</p>
                                        </div>
                                    )
                                ) : (
                                    <pre className="w-full font-mono text-sm leading-relaxed text-slate-800 whitespace-pre-wrap wrap-break-word">
                                        {selectedNote.content}
                                    </pre>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
