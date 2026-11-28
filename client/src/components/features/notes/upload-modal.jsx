import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, Code, Plus, ChevronDown, Layout, Image as ImageIcon } from "lucide-react";
import { createNoteFile, updateNoteFile } from "@/Api/api";
import { customMessage } from "@/Utils/customMessage";
import { DotLoader } from "@/Utils/loaders.jsx";
import { useData } from "@/context/DataContext";

export function UploadModal({ open, onOpenChange, onNoteCreated, onUpdate }) {
    const { notes } = useData();

    const [newSection, setNewSection] = useState(true);
    const [noteData, setNoteData] = useState({
        title: "",
        section: "General",
        code: "",
    });
    const [fileUpload, setFileUpload] = useState(null);
    const [allSections, setallSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updateFileName, setUpdateFileName] = useState(null);
    const [previousFileUrl, setPreviousFileUrl] = useState(null);
    const [isNewFile, setIsNewFile] = useState(false);

    const handleChanged = (e) => {
        setNoteData({ ...noteData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (!open) return;
        if (onUpdate && notes?.length) {
            const particularNote = notes.find((i) => i._id == onUpdate);
            if (particularNote) {
                setNoteData({
                    title: particularNote.title ?? "",
                    section: particularNote.section ?? "",
                    code: particularNote.content === "NAN" ? "" : particularNote.content ?? "",
                });
                setUpdateFileName(particularNote.fileName ?? "");
                setPreviousFileUrl(particularNote.fileData);
                setIsNewFile(false);
            }
        } else {
            setNoteData({ title: "", section: "General", code: "" });
            setFileUpload(null);
            setUpdateFileName(null);
            setPreviousFileUrl(null);
            setIsNewFile(false);
        }
    }, [open, onUpdate, notes]);

    const loadSections = async () => {
        try {
            const sections = notes.map((item) => item.section);
            setallSections([...new Set(sections)]);
        } catch (err) {
            console.error("Failed to load sections", err);
            customMessage({ content: "Failed to load sections", type: "error" });
        }
    };

    useEffect(() => {
        if (open) loadSections();
    }, [open, notes]);

    const handleFileUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFileUpload(e.target.files[0]);
            setIsNewFile(true);
        }
    };

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
            return customMessage({
                content: "Please upload a document or enter some content/code text",
                type: "error",
            });
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
                if (fileUpload) formData.append("file", fileUpload);
                const response = await updateNoteFile(formData);
                if (response.data.success) {
                    customMessage({ content: response.data.msg || "Note updated successfully", type: "success" });
                    setFileUpload(null);
                    onOpenChange(false);
                    onNoteCreated?.();
                }
            } else {
                if (fileUpload) formData.append("file", fileUpload);
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
    };

    const handleSection = () => {
        if (newSection) {
            setNewSection(false);
            setNoteData({ ...noteData, section: "" });
        } else {
            setNoteData({ ...noteData, section: noteData.section });
            setNewSection(true);
        }
    };

    if (!open) return null;

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => onOpenChange(false)}
                        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 10 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-2xl rounded-3xl shadow-2xl border border-border bg-card text-card-foreground overflow-hidden z-10"
                    >
                        <div className="p-6 sm:p-7 max-h-[86vh] overflow-y-auto" data-lenis-prevent>
                            <div className="flex flex-col gap-1 mb-6 pr-10">
                                <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                                    {onUpdate ? "Update Study Note" : "Share Your Notes"}
                                </h2>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    Upload documents and add optional markdown or code snippets organized by section.
                                </p>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-1.5">
                                    <label htmlFor="upload-title" className="text-xs font-bold text-foreground">
                                        Title
                                    </label>
                                    <input
                                        id="upload-title"
                                        type="text"
                                        placeholder="e.g., Java Collections Framework"
                                        name="title"
                                        value={noteData.title}
                                        className="w-full min-h-[44px] px-3.5 rounded-xl text-sm bg-background border border-input text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
                                        onChange={handleChanged}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-foreground flex items-center gap-2">
                                        <Layout className="w-4 h-4 text-primary" aria-hidden="true" />
                                        Section
                                    </label>
                                    <div className="flex gap-2">
                                        {newSection ? (
                                            <div className="relative flex-1">
                                                <select
                                                    className="w-full min-h-[44px] px-3.5 rounded-xl text-sm appearance-none bg-background border border-input text-foreground outline-none focus:ring-2 focus:ring-ring"
                                                    name="section"
                                                    onChange={handleChanged}
                                                    value={noteData.section}
                                                >
                                                    <option value="General">General</option>
                                                    {allSections
                                                        .filter((sec) => sec !== "General")
                                                        .map((item, index) => (
                                                            <option key={index} value={item}>
                                                                {item}
                                                            </option>
                                                        ))}
                                                </select>
                                                <ChevronDown
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                        ) : (
                                            <div className="relative flex-1">
                                                <input
                                                    className="w-full min-h-[44px] px-3.5 pr-10 rounded-xl text-sm bg-background border border-input text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
                                                    name="section"
                                                    onChange={handleChanged}
                                                    value={noteData.section}
                                                    placeholder="Enter new section name"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setNewSection(true)}
                                                    aria-label="Cancel new section"
                                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                                                >
                                                    <X className="w-4 h-4" aria-hidden="true" />
                                                </button>
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            className="min-h-[44px] px-3.5 rounded-xl border border-border bg-background hover:bg-secondary text-foreground flex items-center justify-center gap-1.5 text-xs font-bold transition-colors"
                                            onClick={handleSection}
                                        >
                                            <Plus className="w-4 h-4 text-primary" aria-hidden="true" />
                                            <span className="hidden sm:inline">New</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-foreground flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4 text-primary" aria-hidden="true" />
                                        Upload Document (Optional)
                                    </label>
                                    {updateFileName && updateFileName !== "NAN" ? (
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-background">
                                            <div className="flex items-center gap-3 overflow-hidden min-w-0">
                                                <FileText className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
                                                <span className="text-sm font-bold text-foreground truncate">
                                                    {updateFileName}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <label className="text-xs font-bold text-primary px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-secondary cursor-pointer">
                                                    Replace
                                                    <input type="file" className="hidden" onChange={handleFileUpload} />
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setUpdateFileName("NAN");
                                                        setPreviousFileUrl("NAN");
                                                        setIsNewFile(true);
                                                    }}
                                                    className="text-xs font-bold text-destructive px-3 py-1.5 rounded-lg border border-destructive/25 bg-destructive/10 hover:bg-destructive/20"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="w-full h-28 border-2 border-dashed border-border hover:border-primary/50 bg-background rounded-xl cursor-pointer flex flex-col items-center justify-center gap-1.5 text-xs text-muted-foreground transition-colors p-4">
                                            <FileText className="w-6 h-6 text-primary" aria-hidden="true" />
                                            {fileUpload ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-foreground">{fileUpload.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setFileUpload(null);
                                                        }}
                                                        aria-label="Remove selected file"
                                                        className="text-destructive p-1"
                                                    >
                                                        <X className="w-3.5 h-3.5" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-center">
                                                    Click to select a file (PDF, DOCX, TXT, IMG, PPTX)
                                                </span>
                                            )}
                                            <input type="file" className="hidden" onChange={handleFileUpload} />
                                        </label>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="upload-code" className="text-xs font-bold text-foreground flex items-center gap-2">
                                        <Code className="w-4 h-4 text-primary" aria-hidden="true" />
                                        Content / Code (Optional)
                                    </label>
                                    <textarea
                                        id="upload-code"
                                        data-lenis-prevent
                                        placeholder="Paste your code or study notes here..."
                                        className="w-full p-3.5 rounded-xl text-sm min-h-[150px] font-mono bg-background border border-input text-foreground placeholder:text-muted-foreground resize-y outline-none focus:ring-2 focus:ring-ring"
                                        name="code"
                                        value={noteData.code}
                                        onChange={handleChanged}
                                    />
                                </div>

                                <button
                                    type="button"
                                    disabled={loading}
                                    className="w-full min-h-[46px] flex items-center justify-center gap-2 font-bold text-sm text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-all active:scale-[0.99] shadow-sm shadow-indigo-500/20 disabled:opacity-60"
                                    onClick={handleSubmit}
                                >
                                    {loading ? (
                                        <DotLoader size={20} color="#ffffff" />
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" aria-hidden="true" />
                                            {onUpdate ? "Update Note" : "Save Note"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            aria-label="Close upload modal"
                            className="absolute top-4 right-4 p-2 rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        >
                            <X className="w-4 h-4" aria-hidden="true" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
