import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash, FlaskConical, FileUp, X, Image as ImageIcon, FileText, Loader2, Plus } from "lucide-react";
import {
    createPractical,
    updatePractical,
    deletePractical,
    fetchPracticals,
} from "@/Api/api";
import { useTitle } from "@/hooks/useTitle";
import { customMessage } from "@/Utils/customMessage";

const EMPTY_CodeTab = () => ({ languageName: "", code: "" });
const EMPTY_QUESTION = () => ({ question: "", code: [EMPTY_CodeTab()], file: null });

export function ManagePracticals({ uniqueSubjectSections }) {
    useTitle("Manage Practicals");

    const [newPractical, setNewPractical] = useState({
        practicalNumber: "",
        section: "",
        questions: [EMPTY_QUESTION()],
    });

    const [practicals, setPracticals] = useState([]);
    const [editPracticalId, setEditPracticalId] = useState(null);
    const [filterRole, setFilterRole] = useState("all");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddQuestion = () => {
        setNewPractical((prev) => ({
            ...prev,
            questions: [...prev.questions, EMPTY_QUESTION()],
        }));
    };

    const handleAddCodeTab = (index) => {
        setNewPractical((prev) => {
            const updatedQuestions = [...prev.questions];
            updatedQuestions[index].code.push(EMPTY_CodeTab());
            return { ...prev, questions: updatedQuestions };
        });
    };

    const handleRemoveCodeTab = (qIndex, codeIndex) => {
        setNewPractical((prev) => {
            const updatedQuestions = [...prev.questions];
            updatedQuestions[qIndex].code = updatedQuestions[qIndex].code.filter((_, i) => i !== codeIndex);
            return { ...prev, questions: updatedQuestions };
        });
    };

    const handleRemoveQuestion = (index) => {
        setNewPractical((prev) => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index),
        }));
    };

    const handleFileChange = (index, e) => {
        const file = e.target.files?.[0] ?? null;
        setNewPractical((prev) => {
            const updated = [...prev.questions];
            updated[index] = { ...updated[index], file };
            return { ...prev, questions: updated };
        });
    };

    const handleRemoveFile = (index) => {
        setNewPractical((prev) => {
            const updated = [...prev.questions];
            updated[index] = { ...updated[index], file: null };
            return { ...prev, questions: updated };
        });
    };

    const handleAddPractical = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("practicalNumber", newPractical.practicalNumber);
            formData.append("section", newPractical.section);

            const questionsPayload = newPractical.questions.map((q) => ({
                question: q.question,
                fileUrl: q.fileUrl || null,
                code: JSON.stringify(q.code) || null,
                filePublicId: q.filePublicId || null,
                fileName: q.file?.name || q.fileName || null,
                fileType: q.file?.type || q.fileType || null,
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

            if (editPracticalId) {
                await updatePractical(editPracticalId, formData);
                setEditPracticalId(null);
                customMessage({ type: "success", content: "Practical updated successfully!" });
            } else {
                await createPractical(formData);
                customMessage({ type: "success", content: "Practical added successfully!" });
            }

            setNewPractical({ practicalNumber: "", section: "", questions: [EMPTY_QUESTION()] });
            handleFetchPracticals();
        } catch (error) {
            console.error("Error saving practical:", error);
            customMessage({ type: "error", content: "Failed to save practical" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdatePractical = (practical) => {
        setEditPracticalId(practical._id);
        setNewPractical({
            practicalNumber: practical.practicalNumber,
            section: practical.section,
            questions:
                practical.questions.length > 0
                    ? practical.questions.map((q) => ({ ...q, file: null }))
                    : [EMPTY_QUESTION()],
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDeletePractical = async (practicalId) => {
        try {
            if (!window.confirm("Are you sure you want to delete this practical?")) return;
            await deletePractical(practicalId);
            setPracticals((prev) => prev.filter((p) => p._id !== practicalId));
            customMessage({ type: "success", content: "Practical deleted successfully" });
        } catch (error) {
            console.error(error);
            customMessage({ type: "error", content: "Failed to delete practical" });
        }
    };

    const handleFetchPracticals = async () => {
        try {
            const res = await fetchPracticals();
            setPracticals(res.data.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        handleFetchPracticals();
    }, []);

    const sectionsList = Array.isArray(uniqueSubjectSections)
        ? uniqueSubjectSections
        : uniqueSubjectSections?.data || [];

    const filteredList = [...practicals]
        .sort((a, b) => Number(b.practicalNumber) - Number(a.practicalNumber))
        .filter((p) => filterRole === "all" || p.section === filterRole);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
                <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                    Manage Practicals
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                    Create and organize practical lab assignments for students
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left List */}
                <div className="space-y-4 lg:col-span-1">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Practicals ({practicals.length})
                        </h3>
                        <select
                            aria-label="Filter practicals by subject"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="min-h-[38px] px-3 rounded-xl bg-card border border-border text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="all">All Subjects</option>
                            {sectionsList.map((section) => (
                                <option key={section._id || section.name} value={section.name}>
                                    {section.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-3 max-h-[calc(100vh-260px)] overflow-y-auto pr-1" data-lenis-prevent="true">
                        <button
                            type="button"
                            onClick={() => {
                                setEditPracticalId(null);
                                setNewPractical({ practicalNumber: "", section: "", questions: [EMPTY_QUESTION()] });
                            }}
                            className={`w-full min-h-[44px] px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                                !editPracticalId
                                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                    : "bg-card text-foreground border-border hover:bg-secondary"
                            }`}
                        >
                            <Plus className="w-4 h-4" aria-hidden="true" />
                            Create New Practical
                        </button>

                        {filteredList.map((practical) => {
                            const isSelected = editPracticalId === practical._id;
                            return (
                                <div
                                    key={practical._id}
                                    onClick={() => handleUpdatePractical(practical)}
                                    className={`p-4 rounded-2xl cursor-pointer group transition-all border ${
                                        isSelected
                                            ? "bg-indigo-500/10 border-primary/50"
                                            : "surface-card"
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xs border shrink-0 ${
                                                    isSelected
                                                        ? "bg-primary text-primary-foreground border-primary"
                                                        : "bg-secondary text-foreground border-border"
                                                }`}
                                            >
                                                #{practical.practicalNumber}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-xs uppercase tracking-wider text-foreground truncate">
                                                    {practical.section}
                                                </h4>
                                                <p className="text-[11px] text-muted-foreground mt-0.5 tabular-nums">
                                                    Questions: {practical.questions?.length || 0}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeletePractical(practical._id);
                                            }}
                                            className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                                            aria-label="Delete practical"
                                            title="Delete Practical"
                                        >
                                            <Trash className="w-3.5 h-3.5" aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredList.length === 0 && (
                            <div className="text-center p-8 border border-dashed border-border rounded-2xl text-muted-foreground text-xs font-semibold">
                                No practicals found.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Form */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {editPracticalId
                            ? `Edit Practical #${newPractical.practicalNumber}`
                            : "Add New Practical Details"}
                    </h3>

                    <form onSubmit={handleAddPractical}>
                        <div className="surface-card rounded-3xl p-5 sm:p-7 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label htmlFor="prac-subject" className="text-xs font-bold text-foreground">
                                        Subject
                                    </label>
                                    <select
                                        id="prac-subject"
                                        className="w-full px-3.5 min-h-[44px] rounded-xl bg-background border border-input text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        value={newPractical.section}
                                        onChange={(e) =>
                                            setNewPractical({ ...newPractical, section: e.target.value })
                                        }
                                        required
                                    >
                                        <option value="">Select subject</option>
                                        {sectionsList.map((section) => (
                                            <option key={section._id || section.name} value={section.name}>
                                                {section.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="prac-no" className="text-xs font-bold text-foreground">
                                        Practical No.
                                    </label>
                                    <input
                                        id="prac-no"
                                        type="text"
                                        value={newPractical.practicalNumber}
                                        onChange={(e) =>
                                            setNewPractical({ ...newPractical, practicalNumber: e.target.value })
                                        }
                                        placeholder="e.g. 1, 2A, 3..."
                                        className="w-full px-3.5 min-h-[44px] rounded-xl bg-background border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="rounded-2xl border border-border bg-secondary/30 p-4 sm:p-6 space-y-6">
                                {newPractical.questions.map((question, index) => (
                                    <React.Fragment key={index}>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                                                    Question {index + 1}
                                                </span>
                                                {newPractical.questions.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveQuestion(index)}
                                                        aria-label={`Remove question ${index + 1}`}
                                                        className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10"
                                                    >
                                                        <Trash className="w-4 h-4" aria-hidden="true" />
                                                    </button>
                                                )}
                                            </div>

                                            <input
                                                type="text"
                                                value={question.question}
                                                onChange={(e) => {
                                                    const updated = [...newPractical.questions];
                                                    updated[index].question = e.target.value;
                                                    setNewPractical({ ...newPractical, questions: updated });
                                                }}
                                                required
                                                placeholder="Write the practical question..."
                                                className="w-full px-4 min-h-[44px] rounded-xl bg-background border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            />

                                            <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                                                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                    Code Tabs
                                                </div>

                                                {question.code &&
                                                    question.code.map((item, codeIndex) => (
                                                        <div key={codeIndex} className="space-y-3 pb-4 border-b last:border-b-0 border-border">
                                                            <div className="flex items-center gap-3">
                                                                <span className="px-3 py-1.5 rounded-lg bg-secondary text-foreground font-bold text-xs shrink-0">
                                                                    Tab {codeIndex + 1}
                                                                </span>
                                                                <input
                                                                    type="text"
                                                                    value={item.languageName}
                                                                    onChange={(e) => {
                                                                        const updated = [...newPractical.questions];
                                                                        updated[index].code[codeIndex].languageName = e.target.value;
                                                                        setNewPractical({ ...newPractical, questions: updated });
                                                                    }}
                                                                    required
                                                                    placeholder="Language Name (e.g. JavaScript, Python)"
                                                                    className="w-full px-3.5 min-h-[40px] rounded-xl bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                                                />
                                                                {question.code.length > 1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveCodeTab(index, codeIndex)}
                                                                        aria-label="Remove code tab"
                                                                        className="p-2 rounded-lg text-destructive hover:bg-destructive/10"
                                                                    >
                                                                        <Trash className="w-4 h-4" aria-hidden="true" />
                                                                    </button>
                                                                )}
                                                            </div>

                                                            <textarea
                                                                value={item.code}
                                                                onChange={(e) => {
                                                                    const updated = [...newPractical.questions];
                                                                    updated[index].code[codeIndex].code = e.target.value;
                                                                    setNewPractical({ ...newPractical, questions: updated });
                                                                }}
                                                                required
                                                                placeholder="// Starter code..."
                                                                className="w-full p-3.5 rounded-xl bg-background border border-input min-h-36 font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                                            />
                                                        </div>
                                                    ))}

                                                <button
                                                    type="button"
                                                    onClick={() => handleAddCodeTab(index)}
                                                    className="w-full min-h-[40px] rounded-xl border border-border bg-secondary hover:bg-muted text-foreground font-bold text-xs flex items-center justify-center gap-1.5"
                                                >
                                                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                                                    Add Code Tab
                                                </button>
                                            </div>

                                            <div className="space-y-2">
                                                <span className="text-xs font-bold text-foreground block">
                                                    Reference File (Optional)
                                                </span>
                                                {!question.file && !question.fileUrl ? (
                                                    <label className="flex flex-col items-center justify-center w-full h-28 cursor-pointer rounded-xl bg-background border-2 border-dashed border-border hover:border-primary/50 transition-colors">
                                                        <FileUp className="w-6 h-6 mb-1.5 text-muted-foreground" aria-hidden="true" />
                                                        <span className="text-xs font-semibold text-muted-foreground">
                                                            Click to upload reference file
                                                        </span>
                                                        <input type="file" className="hidden" onChange={(e) => handleFileChange(index, e)} />
                                                    </label>
                                                ) : (
                                                    <div className="flex items-center gap-3 p-3.5 bg-card border border-border rounded-xl relative group">
                                                        {question.file?.type?.startsWith("image/") ||
                                                        question.fileType?.startsWith("image/") ? (
                                                            <ImageIcon className="text-primary w-5 h-5" aria-hidden="true" />
                                                        ) : (
                                                            <FileText className="text-primary w-5 h-5" aria-hidden="true" />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-bold truncate text-foreground">
                                                                {question.file?.name || question.fileName}
                                                            </p>
                                                            <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                                                                {question.file?.type || question.fileType}
                                                            </p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveFile(index)}
                                                            aria-label="Remove file"
                                                            className="p-1.5 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive hover:text-white transition-colors"
                                                        >
                                                            <X className="w-4 h-4" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {index < newPractical.questions.length - 1 && <hr className="border-border" />}
                                    </React.Fragment>
                                ))}

                                <button
                                    type="button"
                                    onClick={handleAddQuestion}
                                    className="w-full min-h-[42px] rounded-xl border border-border bg-card hover:bg-secondary text-foreground font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Plus className="w-4 h-4" aria-hidden="true" />
                                    Add Question
                                </button>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 min-h-[44px] rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-all active:scale-[0.98]"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin w-4 h-4" aria-hidden="true" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <FlaskConical className="w-4 h-4" aria-hidden="true" />
                                            {editPracticalId ? "Update Practical" : "Add Practical"}
                                        </>
                                    )}
                                </button>
                                {editPracticalId && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setNewPractical({
                                                practicalNumber: "",
                                                section: "",
                                                questions: [EMPTY_QUESTION()],
                                            });
                                            setEditPracticalId(null);
                                        }}
                                        className="px-5 min-h-[44px] rounded-xl border border-destructive/30 bg-destructive/10 text-destructive font-bold text-xs hover:bg-destructive/20 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}
