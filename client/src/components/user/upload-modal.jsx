
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileText, X, Check, Code, AlertCircle, Plus, ChevronDown, Layout, File, Image as ImageIcon } from "lucide-react"
import { createNote, fetchSections } from "@/Api/api"

export function UploadModal({ open, onOpenChange, onNoteCreated }) {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [section, setSection] = useState("General")
    const [newSection, setNewSection] = useState("")
    const [isAddingNew, setIsAddingNew] = useState(false)
    const [sections, setSections] = useState(["General"])
    const [uploading, setUploading] = useState(false)
    const [uploaded, setUploaded] = useState(false)
    const [error, setError] = useState("")
    const [uploadType, setUploadType] = useState("text") // 'text' or 'file'
    const [selectedFile, setSelectedFile] = useState(null)
    const [fileBase64, setFileBase64] = useState("")

    useEffect(() => {
        if (open) {
            loadSections()
        }
    }, [open])

    const loadSections = async () => {
        try {
            const res = await fetchSections()
            const sectionNames = res.data.map(s => s.name)
            if (!sectionNames.includes("General")) {
                sectionNames.unshift("General")
            }
            setSections(sectionNames)
        } catch (err) {
            console.error("Error loading sections:", err)
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (file.size > 50 * 1024 * 1024) {
            setError("File size should be less than 50MB")
            return
        }

        setSelectedFile(file)
        const reader = new FileReader()
        reader.onloadend = () => {
            setFileBase64(reader.result)
        }
        reader.readAsDataURL(file)
    }

    const handleUpload = async () => {
        const finalSection = isAddingNew ? newSection.trim() : section

        if (!title.trim() || !finalSection) {
            setError("Title and section are required")
            return
        }

        if (uploadType === 'text' && !content.trim()) {
            setError("Content is required")
            return
        }

        if (uploadType === 'file' && !selectedFile) {
            setError("Please select a file")
            return
        }

        setError("")
        setUploading(true)
        try {
            const noteData = {
                title,
                section: finalSection,
            }

            if (uploadType === 'text') {
                noteData.content = content
            } else {
                noteData.fileName = selectedFile.name
                noteData.fileType = selectedFile.type
                noteData.fileData = fileBase64
            }

            await createNote(noteData)
            setUploading(false)
            setUploaded(true)

            if (onNoteCreated) {
                onNoteCreated()
            }

            setTimeout(() => {
                onOpenChange(false)
                setUploaded(false)
                setTitle("")
                setContent("")
                setSection("General")
                setNewSection("")
                setIsAddingNew(false)
                setSelectedFile(null)
                setFileBase64("")
            }, 1500)
        } catch (err) {
            setUploading(false)
            setError(err.response?.data?.msg || "Failed to upload note. Please try again.")
            console.error(err)
        }
    }

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => onOpenChange(false)}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-2xl bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 overflow-hidden"
                    >
                        <div className="flex flex-col gap-1 mb-6">
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Share Your Notes</h2>
                            <p className="text-sm text-slate-500">
                                Share code snippets or upload your study documents.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            {/* Upload Type Switcher */}
                            <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
                                <button
                                    onClick={() => setUploadType("text")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${uploadType === "text" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                >
                                    <Code className="w-4 h-4" />
                                    Text / Code
                                </button>
                                <button
                                    onClick={() => setUploadType("file")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${uploadType === "file" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                >
                                    <File className="w-4 h-4" />
                                    Upload File
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g., Java Collections Framework"
                                        className="mt-1.5 w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 rounded-lg text-sm transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <Layout className="w-4 h-4 text-slate-500" />
                                        Section
                                    </label>
                                    <div className="mt-1.5 flex gap-2">
                                        {isAddingNew ? (
                                            <div className="relative flex-1">
                                                <input
                                                    type="text"
                                                    autoFocus
                                                    value={newSection}
                                                    onChange={(e) => setNewSection(e.target.value)}
                                                    placeholder="Enter new section name"
                                                    className="w-full h-10 px-3 pr-10 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 rounded-lg text-sm transition-all"
                                                />
                                                <button
                                                    onClick={() => setIsAddingNew(false)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-md transition-colors"
                                                >
                                                    <X className="w-4 h-4 text-slate-400" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="relative flex-1">
                                                <select
                                                    value={section}
                                                    onChange={(e) => setSection(e.target.value)}
                                                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 rounded-lg text-sm appearance-none transition-all"
                                                >
                                                    {sections.map(s => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setIsAddingNew(!isAddingNew)}
                                            className={`h-10 px-3 rounded-lg border flex items-center justify-center gap-2 text-sm font-medium transition-all ${isAddingNew ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'}`}
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span className="hidden sm:inline">New</span>
                                        </button>
                                    </div>
                                </div>

                                {uploadType === "text" ? (
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                            <Code className="w-4 h-4 text-slate-500" />
                                            Content / Code
                                        </label>
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="Paste your code or text here..."
                                            className="mt-1.5 w-full px-3 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 rounded-lg text-sm min-h-[250px] font-mono transition-all resize-y"
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">File</label>
                                        <div className={`mt-1.5 border-2 border-dashed rounded-xl p-8 text-center transition-all ${selectedFile ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:border-slate-400 hover:bg-slate-50"}`}>
                                            {selectedFile ? (
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                                                        {selectedFile.type.startsWith('image/') ? <ImageIcon className="w-10 h-10 text-slate-900" /> : <FileText className="w-10 h-10 text-slate-900" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-slate-900 truncate max-w-[200px]">{selectedFile.name}</p>
                                                        <p className="text-xs text-slate-500 font-medium">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                                    </div>
                                                    <button
                                                        onClick={() => { setSelectedFile(null); setFileBase64(""); }}
                                                        className="text-xs font-bold text-red-500 hover:text-red-700 underline underline-offset-4"
                                                    >
                                                        Remove File
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="cursor-pointer block">
                                                    <Upload className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                                                    <p className="text-sm text-slate-900 font-bold mb-1">Click to upload file</p>
                                                    <p className="text-xs text-slate-500">PDF, DOCX, PNG, JPG (Max 50MB)</p>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        onChange={handleFileChange}
                                                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleUpload}
                                disabled={uploading || uploaded}
                                className={`w-full h-12 flex items-center justify-center gap-2 font-bold rounded-xl transition-all shadow-sm ${uploading || uploaded
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    : "bg-slate-900 hover:bg-slate-800 text-white active:scale-[0.99] shadow-lg shadow-slate-200"
                                    }`}
                            >
                                {uploaded ? (
                                    <>
                                        <Check className="w-4 h-4" /> Shared Successfully
                                    </>
                                ) : uploading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full"
                                        />
                                        Sharing...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" /> Save Note
                                    </>
                                )}
                            </button>
                        </div>

                        <button
                            onClick={() => onOpenChange(false)}
                            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
