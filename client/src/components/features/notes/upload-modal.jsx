import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileText, X, Check, Code, Plus, ChevronDown, Layout, File, Image as ImageIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { createNoteFile, updateNoteFile } from "@/Api/api"
import { customMessage } from "@/Utils/customMessage"
import { DotLoader } from "@/Utils/loaders.jsx"
import { theme } from "@/lib/theme"
import { useData } from "@/context/DataContext"

export function UploadModal({ open, onOpenChange, onNoteCreated, onUpdate }) {
    const { notes } = useData();

    const [newSection, setNewSection] = useState(true);
    const [noteData, setNoteData] = useState({
        title: "",
        section: "General",
        code: ""
    });
    const [fileUpload, setFileUpload] = useState(null);
    const [allSections, setallSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updateFileName, setUpdateFileName] = useState(null);
    const [previousFileUrl, setPreviousFileUrl] = useState(null);
    const [isNewFile, setIsNewFile] = useState(false);

    const handleChanged = (e) => {
        setNoteData({ ...noteData, [e.target.name]: e.target.value })
    }

    // Reset state on open/close and when onUpdate changes
    useEffect(() => {
        if (!open) return;
        if (onUpdate && notes?.length) {
            const particularNote = notes.find(i => i._id == onUpdate);
            if (particularNote) {
                setNoteData({
                    title: particularNote.title ?? "",
                    section: particularNote.section ?? "",
                    code: particularNote.content === "NAN" ? "" : (particularNote.content ?? "")
                });
                setUpdateFileName(particularNote.fileName ?? "");
                setPreviousFileUrl(particularNote.fileData);
                setIsNewFile(false);
            }
        } else {
            setNoteData({
                title: "",
                section: "General",
                code: ""
            });
            setFileUpload(null);
            setUpdateFileName(null);
            setPreviousFileUrl(null);
            setIsNewFile(false);
        }
    }, [open, onUpdate, notes]);

    const loadSections = async () => {
        try {
            const sections = notes.map(item => item.section);
            setallSections([...new Set(sections)]);
        } catch (err) {
            console.error("Failed to load sections", err);
            customMessage({ content: "Failed to load sections", type: "error" });
        }
    }

    useEffect(() => {
        if (open) loadSections();
    }, [open, notes]);

    const handleFileUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFileUpload(e.target.files[0]);
            setIsNewFile(true);
        }
    }

    const handleSubmit = async () => {
        if (!noteData.title.trim()) {
            return customMessage({ content: "Title is required", type: "error" });
        }
        if (!noteData.section.trim()) {
            return customMessage({ content: "Section is required", type: "error" });
        }

        const hasSelectedFile = !!fileUpload;
        const hasExistingFile = !!updateFileName && updateFileName !== "NAN";
        const hasTextContent = !!noteData.code.trim();

        if (!hasSelectedFile && !hasExistingFile && !hasTextContent) {
            return customMessage({ content: "Please upload a document or enter some content/code text", type: "error" });
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("title", noteData.title.trim());
            formData.append("section", noteData.section.trim());
            formData.append("content", noteData.code.trim() || "NAN");

            if (onUpdate) {
                formData.append("noteId", onUpdate.toString());
                formData.append("previousFileUrl", previousFileUrl || "NAN");
                formData.append("isNewFile", isNewFile ? "true" : "false");
                if (fileUpload) {
                    formData.append("file", fileUpload);
                }
                const response = await updateNoteFile(formData);
                if (response.data.success) {
                    customMessage({ content: response.data.msg || "Note updated successfully", type: "success" });
                    setFileUpload(null);
                    onOpenChange(false);
                    onNoteCreated?.();
                }
            } else {
                if (fileUpload) {
                    formData.append("file", fileUpload);
                }
                const response = await createNoteFile(formData);
                if (response.data.success) {
                    customMessage({ content: response.data.msg || "Note uploaded successfully", type: "success" });
                    setFileUpload(null);
                    onOpenChange(false);
                    onNoteCreated?.();
                }
            }
        } catch (err) {
            console.error("Upload failed", err);
            customMessage({ content: err.response?.data?.message || "Upload failed", type: "error" });
        } finally {
            setLoading(false);
        }
    }

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
                        <div className="p-6 sm:p-7 max-h-[85vh] overflow-y-auto" data-lenis-prevent>
                            {/* Header */}
                            <div className="flex flex-col gap-1 mb-6">
                                <h2 className="text-xl font-bold tracking-tight" style={{ color: theme.colors.dark }}>
                                    {onUpdate ? "Update Study Note" : "Share Your Notes"}
                                </h2>
                                <p className="text-sm" style={{ color: theme.colors.darkGray }}>
                                    Upload documents and add optional content or code snippets with clean section organization.
                                </p>
                            </div>

                            <div className="space-y-5">
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
                                        onChange={handleChanged}
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
                                                    className="w-full h-10 px-3 rounded-lg text-sm appearance-none transition-all outline-none animate-none"
                                                    name="section"
                                                    onChange={handleChanged}
                                                    value={noteData.section}
                                                    style={{
                                                        background: theme.colors.softGray,
                                                        border: `1px solid ${theme.colors.lightGray}`,
                                                        color: theme.colors.dark,
                                                    }}
                                                >
                                                    <option value="General">General</option>
                                                    {allSections.filter(sec => sec !== "General").map((item, index) => {
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
                                                    onChange={handleChanged}
                                                    value={noteData.section}
                                                    placeholder="Enter new section name"
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
                                            onClick={handleSection}
                                        >
                                            <Plus className="w-4 h-4" style={{ color: theme.colors.lime }} />
                                            <span className="hidden sm:inline" >New</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Upload Document (Optional) */}
                                <div>
                                    <label className="text-sm font-medium flex items-center gap-2" style={{ color: theme.colors.darkGray }}>
                                        <ImageIcon className="w-4 h-4" style={{ color: theme.colors.darkGray }} />
                                        Upload Document (Optional)
                                    </label>
                                    <div className="mt-2">
                                        {updateFileName && updateFileName !== "NAN" ? (
                                            <div
                                                className="flex items-center justify-between p-4 rounded-xl border bg-slate-50"
                                                style={{ borderColor: theme.colors.lightGray }}
                                            >
                                                <div className="flex items-center gap-3 overflow-hidden min-w-0">
                                                    <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
                                                    <span className="text-sm font-bold text-slate-800 truncate">
                                                        {updateFileName}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <label className="text-xs font-bold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer select-none">
                                                        Replace
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            onChange={handleFileUpload}
                                                        />
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setUpdateFileName("NAN");
                                                            setPreviousFileUrl("NAN");
                                                            setIsNewFile(true);
                                                        }}
                                                        className="text-xs font-bold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg border border-red-200 bg-white hover:bg-red-50"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label
                                                className="w-full h-28 border-2 border-dashed rounded-xl cursor-pointer flex flex-col items-center justify-center gap-1.5 text-xs transition-all p-4"
                                                style={{
                                                    background: theme.colors.softGray,
                                                    borderColor: theme.colors.lightGray,
                                                    color: theme.colors.darkGray,
                                                }}
                                            >
                                                <FileText className="w-6 h-6" style={{ color: theme.colors.lime }} />
                                                {fileUpload ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-zinc-800">{fileUpload.name}</span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setFileUpload(null);
                                                            }}
                                                            className="text-red-500 hover:text-red-700 p-1"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-center">Click to select a file (PDF, DOCX, TXT, IMG, PPTX, etc.)</span>
                                                )}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={handleFileUpload}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Content / Code (Optional) */}
                                <div>
                                    <label className="text-sm font-medium flex items-center gap-2" style={{ color: theme.colors.darkGray }}>
                                        <Code className="w-4 h-4" style={{ color: theme.colors.darkGray }} />
                                        Content / Code (Optional)
                                    </label>
                                    <textarea
                                        data-lenis-prevent
                                        placeholder="Paste your code or text here..."
                                        className="mt-1.5 w-full px-3 py-3 rounded-lg text-sm min-h-[160px] font-mono transition-all resize-y outline-none"
                                        style={{
                                            background: theme.colors.softGray,
                                            border: `1px solid ${theme.colors.lightGray}`,
                                            color: theme.colors.dark,
                                        }}
                                        name="code"
                                        value={noteData.code}
                                        onChange={handleChanged}
                                    />
                                </div>

                                {/* Primary CTA */}
                                <button
                                    className="w-full h-12 flex items-center justify-center gap-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all active:scale-[0.99] shadow-md shadow-indigo-100"
                                    onClick={handleSubmit}
                                >
                                    {loading ? (
                                        <DotLoader size={20} color={"white"} />
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" />
                                            {onUpdate ? "Update Note" : "Save Note"}
                                        </>
                                    )}
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
                </div>
            )}
        </AnimatePresence>
    )
}
