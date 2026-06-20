
import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileText, X, Check, Code, Plus, ChevronDown, Layout, File, Image as ImageIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { createNoteFile } from "@/Api/api"
import { createNoteText } from "@/Api/api"
import { customMessage } from "@/Utils/customMessage"
import { fetchNotes } from "@/Api/api"
import { DotLoader } from "@/Utils/loaders.jsx"

export function UploadModal({ open, onOpenChange, onNoteCreated }) {

    const [fileType, setfileType] = useState("text");
    const [newSection, setNewSection] = useState(true);
    const [noteData, setNoteData] = useState({
        title: "",
        section: "General",
        code: ""
    })
    const [fileUpload, setFileUpload] = useState(null);
    const [allSections, setallSections] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChanged = (e) => {
        setNoteData({ ...noteData, [e.target.name]: e.target.value })
    }

    const loadSections = async () => {
        try {
            const res = await fetchNotes();
            const sections = res.data.map(item => item.section);
            setallSections([...new Set(sections)]);
        } catch (err) {
            console.error("Failed to load sections", err);
        }
    }

    // Only fetch sections when the modal actually opens
    useEffect(() => {
        if (open) loadSections();
    }, [open]);

    const handleFileUpload = (e) => {
        setFileUpload(e.target.files[0])
    }

    const handleSubmit = async () => {
        // Basic validation for text notes and file uploads
        // For text notes, ensure title, section, and code are provided
        if (fileType === "text") {
            if (!noteData.title || !noteData.section || !noteData.code) return customMessage({ content: "All fields are required", type: "error" });
            try {
                setLoading(true);
                const code = await createNoteText(noteData);
                if (code.data.success) {
                    customMessage({ content: code.data.msg, type: "success" });
                    setNoteData({ title: "", section: "General", code: "" });
                    onOpenChange(false);
                    onNoteCreated?.(); // Trigger notes refresh in parent
                    setLoading(false);
                }
            } catch (err) {
                console.error("Note not uploaded", err);
                setLoading(false);
            }
        }
        // For file uploads, you would handle the file input and send it to the server using createNoteFile
        else {
            if (!noteData.title || !noteData.section || !fileUpload) return customMessage({ content: "All fields are required", type: "error" });
            try {
                setLoading(true);
                const formData = new FormData();
                formData.append("file", fileUpload);
                formData.append("title", noteData.title);
                formData.append("section", noteData.section);
                const file = await createNoteFile(formData);
                if (file.data.success) {
                    customMessage({ content: file.data.msg, type: "success" });
                    setNoteData({ title: "", section: "General" });
                    setFileUpload(null);
                    onOpenChange(false);
                    onNoteCreated?.(); // Trigger notes refresh in parent
                    setLoading(false);
                }
            } catch (err) {
                console.error("File not uploaded", err);
                setLoading(false);
            }
        }
    }

    // Handle section creation or selection 
    const handleSection = () => {
        if (newSection) {
            setNewSection(false);
            setNoteData({ ...noteData, section: '' });
        } else {
            setNoteData({ ...noteData, section: noteData.section });
            setNewSection(true);
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
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] dark:bg-slate-900/60"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
                    >
                        <div className="flex flex-col gap-1 mb-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Share Your Notes</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Share code snippets or upload your study documents.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* Upload Type Switcher */}
                            <div className="flex p-1 bg-slate-100 dark:bg-slate-950 rounded-xl mb-4">
                                <button
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${fileType === "text" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all"} shadow-sm`}
                                    onClick={() => { setfileType("text") }}
                                >
                                    <Code className="w-4 h-4" />
                                    Text / Code
                                </button>
                                <button
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${fileType === "file" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all"}`}
                                    onClick={() => { setfileType("file"); }}
                                >
                                    <File className="w-4 h-4" />
                                    Upload File
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Java Collections Framework"
                                        name="title"
                                        value={noteData.title}
                                        className="mt-1.5 w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 rounded-lg text-sm transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                        onChange={(e) => { handleChanged(e) }}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <Layout className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                        Section
                                    </label>
                                    <div className="mt-1.5 flex gap-2">
                                        {newSection ? (
                                            <div className="relative flex-1">
                                                <select
                                                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 rounded-lg text-sm appearance-none transition-all text-slate-900 dark:text-white"
                                                    name="section"
                                                    onChange={(e) => { handleChanged(e); }}
                                                    value={noteData.section}
                                                >
                                                    {allSections.map((item, index) => {
                                                        return <option key={index} value={item}>{item}</option>
                                                    })}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                                            </div>
                                        ) : (
                                            <div className="relative flex-1">
                                                <div>
                                                    <input
                                                        className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 rounded-lg text-sm appearance-none transition-all text-slate-900 dark:text-white"
                                                        name="section"
                                                        onChange={(e) => { handleChanged(e); }}
                                                        value={noteData.section}
                                                        placeholder="Enter the section"

                                                    />
                                                </div>

                                                <X className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500  cursor-pointer"
                                                    onClick={() => { setNewSection(true) }}
                                                />
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            className="h-10 px-3 rounded-lg border flex items-center justify-center gap-2 text-sm font-medium transition-all bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-600"
                                            onClick={() => {
                                                handleSection();
                                            }}
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span className="hidden sm:inline" >New</span>
                                        </button>

                                    </div>
                                </div>


                                {fileType === "text" && (
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                            <Code className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                            Content / Code
                                        </label>
                                        <textarea
                                            placeholder="Paste your code or text here..."
                                            className="mt-1.5 w-full px-3 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 rounded-lg text-sm min-h-62.5 font-mono transition-all resize-y text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                            name="code"
                                            value={noteData.code}
                                            onChange={(e) => { handleChanged(e) }}
                                        />
                                    </div>
                                )}
                                {fileType === "file" && (
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                            Upload Document
                                        </label>
                                        <div className="mt-1.5 flex items-center gap-4">
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-all text-sm text-slate-500 min-h-[250px] dark:text-slate-400">
                                                <FileText className="w-6 h-6 mb-2" />
                                                {!fileUpload ? <span>Click to select a file (Only PDF,DOCX, TXT, IMG) are supported</span> : <span>{fileUpload.name}</span>}
                                                <input type="file" className="hidden"
                                                    onChange={(e) => {
                                                        handleFileUpload(e);
                                                    }} />
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                className="w-full h-12 flex items-center justify-center gap-2 font-bold rounded-xl transition-all shadow-sm bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 active:scale-[0.99] shadow-lg shadow-slate-200 dark:shadow-none"
                                onClick={() => {
                                    handleSubmit();
                                }}
                            >
                                {
                                    loading ? (
                                        <DotLoader size="10px" color={"white"} />
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" />
                                            {fileType === "text" ? "Save Note" : "Upload Note"}
                                        </>
                                    )
                                }
                            </button>
                        </div>

                        <button
                            onClick={() => onOpenChange(false)}
                            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                </div >
            )
            }
        </AnimatePresence >
    )
}
