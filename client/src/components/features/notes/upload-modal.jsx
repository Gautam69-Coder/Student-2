import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileText, X, Check, Code, Plus, ChevronDown, Layout, File, Image as ImageIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { createNoteFile } from "@/Api/api"
import { createNoteText } from "@/Api/api"
import { customMessage } from "@/Utils/customMessage"
import { DotLoader } from "@/Utils/loaders.jsx"
import { theme } from "@/lib/theme"
import { useData } from "@/context/DataContext"

export function UploadModal({ open, onOpenChange, onNoteCreated }) {

    const { notes } = useData();

    const [fileType, setFileType] = useState("text");
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

            const sections = notes.map(item => item.section);
            setallSections([...new Set(sections)]);
        } catch (err) {
            console.error("Failed to load sections", err);
            customMessage({ content: "Failed to load sections", type: "error" });
        }
    }

    // Only fetch sections when the modal actually opens
    useEffect(() => {
        if (open) loadSections();
    }, [open])

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
                console.log("Note upload response:", code.data.success, code.data.message);
                if (code.data.success) {
                    customMessage({ content: code.data.message || "Note uploaded successfully", type: "success" });
                    setNoteData({ title: "", section: "General", code: "" });
                    onOpenChange(false);
                    onNoteCreated?.(); 
                    setLoading(false);
                }
            } catch (err) {
                console.error("Note not uploaded", err);
                customMessage({ content: "Note not uploaded", type: "error" });
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
                customMessage({ content: "File not uploaded", type: "error" });
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

    if (!open) return null;

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
                        className="relative w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden"
                        style={{
                            background: theme.colors.white,
                            borderColor: theme.colors.lightGray,
                        }}
                    >
                        <div className="p-6 sm:p-7">
                            {/* Header */}
                            <div className="flex flex-col gap-1 mb-6">
                                <h2 className="text-xl font-bold tracking-tight" style={{ color: theme.colors.dark }}>
                                    Share Your Notes
                                </h2>
                                <p className="text-sm" style={{ color: theme.colors.darkGray }}>
                                    Upload files or save code snippets with clean section organization.
                                </p>
                            </div>

                            {/* Upload Type Switcher (Home-style segmented UI) */}
                            <div className="flex p-1 rounded-xl mb-5" style={{ background: theme.colors.softGray, border: `1px solid ${theme.colors.lightGray}` }}>
                                <button
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all shadow-sm`}
                                    style={{
                                        background: fileType === "text" ? theme.colors.white : "transparent",
                                        color: fileType === "text" ? theme.colors.dark : theme.colors.darkGray,
                                        border: `1px solid ${fileType === "text" ? theme.colors.lightGray : "transparent"}`,
                                    }}
                                    onClick={() => { setFileType("text") }}
                                >
                                    <Code className="w-4 h-4" style={{ color: fileType === "text" ? theme.colors.lime : theme.colors.darkGray }} />
                                    Text / Code
                                </button>
                                <button
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all shadow-sm`}
                                    style={{
                                        background: fileType === "file" ? theme.colors.white : "transparent",
                                        color: fileType === "file" ? theme.colors.dark : theme.colors.darkGray,
                                        border: `1px solid ${fileType === "file" ? theme.colors.lightGray : "transparent"}`,
                                    }}
                                    onClick={() => { setFileType("file"); }}
                                >
                                    <FileText className="w-4 h-4" style={{ color: fileType === "file" ? theme.colors.lime : theme.colors.darkGray }} />
                                    Upload File
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="text-sm font-medium" style={{ color: theme.colors.darkGray }}>
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Java Collections Framework"
                                        name="title"
                                        value={noteData.title}
                                        className="mt-1.5 w-full h-10 px-3 rounded-lg text-sm transition-all outline-none"
                                        style={{
                                            background: theme.colors.softGray,
                                            border: `1px solid ${theme.colors.lightGray}`,
                                            color: theme.colors.dark,
                                        }}
                                        onChange={(e) => { handleChanged(e) }}
                                    />
                                </div>

                                {/* Section */}
                                <div>
                                    <label className="text-sm font-medium flex items-center gap-2" style={{ color: theme.colors.darkGray }}>
                                        <Layout className="w-4 h-4" style={{ color: theme.colors.darkGray }} />
                                        Section
                                    </label>
                                    <div className="mt-1.5 flex gap-2">
                                        {newSection ? (
                                            <div className="relative flex-1">
                                                <select
                                                    className="w-full h-10 px-3 rounded-lg text-sm appearance-none transition-all outline-none"
                                                    name="section"
                                                    onChange={(e) => { handleChanged(e); }}
                                                    value={noteData.section}
                                                    style={{
                                                        background: theme.colors.softGray,
                                                        border: `1px solid ${theme.colors.lightGray}`,
                                                        color: theme.colors.dark,
                                                    }}
                                                >
                                                    {allSections.map((item, index) => {
                                                        return <option key={index} value={item}>{item}</option>
                                                    })}
                                                </select>
                                                <ChevronDown
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                                                    style={{ color: theme.colors.darkGray }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="relative flex-1">
                                                <input
                                                    className="w-full h-10 px-3 rounded-lg text-sm appearance-none transition-all outline-none"
                                                    name="section"
                                                    onChange={(e) => { handleChanged(e); }}
                                                    value={noteData.section}
                                                    placeholder="Enter the section"
                                                    style={{
                                                        background: theme.colors.softGray,
                                                        border: `1px solid ${theme.colors.lightGray}`,
                                                        color: theme.colors.dark,
                                                    }}
                                                />

                                                <X
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer"
                                                    style={{ color: theme.colors.darkGray }}
                                                    onClick={() => { setNewSection(true) }}
                                                />
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            className="h-10 px-3 rounded-lg border flex items-center justify-center gap-2 text-sm font-medium transition-all"
                                            style={{
                                                background: theme.colors.white,
                                                borderColor: theme.colors.lightGray,
                                                color: theme.colors.darkGray,
                                            }}
                                            onClick={() => {
                                                handleSection();
                                            }}
                                        >
                                            <Plus className="w-4 h-4" style={{ color: theme.colors.lime }} />
                                            <span className="hidden sm:inline" >New</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                {fileType === "text" && (
                                    <div>
                                        <label className="text-sm font-medium flex items-center gap-2" style={{ color: theme.colors.darkGray }}>
                                            <Code className="w-4 h-4" style={{ color: theme.colors.darkGray }} />
                                            Content / Code
                                        </label>
                                        <textarea
                                            placeholder="Paste your code or text here..."
                                            className="mt-1.5 w-full px-3 py-3 rounded-lg text-sm min-h-62.5 font-mono transition-all resize-y outline-none"
                                            style={{
                                                background: theme.colors.softGray,
                                                border: `1px solid ${theme.colors.lightGray}`,
                                                color: theme.colors.dark,
                                            }}
                                            name="code"
                                            value={noteData.code}
                                            onChange={(e) => { handleChanged(e) }}
                                        />
                                    </div>
                                )}

                                {fileType === "file" && (
                                    <div>
                                        <label className="text-sm font-medium flex items-center gap-2" style={{ color: theme.colors.darkGray }}>
                                            <ImageIcon className="w-4 h-4" style={{ color: theme.colors.darkGray }} />
                                            Upload Document
                                        </label>
                                        <div className="mt-2">
                                            <label
                                                className="w-full h-32 border-2 border-dashed rounded-lg cursor-pointer flex flex-col items-center justify-center gap-2 text-sm transition-all"
                                                style={{
                                                    background: theme.colors.softGray,
                                                    borderColor: theme.colors.lightGray,
                                                    color: theme.colors.darkGray,
                                                }}
                                            >
                                                <FileText className="w-6 h-6" style={{ color: theme.colors.lime }} />
                                                {!fileUpload ? (
                                                    <span>Click to select a file (Only PDF,DOCX, TXT, IMG)</span>
                                                ) : (
                                                    <span className="font-semibold" style={{ color: theme.colors.dark }}>
                                                        {fileUpload.name}
                                                    </span>
                                                )}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        handleFileUpload(e);
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {/* Primary CTA */}
                                <button
                                    className="w-full h-12 flex items-center justify-center gap-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all active:scale-[0.99] shadow-md shadow-indigo-100"
                                    onClick={() => {
                                        handleSubmit();
                                        setLoading(true);

                                    }}
                                >
                                    {
                                        loading ? (
                                            <DotLoader size={20} color={"white"} />
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4" />
                                                {fileType === "text" ? "Save Note" : "Upload Note"}
                                            </>
                                        )
                                    }
                                </button>
                            </div>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={() => onOpenChange(false)}
                            className="absolute top-4 right-4 p-1.5 rounded-full transition-all"
                            style={{
                                color: theme.colors.darkGray,
                                background: theme.colors.white,
                                border: `1px solid ${theme.colors.lightGray}`,
                            }}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                </div >
            )}
        </AnimatePresence >
    )
}

