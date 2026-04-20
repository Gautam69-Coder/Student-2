import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { X, Trash, FlaskConical, FileUp, FileText, Image as ImageIcon } from "lucide-react"
import { createPractical, updatePractical } from "@/Api/api"
import { getLenis } from "@/hooks/useLenis"
import { useData } from "@/context/DataContext"

const PracticalUpload = ({ open, onOpenChange, uniqueSubjects }) => {
    const { refreshPracticals } = useData();

    const [newPractical, setNewPractical] = useState({
        practicalNumber: '',
        section: '',
        questions: [{ question: '', code: '', fileData: null, fileName: null, fileType: null }]
    });
    const [editPracticalId, setEditPracticalId] = useState(null);

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
        setNewPractical({
            ...newPractical,
            questions: [...newPractical.questions, { question: '', code: '', fileData: null, fileName: null, fileType: null }]
        });
    };

    const handleAddPractical = async (e) => {
        e.preventDefault();
        try {
            if (editPracticalId) {
                await updatePractical(editPracticalId, newPractical);
                setEditPracticalId(null);
            } else {
                await createPractical(newPractical);
                setNewPractical({ 
                    practicalNumber: '', 
                    section: '', 
                    questions: [{ question: '', code: '', fileData: null, fileName: null, fileType: null }] 
                });
                alert('Practical added successfully!');
            }
            refreshPracticals(); // Refresh global practicals list
        } catch (error) {
            console.error('Error adding practical:', error);
            alert('Failed to add practical');
        }
    };

    const handleRemoveQuestion = (index) => {
        setNewPractical({
            ...newPractical,
            questions: newPractical.questions.filter((_, i) => i !== index)
        });
    };

    const handleFileChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedQuestions = [...newPractical.questions];
                updatedQuestions[index] = {
                    ...updatedQuestions[index],
                    fileData: reader.result,
                    fileName: file.name,
                    fileType: file.type
                };
                setNewPractical({ ...newPractical, questions: updatedQuestions });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveFile = (index) => {
        const updatedQuestions = [...newPractical.questions];
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            fileData: null,
            fileName: null,
            fileType: null
        };
        setNewPractical({ ...newPractical, questions: updatedQuestions });
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
                                <div className="bg-white dark:bg-slate-900 rounded-xl sm:p-8  sm:border border-[#E5E5E5] dark:border-slate-800 shadow-sm">
                                    <div className="space-y-6">
                                        <div className="flex justify-between w-full gap-4">
                                            <div className="w-full">
                                                <label htmlFor="practical-subject" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    Subject
                                                </label>
                                                <select
                                                    className="mt-2 w-full px-4 h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 rounded-lg appearance-none cursor-pointer text-slate-900 dark:text-white"
                                                    value={newPractical.section}
                                                    onChange={e => setNewPractical({ ...newPractical, section: e.target.value })}
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
                                                    onChange={e => setNewPractical({ ...newPractical, practicalNumber: e.target.value })}
                                                    placeholder="e.g. 1, 2A, 3..."
                                                    className="mt-2 w-full px-4 h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 rounded-lg transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="border-blue-400/50 border-dashed border rounded-lg p-4 space-y-8 bg-blue-50/10 dark:bg-blue-900/10">
                                            {newPractical.questions.map((question, index) => (
                                                <React.Fragment key={index}>
                                                    <div className="space-y-4">
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
                                                                value={newPractical.questions[index].question}
                                                                onChange={(e) => {
                                                                    const updatedQuestions = [...newPractical.questions];
                                                                    updatedQuestions[index] = { ...updatedQuestions[index], question: e.target.value };
                                                                    setNewPractical({ ...newPractical, questions: updatedQuestions });
                                                                }}
                                                                required
                                                                placeholder="Write the practical question/problem statement..."
                                                                className="mt-2 w-full px-4 h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 rounded-lg transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label htmlFor={`practical-code-${index}`} className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                                Code Template
                                                            </label>
                                                            <textarea
                                                                id={`practical-code-${index}`}
                                                                value={newPractical.questions[index].code}
                                                                onChange={(e) => {
                                                                    const updatedQuestions = [...newPractical.questions];
                                                                    updatedQuestions[index] = { ...updatedQuestions[index], code: e.target.value };
                                                                    setNewPractical({ ...newPractical, questions: updatedQuestions });
                                                                }}
                                                                required
                                                                placeholder="// Starter code for students..."
                                                                className="mt-2 w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 rounded-lg min-h-40 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                                            />
                                                        </div>

                                                        <div className="mt-2 text-slate-700 dark:text-slate-300">
                                                            <label className="text-sm font-medium block mb-2">
                                                                Reference Image or File (Optional)
                                                            </label>

                                                            {!newPractical.questions[index].fileData ? (
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
                                                                            onChange={(e) => handleFileChange(index, e)}
                                                                        />
                                                                    </label>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-4 p-4 bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-xl relative group">
                                                                    <div className="p-2.5 bg-slate-800 dark:bg-slate-900 rounded-lg text-white">
                                                                        {newPractical.questions[index].fileType?.startsWith('image/') ? (
                                                                            <ImageIcon className="w-5 h-5" />
                                                                        ) : (
                                                                            <FileText className="w-5 h-5" />
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-bold text-white truncate">
                                                                            {newPractical.questions[index].fileName}
                                                                        </p>
                                                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-0.5">
                                                                            {(newPractical.questions[index].fileType || 'file').split('/')[1]}
                                                                        </p>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveFile(index)}
                                                                        className="p-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </button>

                                                                    {newPractical.questions[index].fileType?.startsWith('image/') && (
                                                                        <div className="absolute -top-32 left-0 w-32 h-32 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                                            <img src={newPractical.questions[index].fileData} alt="Preview" className="w-full h-full object-cover bg-white" />
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

                                        <div className="flex gap-4">
                                            <button
                                                type="submit"
                                                className="w-full bg-slate-900 dark:bg-slate-100 mt-4 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-medium rounded-lg h-12 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                                            >
                                                <FlaskConical className="w-4 h-4" /> {editPracticalId ? 'Update Practical' : 'Add Practical'}
                                            </button>
                                            {editPracticalId && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setNewPractical({
                                                            practicalNumber: '',
                                                            section: '',
                                                            questions: [{ question: "", code: "", fileData: null, fileName: null, fileType: null }]
                                                        });
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
