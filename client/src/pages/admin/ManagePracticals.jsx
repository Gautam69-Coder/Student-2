import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trash, FlaskConical, Pen, FileUp, X, Image as ImageIcon, FileText, Loader2 } from "lucide-react"
import {
    createPractical,
    updatePractical,
    deletePractical,
    fetchPracticals
} from "@/Api/api"
import { useTitle } from "@/hooks/useTitle"
import { customMessage } from "@/Utils/customMessage"

const EMPTY_CodeTab = () => ({ languageName: '', code: '' });
const EMPTY_QUESTION = () => ({ question: '',code : [EMPTY_CodeTab()], file: null });

export function ManagePracticals({ uniqueSubjectSections }) {
    useTitle("Manage Practicals");

    const [newPractical, setNewPractical] = useState({
        practicalNumber: '',
        section: '',
        questions: [EMPTY_QUESTION()]
    });

    const [practicals, setPracticals] = useState([]);
    const [editPracticalId, setEditPracticalId] = useState(null);
    const [filterRole, setFilterRole] = useState("all");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddQuestion = () => {
        setNewPractical(prev => ({
            ...prev,
            questions: [...prev.questions, EMPTY_QUESTION()]
        }));
    };

    const handleAddCodeTab = (index) => {
        setNewPractical(prev => {
            const updatedQuestions = [...prev.questions];
            updatedQuestions[index].code.push(EMPTY_CodeTab());
            return { ...prev, questions: updatedQuestions };
        });
    };

    const handleRemoveCodeTab = (qIndex, codeIndex) => {
        setNewPractical(prev => {
            const updatedQuestions = [...prev.questions];
            updatedQuestions[qIndex].code = updatedQuestions[qIndex].code.filter((_, i) => i !== codeIndex);
            return { ...prev, questions: updatedQuestions };
        });
    }

    const handleRemoveQuestion = (index) => {
        setNewPractical(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index)
        }));
    };

    const handleFileChange = (index, e) => {
        const file = e.target.files?.[0] ?? null;
        setNewPractical(prev => {
            const updated = [...prev.questions];
            updated[index] = { ...updated[index], file };
            return { ...prev, questions: updated };
        });
    };

    const handleRemoveFile = (index) => {
        setNewPractical(prev => {
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

            // Prepare questions payload (Sans File object for JSON stringification)
            const questionsPayload = newPractical.questions.map(q => ({
                question: q.question,
                fileUrl: q.fileUrl || null,
                code: JSON.stringify(q.code) || null,
                filePublicId: q.filePublicId || null,
                fileName: q.file?.name || q.fileName || null,
                fileType: q.file?.type || q.fileType || null
            }));
            formData.append("questions", JSON.stringify(questionsPayload));

            // Append new files and track their question indices
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

            setNewPractical({ practicalNumber: '', section: '', questions: [EMPTY_QUESTION()] });
            handleFetchPracticals();
        } catch (error) {
            console.error('Error saving practical:', error);
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
            questions: practical.questions.length > 0
                ? practical.questions.map(q => ({ ...q, file: null })) // New files override old ones
                : [EMPTY_QUESTION()]
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeletePractical = async (practicalId) => {
        try {
            if (!window.confirm("Are you sure you want to delete this practical?")) return;
            await deletePractical(practicalId);
            setPracticals(prev => prev.filter(p => p._id !== practicalId));
            customMessage({ type: "success", content: "Practical deleted successfully" });
        } catch (error) {
            console.error(error);
            customMessage({ type: "error", content: "Failed to delete practical" });
        }
    };

    const handleFetchPracticals = async () => {
        try {
            const res = await fetchPracticals();
            setPracticals(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        handleFetchPracticals();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    }

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 p-4 select-none">
            <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                    Manage Practicals
                </h2>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Create and organize practical lab assignments for students
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Panel: List of Practicals */}
                <div className="space-y-4 lg:col-span-1">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
                            Practicals List ({practicals.length})
                        </h3>
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="h-9 px-3 neo-inset text-xs text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                        >
                            <option value="all">All Subjects</option>
                            {(Array.isArray(uniqueSubjectSections) ? uniqueSubjectSections : uniqueSubjectSections?.data || []).map((section) => (
                                <option key={section._id} value={section.name}>{section.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-1" data-lenis-prevent="true">
                        {/* Add New Practical Button at the top of the list */}
                        <button
                            onClick={() => {
                                setEditPracticalId(null);
                                setNewPractical({ practicalNumber: '', section: '', questions: [EMPTY_QUESTION()] });
                            }}
                            className={`w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                !editPracticalId
                                    ? 'shadow-[inset_2px_2px_4px_#c8d0e7,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#0f121b,inset_-2px_-2px_4px_#272e41] text-indigo-600 dark:text-[#CCFF00]'
                                    : 'neo-btn text-slate-500 hover:text-slate-600'
                            }`}
                        >
                            + Create New Practical
                        </button>

                        {practicals
                            .sort((a, b) => b.practicalNumber - a.practicalNumber)
                            .filter(p => filterRole === "all" || p.section === filterRole)
                            .map((practical) => {
                                const isSelected = editPracticalId === practical._id;
                                return (
                                    <div
                                        key={practical._id}
                                        onClick={() => handleUpdatePractical(practical)}
                                        className={`p-4 rounded-2xl cursor-pointer relative group transition-all duration-200 ${
                                            isSelected
                                                ? "bg-[#e6eef8] shadow-[inset_4px_4px_8px_#c8d0e7,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#0f121b,inset_-4px_-4px_8px_#272e41]"
                                                : "neo-flat hover:translate-y-[-1px]"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-[inset_2px_2px_4px_#c8d0e7,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#0f121b,inset_-2px_-2px_4px_#272e41] bg-transparent ${isSelected ? 'text-indigo-500 dark:text-[#CCFF00]' : 'text-slate-500 dark:text-slate-400'}`}>
                                                    #{practical.practicalNumber}
                                                </div>
                                                <div>
                                                    <h4 className={`font-bold text-xs uppercase tracking-wider ${isSelected ? 'text-indigo-600 dark:text-[#CCFF00]' : 'text-slate-900 dark:text-white'}`}>
                                                        {practical.section}
                                                    </h4>
                                                    <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                                                        Questions: {practical.questions?.length || 0}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeletePractical(practical._id);
                                                    }}
                                                    className="p-1.5 rounded-lg neo-btn text-slate-400 hover:text-red-500 cursor-pointer"
                                                    title="Delete Practical"
                                                >
                                                    <Trash className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                        {practicals.filter(p => filterRole === "all" || p.section === filterRole).length === 0 && (
                            <div className="text-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-slate-400 text-xs font-bold uppercase tracking-wider bg-transparent shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)]">
                                No practicals found.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Form */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            {editPracticalId ? `Edit Practical #${newPractical.practicalNumber}` : 'Add New Practical Details'}
                        </h3>
                    </div>

                    <form onSubmit={handleAddPractical}>
                        <div className="neo-flat p-6 sm:p-8 border-none shadow-none space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between w-full gap-5">
                                <div className="w-full">
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Subject</label>
                                    <select
                                        className="mt-2 w-full px-4 h-11 neo-inset focus:outline-none text-slate-900 dark:text-white cursor-pointer"
                                        value={newPractical.section}
                                        onChange={e => setNewPractical({ ...newPractical, section: e.target.value })}
                                        required
                                    >
                                        <option value="">Select subject</option>
                                        {(Array.isArray(uniqueSubjectSections) ? uniqueSubjectSections : uniqueSubjectSections?.data || []).map((section) => (
                                            <option key={section._id || section.name} value={section.name}>{section.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="w-full">
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Practical No</label>
                                    <input
                                        type="text"
                                        value={newPractical.practicalNumber}
                                        onChange={e => setNewPractical({ ...newPractical, practicalNumber: e.target.value })}
                                        placeholder="e.g. 1, 2A, 3..."
                                        className="mt-2 w-full px-4 h-11 neo-inset focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="shadow-[inset_2px_2px_4px_#c8d0e7,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#0f121b,inset_-2px_-2px_4px_#272e41] rounded-2xl p-6 space-y-8 bg-[#e6eef8]/50 dark:bg-[#1b202e]/50">
                                {newPractical.questions.map((question, index) => (
                                    <React.Fragment key={index}>
                                        <div className="space-y-4">
                                            <div className="flex justify-between w-full">
                                                <label className="text-xs font-black text-slate-550 dark:text-slate-400 uppercase tracking-widest">Question {index + 1}</label>
                                                {newPractical.questions.length > 1 && (
                                                    <Trash className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700 transition-colors" onClick={() => handleRemoveQuestion(index)} />
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
                                                className="w-full px-4 h-11 neo-inset focus:outline-none text-slate-900 dark:text-white"
                                            />

                                            <label className="text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider block mt-2">Code Template</label>
                                            <div className="shadow-[inset_2px_2px_4px_#c8d0e7,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#0f121b,inset_-2px_-2px_4px_#272e41] rounded-xl p-5 space-y-8 mt-4 bg-[#e6eef8]/50 dark:bg-[#1b202e]/50">
                                                {question.code && question.code.map((item, codeIndex) => (
                                                    <React.Fragment key={codeIndex}>
                                                        <div className="flex items-center justify-between gap-4">
                                                            <div className="flex items-center gap-1 px-4 py-2 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] rounded-lg font-black bg-[#e6eef8] dark:bg-[#1b202e] text-slate-600 dark:text-slate-400 text-xs">
                                                                Tab {codeIndex + 1}
                                                            </div>
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
                                                                className="w-full px-4 h-11 neo-inset focus:outline-none text-slate-900 dark:text-white"
                                                            />
                                                            {question.code && question.code.length > 1 && (
                                                                <Trash className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700 transition-colors" onClick={() => handleRemoveCodeTab(index, codeIndex)} />
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
                                                            className="w-full px-4 py-3 neo-inset focus:outline-none min-h-40 font-mono text-xs text-slate-900 dark:text-white"
                                                        />
                                                    </React.Fragment>
                                                ))}
                                                <button className="w-full text-nowrap p-2.5 neo-btn text-slate-800 dark:text-white font-bold flex items-center justify-center gap-2 cursor-pointer" onClick={() => handleAddCodeTab(index)} type="button">+ Add Tab</button>
                                            </div>

                                            <div className="mt-4">
                                                <label className="text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider block mb-2">Reference File (Optional)</label>
                                                {!question.file && !question.fileUrl ? (
                                                    <div className="flex items-center justify-center w-full">
                                                        <label className="flex flex-col items-center justify-center w-full h-32 cursor-pointer rounded-xl bg-transparent shadow-[inset_2px_2px_4px_#c8d0e7,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#0f121b,inset_-2px_-2px_4px_#272e41] border-2 border-dashed border-slate-300 dark:border-slate-700 hover:opacity-85 transition-all">
                                                            <FileUp className="w-7 h-7 mb-2 text-slate-400" />
                                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Click to upload reference file</span>
                                                            <input type="file" className="hidden" onChange={(e) => handleFileChange(index, e)} />
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-4 p-4 bg-slate-900 dark:bg-slate-955 border border-slate-800 rounded-xl relative group text-white">
                                                        {(question.file?.type?.startsWith('image/') || question.fileType?.startsWith('image/')) ? <ImageIcon className="text-slate-400" /> : <FileText className="text-slate-400" />}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold truncate text-white">{question.file?.name || question.fileName}</p>
                                                            <p className="text-[10px] text-slate-400 uppercase font-black">{question.file?.type || question.fileType}</p>
                                                        </div>
                                                        <button type="button" onClick={() => handleRemoveFile(index)} className="p-1.5 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500 hover:text-white transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
                                                        {(question.file || question.fileUrl) && (question.file?.type?.startsWith('image/') || question.fileType?.startsWith('image/')) && (
                                                            <div className="absolute -top-32 left-0 w-32 h-32 rounded-xl border border-slate-700 shadow-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                                <img src={question.file ? URL.createObjectURL(question.file) : question.fileUrl} alt="Preview" className="w-full h-full object-cover bg-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {index < newPractical.questions.length - 1 && <hr className="border-slate-200/50 dark:border-slate-800/50 my-4" />}
                                    </React.Fragment>
                                ))}
                                <button className="w-full neo-btn mt-4 text-slate-800 dark:text-white font-bold h-12 flex items-center justify-center gap-2 cursor-pointer" onClick={handleAddQuestion} type="button">+ Add Question</button>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full neo-btn mt-4 text-slate-800 dark:text-white font-bold h-12 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                                >
                                    {isSubmitting ? <><Loader2 className="animate-spin w-4 h-4" /> Working...</> : <><FlaskConical className="w-4 h-4" /> {editPracticalId ? 'Update Practical' : 'Add Practical'}</>}
                                </button>
                                {editPracticalId && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setNewPractical({ practicalNumber: '', section: '', questions: [EMPTY_QUESTION()] })
                                            setEditPracticalId(null)
                                        }}
                                        className="w-fit px-6 neo-btn mt-4 text-red-500 font-bold h-12 flex items-center justify-center gap-2 cursor-pointer"
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
    )
}
