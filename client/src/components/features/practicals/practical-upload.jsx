import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash, FlaskConical, FileUp, FileText, Image as ImageIcon, Loader2, Sparkles, Plus, Layers } from "lucide-react";
import { createPractical, updatePractical } from "@/Api/api";
import { getLenis } from "@/hooks/useLenis";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { theme } from "@/lib/theme";
import { customMessage } from "@/Utils/customMessage";

const EMPTY_QUESTION = () => ({ question: "", code: "", file: null });

function StatTile({ label, value }) {
    return (
        <div
            className="rounded-2xl border px-4 py-3"
            style={{
                background: theme.colors.softGray,
                borderColor: theme.colors.lightGray,
            }}
        >
            <div className="text-[12px] font-medium" style={{ color: theme.colors.darkGray }}>
                {label}
            </div>
            <div className="text-lg font-bold mt-1" style={{ color: theme.colors.dark }}>
                {value}
            </div>
        </div>
    );
}

function PanelHeader({ title, subtitle, icon: Icon }) {
    return (
        <div className="flex items-start gap-3">
            <div
                className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: theme.colors.limeDim }}
            >
                <Icon className="w-5 h-5" style={{ color: theme.colors.dark }} />
            </div>
            <div className="min-w-0">
                <CardTitle className="text-[16px] sm:text-[18px] font-bold" style={{ color: theme.colors.dark }}>
                    {title}
                </CardTitle>
                <p className="text-[13px] font-medium mt-1" style={{ color: theme.colors.darkGray }}>
                    {subtitle}
                </p>
            </div>
        </div>
    );
}

const PracticalUpload = ({ open, onOpenChange, uniqueSubjects }) => {
    const { refreshPracticals } = useData();

    const [newPractical, setNewPractical] = useState({
        practicalNumber: "",
        section: "",
        questions: [EMPTY_QUESTION()],
    });
    const [editPracticalId, setEditPracticalId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const lenis = getLenis();
        if (open) {
            lenis?.stop();
            document.body.style.overflow = "hidden";
        } else {
            lenis?.start();
            document.body.style.overflow = "";
        }
        return () => {
            getLenis()?.start();
            document.body.style.overflow = "";
        };
    }, [open]);

    const questionCount = useMemo(() => newPractical.questions.length, [newPractical.questions.length]);
    const subjectCount = useMemo(() => uniqueSubjects?.length || 0, [uniqueSubjects]);

    const handleAddQuestion = () => {
        setNewPractical((prev) => ({
            ...prev,
            questions: [...prev.questions, EMPTY_QUESTION()],
        }));
    };

    const handleRemoveQuestion = (index) => {
        setNewPractical((prev) => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index),
        }));
    };

    const handleFieldChange = (index, field, value) => {
        setNewPractical((prev) => {
            const updated = [...prev.questions];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, questions: updated };
        });
    };

    const handleFileChange = (index, e) => {
        const file = e.target.files?.[0] ?? null;
        handleFieldChange(index, "file", file);
    };

    const handleRemoveFile = (index) => {
        handleFieldChange(index, "file", null);
    };

    const resetForm = () => {
        setNewPractical({
            practicalNumber: "",
            section: "",
            questions: [EMPTY_QUESTION()],
        });
        setEditPracticalId(null);
    };

    const handleAddPractical = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            if (editPracticalId) {
                const payload = {
                    practicalNumber: newPractical.practicalNumber,
                    section: newPractical.section,
                    questions: newPractical.questions.map((q) => ({
                        question: q.question,
                        code: q.code,
                    })),
                };

                await updatePractical(editPracticalId, payload);
            } else {
                const formData = new FormData();
                formData.append("practicalNumber", newPractical.practicalNumber);
                formData.append("section", newPractical.section);

                const questionsPayload = newPractical.questions.map((q) => ({
                    question: q.question,
                    code: q.code,
                    fileUrl: null,
                    filePublicId: null,
                    fileName: q.file?.name ?? null,
                    fileType: q.file?.type ?? null,
                }));
                formData.append("questions", JSON.stringify(questionsPayload));

                const fileIndexMap = [];
                newPractical.questions.forEach((q, index) => {
                    if (q.file) {
                        fileIndexMap.push(index);
                        formData.append("files", q.file);
                    }
                });
                formData.append("fileIndexMap", JSON.stringify(fileIndexMap));

                await createPractical(formData);
            }

            await refreshPracticals();
            resetForm();
            onOpenChange(false);
            customMessage({
                type: "success",
                content: editPracticalId ? "Practical updated successfully!" : "Practical added successfully!"
            });
        } catch (error) {
            console.error("Error adding practical:", error);
            customMessage({
                type: "error",
                content: "Failed to add practical. Please try again."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        resetForm();
        onOpenChange(false);
    };

    if (typeof document === "undefined") return null;

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0"
                        style={{ background: "rgba(17,17,19,0.30)" }}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 10 }}
                        className="relative z-10 w-full max-w-6xl h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden"
                        style={{
                            background: theme.colors.white,
                            borderColor: theme.colors.lightGray,
                        }}
                    >
                        <div
                            className="flex items-start justify-between gap-4 p-4 sm:p-6 border-b"
                            style={{ borderColor: theme.colors.lightGray }}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div
                                    className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: theme.colors.limeDim }}
                                >
                                    <FlaskConical className="w-5 h-5" style={{ color: theme.colors.dark }} />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-xl sm:text-2xl font-black" style={{ color: theme.colors.dark }}>
                                        Add New Practical
                                    </h2>
                                    <p className="text-sm font-medium mt-1" style={{ color: theme.colors.darkGray }}>
                                        Build practical questions, starter code, and optional file references
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleClose}
                                className="p-2 rounded-xl border transition-colors hover:bg-slate-50 shrink-0"
                                style={{
                                    background: theme.colors.white,
                                    borderColor: theme.colors.lightGray,
                                    color: theme.colors.darkGray,
                                }}
                                aria-label="Close practical upload modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6" data-lenis-prevent>
                            <form onSubmit={handleAddPractical} className="space-y-6">
                                <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6">
                                    <Card
                                        className="xl:col-span-2 rounded-2xl"
                                        style={{
                                            background: theme.colors.white,
                                            borderColor: theme.colors.lightGray,
                                            boxShadow: "0 10px 0 rgba(17,17,19,0.05)",
                                        }}
                                    >
                                        <CardHeader className="pb-3">
                                            <PanelHeader
                                                icon={Sparkles}
                                                title="Practical Details"
                                                subtitle="Choose the subject and number for the new practical"
                                            />
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="space-y-5">
                                                <div>
                                                    <label
                                                        htmlFor="practical-subject"
                                                        className="block text-sm font-semibold mb-2"
                                                        style={{ color: theme.colors.dark }}
                                                    >
                                                        Subject
                                                    </label>
                                                    <select
                                                        id="practical-subject"
                                                        className="w-full px-4 h-12 rounded-xl border outline-none transition-colors appearance-none cursor-pointer"
                                                        value={newPractical.section}
                                                        onChange={(e) =>
                                                            setNewPractical((prev) => ({ ...prev, section: e.target.value }))
                                                        }
                                                        required
                                                        style={{
                                                            background: theme.colors.softGray,
                                                            borderColor: theme.colors.lightGray,
                                                            color: theme.colors.dark,
                                                        }}
                                                    >
                                                        <option value="">Select subject</option>
                                                        {uniqueSubjects.map((section) => (
                                                            <option key={section._id} value={section.name}>
                                                                {section.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="practical-number"
                                                        className="block text-sm font-semibold mb-2"
                                                        style={{ color: theme.colors.dark }}
                                                    >
                                                        Practical No
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="practical-number"
                                                        value={newPractical.practicalNumber}
                                                        onChange={(e) =>
                                                            setNewPractical((prev) => ({
                                                                ...prev,
                                                                practicalNumber: e.target.value,
                                                            }))
                                                        }
                                                        placeholder="e.g. 1, 2A, 3..."
                                                        className="w-full px-4 h-12 rounded-xl border outline-none transition-colors"
                                                        required
                                                        style={{
                                                            background: theme.colors.softGray,
                                                            borderColor: theme.colors.lightGray,
                                                            color: theme.colors.dark,
                                                        }}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <StatTile label="Questions" value={questionCount} />
                                                    <StatTile label="Subjects" value={subjectCount} />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card
                                        className="xl:col-span-3 rounded-2xl overflow-hidden"
                                        style={{
                                            background: theme.colors.white,
                                            borderColor: theme.colors.lightGray,
                                            boxShadow: "0 10px 0 rgba(17,17,19,0.05)",
                                        }}
                                    >
                                        <CardHeader className="pb-3">
                                            <PanelHeader
                                                icon={Layers}
                                                title="Questions"
                                                subtitle="Add one or more questions with starter code and optional file attachments"
                                            />
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div
                                                className="rounded-2xl border p-4 sm:p-5"
                                                style={{
                                                    background: theme.colors.softGray,
                                                    borderColor: theme.colors.lightGray,
                                                }}
                                            >
                                                <div className="space-y-5">
                                                    {newPractical.questions.map((question, index) => (
                                                        <React.Fragment key={index}>
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <div className="flex items-center justify-between gap-3 mb-2">
                                                                        <label
                                                                            htmlFor={`practical-question-${index}`}
                                                                            className="text-sm font-semibold"
                                                                            style={{ color: theme.colors.dark }}
                                                                        >
                                                                            Question {index + 1}
                                                                        </label>
                                                                        {newPractical.questions.length > 1 && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleRemoveQuestion(index)}
                                                                                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold border transition-colors hover:bg-red-50"
                                                                                style={{
                                                                                    background: theme.colors.white,
                                                                                    borderColor: theme.colors.lightGray,
                                                                                    color: "#DC2626",
                                                                                }}
                                                                            >
                                                                                <Trash className="w-4 h-4" />
                                                                                Remove
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                    <input
                                                                        type="text"
                                                                        id={`practical-question-${index}`}
                                                                        value={question.question}
                                                                        onChange={(e) =>
                                                                            handleFieldChange(index, "question", e.target.value)
                                                                        }
                                                                        required
                                                                        placeholder="Write the practical question/problem statement..."
                                                                        className="w-full px-4 h-12 rounded-xl border outline-none transition-colors"
                                                                        style={{
                                                                            background: theme.colors.white,
                                                                            borderColor: theme.colors.lightGray,
                                                                            color: theme.colors.dark,
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <label
                                                                        htmlFor={`practical-code-${index}`}
                                                                        className="block text-sm font-semibold mb-2"
                                                                        style={{ color: theme.colors.dark }}
                                                                    >
                                                                        Code Template
                                                                    </label>
                                                                    <textarea
                                                                        id={`practical-code-${index}`}
                                                                        value={question.code}
                                                                        onChange={(e) => handleFieldChange(index, "code", e.target.value)}
                                                                        required
                                                                        placeholder="// Starter code for students..."
                                                                        className="w-full px-4 py-3 rounded-xl border outline-none transition-colors min-h-44 font-mono text-sm"
                                                                        style={{
                                                                            background: theme.colors.white,
                                                                            borderColor: theme.colors.lightGray,
                                                                            color: theme.colors.dark,
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <label
                                                                        className="block text-sm font-semibold mb-2"
                                                                        style={{ color: theme.colors.dark }}
                                                                    >
                                                                        Reference Image or File (Optional)
                                                                    </label>

                                                                    {!question.file ? (
                                                                        <label
                                                                            className="flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed cursor-pointer transition-colors hover:bg-slate-50"
                                                                            style={{
                                                                                background: theme.colors.white,
                                                                                borderColor: theme.colors.lightGray,
                                                                            }}
                                                                        >
                                                                            <FileUp className="w-8 h-8 mb-3" style={{ color: theme.colors.darkGray }} />
                                                                            <p className="text-sm font-semibold" style={{ color: theme.colors.dark }}>
                                                                                Click to upload reference
                                                                            </p>
                                                                            <p className="text-xs mt-1 uppercase tracking-wider" style={{ color: theme.colors.darkGray }}>
                                                                                Images, PDFs, or code files
                                                                            </p>
                                                                            <input
                                                                                type="file"
                                                                                className="hidden"
                                                                                accept="image/*,application/pdf,.txt,.js,.py,.java,.cpp,.c,.cs,.html,.css"
                                                                                onChange={(e) => handleFileChange(index, e)}
                                                                            />
                                                                        </label>
                                                                    ) : (
                                                                        <div
                                                                            className="flex items-center gap-4 p-4 rounded-2xl border relative group"
                                                                            style={{
                                                                                background: theme.colors.white,
                                                                                borderColor: theme.colors.lightGray,
                                                                            }}
                                                                        >
                                                                            <div
                                                                                className="p-2.5 rounded-xl flex items-center justify-center"
                                                                                style={{ background: theme.colors.limeDim }}
                                                                            >
                                                                                {question.file.type?.startsWith("image/") ? (
                                                                                    <ImageIcon className="w-5 h-5" style={{ color: theme.colors.dark }} />
                                                                                ) : (
                                                                                    <FileText className="w-5 h-5" style={{ color: theme.colors.dark }} />
                                                                                )}
                                                                            </div>

                                                                            <div className="flex-1 min-w-0">
                                                                                <p className="text-sm font-bold truncate" style={{ color: theme.colors.dark }}>
                                                                                    {question.file.name}
                                                                                </p>
                                                                                <p className="text-[10px] uppercase font-black tracking-widest mt-0.5" style={{ color: theme.colors.darkGray }}>
                                                                                    {(question.file.type || "file").split("/")[1] ??
                                                                                        question.file.name.split(".").pop()}
                                                                                </p>
                                                                            </div>

                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleRemoveFile(index)}
                                                                                className="p-2 rounded-xl border transition-colors hover:bg-red-50"
                                                                                style={{
                                                                                    background: theme.colors.white,
                                                                                    borderColor: theme.colors.lightGray,
                                                                                    color: "#DC2626",
                                                                                }}
                                                                                aria-label="Remove attached file"
                                                                            >
                                                                                <X className="w-4 h-4" />
                                                                            </button>

                                                                            {question.file.type?.startsWith("image/") && (
                                                                                <div className="absolute -top-32 left-0 w-32 h-32 rounded-xl border overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                                                                                    style={{
                                                                                        background: theme.colors.white,
                                                                                        borderColor: theme.colors.lightGray,
                                                                                    }}
                                                                                >
                                                                                    <img
                                                                                        src={URL.createObjectURL(question.file)}
                                                                                        alt="Preview"
                                                                                        className="w-full h-full object-cover"
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {index < newPractical.questions.length - 1 && (
                                                                <hr style={{ borderColor: theme.colors.lightGray }} />
                                                            )}
                                                        </React.Fragment>
                                                    ))}

                                                    <button
                                                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-black transition-transform active:scale-[0.99] border"
                                                        onClick={handleAddQuestion}
                                                        type="button"
                                                        style={{
                                                            background: theme.colors.white,
                                                            color: theme.colors.dark,
                                                            borderColor: theme.colors.lightGray,
                                                        }}
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Add Question
                                                    </button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card
                                    className="rounded-2xl"
                                    style={{
                                        background: theme.colors.white,
                                        borderColor: theme.colors.lightGray,
                                        boxShadow: "0 10px 0 rgba(17,17,19,0.05)",
                                    }}
                                >
                                    <CardContent className="p-4 sm:p-6">
                                        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                                            <div>
                                                <div className="text-sm font-bold" style={{ color: theme.colors.dark }}>
                                                    Ready to save?
                                                </div>
                                                <div className="text-sm mt-1" style={{ color: theme.colors.darkGray }}>
                                                    Review the practical, then upload it to the dashboard.
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                {editPracticalId && (
                                                    <button
                                                        type="button"
                                                        onClick={resetForm}
                                                        className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold border transition-colors hover:bg-slate-50"
                                                        style={{
                                                            background: theme.colors.white,
                                                            color: theme.colors.dark,
                                                            borderColor: theme.colors.lightGray,
                                                        }}
                                                    >
                                                        Cancel Edit
                                                    </button>
                                                )}

                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-black transition-transform active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                                                    style={{
                                                        background: theme.colors.lime,
                                                        color: theme.colors.dark,
                                                        boxShadow: "0 8px 0 rgba(17,17,19,0.14)",
                                                    }}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            Uploading...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FlaskConical className="w-4 h-4" />
                                                            {editPracticalId ? "Update Practical" : "Add Practical"}
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PracticalUpload;
