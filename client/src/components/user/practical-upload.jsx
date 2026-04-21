import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { X, Trash, FlaskConical, FileUp, FileText, Image as ImageIcon, Loader2 } from "lucide-react"
import { createPractical, updatePractical } from "@/Api/api"
import { getLenis } from "@/hooks/useLenis"
import { useData } from "@/context/DataContext"

const EMPTY_QUESTION = () => ({ question: '', code: '', file: null });

const PracticalUpload = ({ open, onOpenChange, uniqueSubjects }) => {
    const { refreshPracticals } = useData();

    const [newPractical, setNewPractical] = useState({
        practicalNumber: '',
        section: '',
        questions: [EMPTY_QUESTION()]
    });
    const [editPracticalId, setEditPracticalId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ─── Lenis: stop smooth-scroll while modal is open ───────────────────────────
    useEffect(() => {
        const lenis = getLenis();
        if (open) {
            lenis?.stop();
            document.body.style.overflow = 'hidden';
        } else {
            lenis?.start();
            document.body.style.overflow = '';
        }
        return () => {
            getLenis()?.start();
            document.body.style.overflow = '';
        };
    }, [open]);

    const handleAddQuestion = () => {
        setNewPractical(prev => ({
            ...prev,
            questions: [...prev.questions, EMPTY_QUESTION()]
        }));
    };

    const handleRemoveQuestion = (index) => {
        setNewPractical(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index)
        }));
    };

    const handleFieldChange = (index, field, value) => {
        setNewPractical(prev => {
            const updated = [...prev.questions];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, questions: updated };
        });
    };

    const handleFileChange = (index, e) => {
        const file = e.target.files?.[0] ?? null;
        handleFieldChange(index, 'file', file);
    };

    const handleRemoveFile = (index) => {
        handleFieldChange(index, 'file', null);
    };

    const handleAddPractical = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            if (editPracticalId) {
                // Update doesn't touch files for now – send JSON
                const payload = {
                    practicalNumber: newPractical.practicalNumber,
                    section: newPractical.section,
                    questions: newPractical.questions.map(q => ({
                        question: q.question,
                        code: q.code
                    }))
                };
                await updatePractical(editPracticalId, payload);
                setEditPracticalId(null);
            } else {
                const formData = new FormData();
                formData.append("practicalNumber", newPractical.practicalNumber);
                formData.append("section", newPractical.section);

                // Strip the File object before JSON-serialising questions
                const questionsPayload = newPractical.questions.map(q => ({
                    question: q.question,
                    code: q.code,
                    fileUrl: null,
                    filePublicId: null,
                    fileName: q.file?.name ?? null,
                    fileType: q.file?.type ?? null
                }));
                formData.append("questions", JSON.stringify(questionsPayload));

                // Collect files + their question indices
                const fileIndexMap = [];
                newPractical.questions.forEach((q, index) => {
                    if (q.file) {
                        fileIndexMap.push(index);
                        formData.append("files", q.file);
                    }
                });
                formData.append("fileIndexMap", JSON.stringify(fileIndexMap));

                const res = await createPractical(formData);
                console.log("Practical created:", res.data);
                alert('Practical added successfully!');
            }

            refreshPracticals();
            // Reset form
            setNewPractical({ practicalNumber: '', section: '', questions: [EMPTY_QUESTION()] });
            onOpenChange(false);
        } catch (error) {
            console.error('Error adding practical:', error);
            alert('Failed to add practical. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => onOpenChange(false)}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] dark:bg-slate-900/60"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative z-10 w-full max-w-5xl h-[90vh] flex flex-col"
                    >
                        <div
                            data-lenis-prevent
                            className="
                                bg-white dark:bg-slate-900
                                rounded-xl border border-[#E5E5E5] dark:border-slate-800
                                shadow-sm sm:p-8 p-4
                                h-full overflow-y-auto overflow-x-hidden
                                overscroll-contain
                                [&::-webkit-scrollbar]:hidden
                                [-ms-overflow-style:none]
                                [scrollbar-width:none]
                            "
                        >
                            <div className="flex justify-between mb-5">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                                    Add New Practical
                                </h2>
                                <button
                                    onClick={() => onOpenChange(false)}
                                    className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleAddPractical}>
                                <div className="bg-white dark:bg-slate-900 rounded-xl sm:p-8 sm:border border-[#E5E5E5] dark:border-slate-800 shadow-sm">
                                    <div className="space-y-6">
                                        {/* Subject + Practical Number */}
                                        <div className="flex justify-between w-full gap-4">
                                            <div className="w-full">
                                                <label htmlFor="practical-subject" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    Subject
                                                </label>
                                                <select
                                                    id="practical-subject"
                                                    className="mt-2 w-full px-4 h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 rounded-lg appearance-none cursor-pointer text-slate-900 dark:text-white"
                                                    value={newPractical.section}
                                                    onChange={e => setNewPractical(prev => ({ ...prev, section: e.target.value }))}
                                                    required
                                                >
                                                    <option value="">Select subject</option>
                                                    {uniqueSubjects.map((section) => (
                                                        <option key={section._id} value={section.name}>
                                                            {section.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="w-full">
                                                <label htmlFor="practical-number" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    Practical No
                                                </label>
                                                <input
                                                    type="text"
                                                    id="practical-number"
                                                    value={newPractical.practicalNumber}
                                                    onChange={e => setNewPractical(prev => ({ ...prev, practicalNumber: e.target.value }))}
                                                    placeholder="e.g. 1, 2A, 3..."
                                                    className="mt-2 w-full px-4 h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 rounded-lg transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Questions */}
                                        <div className="border-blue-400/50 border-dashed border rounded-lg p-4 space-y-8 bg-blue-50/10 dark:bg-blue-900/10">
                                            {newPractical.questions.map((question, index) => (
                                                <React.Fragment key={index}>
                                                    <div className="space-y-4">
                                                        {/* Question input */}
                                                        <div>
                                                            <div className="flex justify-between w-full">
                                                                <label htmlFor={`practical-question-${index}`} className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                                    Question {index + 1}
                                                                </label>
                                                                {newPractical.questions.length > 1 && (
                                                                    <Trash
                                                                        className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700 dark:hover:text-red-400"
                                                                        onClick={() => handleRemoveQuestion(index)}
                                                                    />
                                                                )}
                                                            </div>
                                                            <input
                                                                type="text"
                                                                id={`practical-question-${index}`}
                                                                value={question.question}
                                                                onChange={(e) => handleFieldChange(index, 'question', e.target.value)}
                                                                required
                                                                placeholder="Write the practical question/problem statement..."
                                                                className="mt-2 w-full px-4 h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 rounded-lg transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                                            />
                                                        </div>

                                                        {/* Code textarea */}
                                                        <div>
                                                            <label htmlFor={`practical-code-${index}`} className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                                Code Template
                                                            </label>
                                                            <textarea
                                                                id={`practical-code-${index}`}
                                                                value={question.code}
                                                                onChange={(e) => handleFieldChange(index, 'code', e.target.value)}
                                                                required
                                                                placeholder="// Starter code for students..."
                                                                className="mt-2 w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 rounded-lg min-h-40 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                                            />
                                                        </div>

                                                        {/* File upload */}
                                                        <div className="mt-2 text-slate-700 dark:text-slate-300">
                                                            <label className="text-sm font-medium block mb-2">
                                                                Reference Image or File (Optional)
                                                            </label>

                                                            {!question.file ? (
                                                                <div className="flex items-center justify-center w-full">
                                                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 dark:border-slate-800 border-dashed rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all">
                                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                            <FileUp className="w-8 h-8 mb-3 text-slate-400 dark:text-slate-500" />
                                                                            <p className="mb-2 text-sm text-slate-500 dark:text-slate-400 font-medium">Click to upload reference</p>
                                                                            <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">Images, PDFs, or Code files</p>
                                                                        </div>
                                                                        <input
                                                                            type="file"
                                                                            className="hidden"
                                                                            accept="image/*,application/pdf,.txt,.js,.py,.java,.cpp,.c,.cs,.html,.css"
                                                                            onChange={(e) => handleFileChange(index, e)}
                                                                        />
                                                                    </label>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-4 p-4 bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-xl relative group">
                                                                    <div className="p-2.5 bg-slate-800 dark:bg-slate-900 rounded-lg text-white">
                                                                        {question.file.type?.startsWith('image/') ? (
                                                                            <ImageIcon className="w-5 h-5" />
                                                                        ) : (
                                                                            <FileText className="w-5 h-5" />
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-bold text-white truncate">
                                                                            {question.file.name}
                                                                        </p>
                                                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-0.5">
                                                                            {(question.file.type || 'file').split('/')[1] ?? question.file.name.split('.').pop()}
                                                                        </p>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveFile(index)}
                                                                        className="p-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </button>

                                                                    {/* Hover image preview for images */}
                                                                    {question.file.type?.startsWith('image/') && (
                                                                        <div className="absolute -top-32 left-0 w-32 h-32 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                                            <img
                                                                                src={URL.createObjectURL(question.file)}
                                                                                alt="Preview"
                                                                                className="w-full h-full object-cover bg-white"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {index < newPractical.questions.length - 1 && (
                                                        <hr className="border-slate-100 dark:border-slate-800 my-2" />
                                                    )}
                                                </React.Fragment>
                                            ))}

                                            <button
                                                className="w-full bg-slate-900 dark:bg-slate-100 mt-4 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-medium rounded-lg h-12 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                                                onClick={handleAddQuestion}
                                                type="button"
                                            >
                                                + Add Question
                                            </button>
                                        </div>

                                        {/* Submit */}
                                        <div className="flex gap-4">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-slate-900 dark:bg-slate-100 mt-4 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-medium rounded-lg h-12 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FlaskConical className="w-4 h-4" />
                                                        {editPracticalId ? 'Update Practical' : 'Add Practical'}
                                                    </>
                                                )}
                                            </button>
                                            {editPracticalId && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setNewPractical({ practicalNumber: '', section: '', questions: [EMPTY_QUESTION()] });
                                                        setEditPracticalId(null);
                                                    }}
                                                    className="w-fit px-4 bg-blue-500 mt-4 hover:bg-blue-600 text-white font-medium rounded-lg h-12 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                                                >
                                                    <FlaskConical className="w-4 h-4" /> Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default PracticalUpload
