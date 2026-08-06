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

    const [codeTab, setCodeTab] = useState([{ languageName: '', code: '' }]);


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
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                    {editPracticalId ? 'Edit Practical' : 'Add New Practical'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                    {editPracticalId ? 'Update the details and code for this practical' : 'Create a new practical assignment with code template'}
                </p>
            </motion.div>

            <form onSubmit={handleAddPractical}>
                <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-[10px] p-8 border border-[#E5E5E5] dark:border-slate-800 shadow-sm ">
                    <div className="space-y-6">
                        <div className="flex justify-between w-full gap-4">
                            <div className="w-full">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Subject</label>
                                <select
                                    className="mt-2 w-full px-4 h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 rounded-[10px] appearance-none cursor-pointer text-slate-900 dark:text-white"
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
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Practical No</label>
                                <input
                                    type="text"
                                    value={newPractical.practicalNumber}
                                    onChange={e => setNewPractical({ ...newPractical, practicalNumber: e.target.value })}
                                    placeholder="e.g. 1, 2A, 3..."
                                    className="mt-2 w-full px-4 h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 rounded-[10px] transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                    required
                                />
                            </div>
                        </div>

                        <div className="border-blue-400/50 border-dashed border rounded-[10px] p-4 space-y-8 bg-blue-50/10 dark:bg-blue-900/10">
                            {newPractical.questions.map((question, index) => (
                                <React.Fragment key={index}>
                                    <div className="space-y-4">
                                        <div className="flex justify-between w-full">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Question {index + 1}</label>
                                            {newPractical.questions.length > 1 && (
                                                <Trash className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700" onClick={() => handleRemoveQuestion(index)} />
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
                                            className="w-full px-4 h-11 bg-slate-50 dark:bg-slate-950 border rounded-[10px] text-slate-900 dark:text-white"
                                        />

                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Code Template</label>
                                        <div className="border-blue-400/50 border-dashed border rounded-[10px] p-4 space-y-8 mt-2">
                                            {question.code && question.code.map((item, codeIndex) => (
                                                <>
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div className="flex items-center gap-1 border rounded-[10px] px-4 py-2 bg-slate-50 dark:bg-slate-950">
                                                            {codeIndex + 1}
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
                                                            placeholder="Write a language name for this code tab "
                                                            className="w-full px-4 h-11 bg-slate-50 dark:bg-slate-950 border rounded-[10px] text-slate-900 dark:text-white"
                                                        />
                                                        {question.code && question.code.length > 1 && (
                                                            <Trash className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700" onClick={() => handleRemoveCodeTab(index, codeIndex)} />
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
                                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border rounded-[10px] min-h-40 font-mono text-sm text-slate-900 dark:text-white"
                                                    />

                                                </>
                                            ))}
                                            <button className="w-full  text-nowrap p-2 bg-slate-900 dark:bg-slate-100  text-white dark:text-slate-900 font-medium rounded-[10px]  flex items-center justify-center gap-2" onClick={() => handleAddCodeTab(index)} type="button">+ Add Tab</button>
                                        </div>

                                        <div className="mt-2">
                                            <label className="text-sm font-medium block mb-2 text-slate-700 dark:text-slate-300">Reference File (Optional)</label>
                                            {!question.file && !question.fileUrl ? (
                                                <div className="flex items-center justify-center w-full">
                                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-[10px] cursor-pointer bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900">
                                                        <FileUp className="w-8 h-8 mb-2 text-slate-400" />
                                                        <span className="text-sm text-slate-500">Click to upload</span>
                                                        <input type="file" className="hidden" onChange={(e) => handleFileChange(index, e)} />
                                                    </label>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-4 p-4 bg-slate-900 dark:bg-slate-950 border rounded-[10px] relative group text-white">
                                                    {(question.file?.type?.startsWith('image/') || question.fileType?.startsWith('image/')) ? <ImageIcon /> : <FileText />}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold truncate">{question.file?.name || question.fileName}</p>
                                                        <p className="text-[10px] text-slate-400 uppercase">{question.file?.type || question.fileType}</p>
                                                    </div>
                                                    <button type="button" onClick={() => handleRemoveFile(index)} className="p-1.5 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500 hover:text-white"><X className="w-4 h-4" /></button>
                                                    {(question.file || question.fileUrl) && (question.file?.type?.startsWith('image/') || question.fileType?.startsWith('image/')) && (
                                                        <div className="absolute -top-32 left-0 w-32 h-32 rounded-[10px] border shadow-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                            <img src={question.file ? URL.createObjectURL(question.file) : question.fileUrl} alt="Preview" className="w-full h-full object-cover bg-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {index < newPractical.questions.length - 1 && <hr className="border-slate-100 dark:border-slate-800 my-2" />}
                                </React.Fragment>
                            ))}
                            <button className="w-full bg-slate-900 dark:bg-slate-100 mt-4 text-white dark:text-slate-900 font-medium rounded-[10px] h-12 flex items-center justify-center gap-2" onClick={handleAddQuestion} type="button">+ Add Question</button>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-slate-900 dark:bg-slate-100 mt-4 text-white dark:text-slate-900 font-medium rounded-[10px] h-12 flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {isSubmitting ? <><Loader2 className="animate-spin" /> Working...</> : <><FlaskConical className="w-4 h-4" /> {editPracticalId ? 'Update Practical' : 'Add Practical'}</>}
                            </button>
                            {editPracticalId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setNewPractical({ practicalNumber: '', section: '', questions: [EMPTY_QUESTION()] })
                                        setEditPracticalId(null)
                                    }}
                                    className="w-fit px-4 bg-blue-500 mt-4 text-white font-medium rounded-[10px] h-12 flex items-center justify-center gap-2"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </form>

            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Practicals</h2>
                        <p className="text-slate-500 dark:text-slate-400">All Added Practicals</p>
                    </div>
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="h-10 px-3 bg-white dark:bg-slate-900 border rounded-[10px] text-sm text-slate-900 dark:text-white"
                    >
                        <option value="all">All Subjects</option>
                        {(Array.isArray(uniqueSubjectSections) ? uniqueSubjectSections : uniqueSubjectSections?.data || []).map((section) => (
                            <option key={section._id} value={section.name}>{section.name}</option>
                        ))}
                    </select>
                </div>

                <div className="bg-white dark:bg-slate-900 border-2 dark:border-slate-800 p-4 rounded-[10px] overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b dark:border-slate-800">
                                <th className="px-4 py-3 text-slate-900 dark:text-slate-200">No.</th>
                                <th className="px-4 py-3 text-slate-900 dark:text-slate-200 text-left">Subject</th>
                                <th className="px-4 py-3 text-slate-900 dark:text-slate-200 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {practicals
                                .sort((a, b) => b.practicalNumber - a.practicalNumber)
                                .filter(p => filterRole === "all" || p.section === filterRole)
                                .map((practical) => (
                                    <tr className="border-b dark:border-slate-800 last:border-0" key={practical._id}>
                                        <td className="px-4 py-3 text-center text-slate-700 dark:text-slate-300">{practical.practicalNumber}</td>
                                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{practical.section}</td>
                                        <td className="px-4 py-3 text-right flex justify-end gap-2">
                                            <button onClick={() => handleUpdatePractical(practical)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-[10px] hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-slate-900 dark:text-white"><Pen className="w-4 h-4" /></button>
                                            <button onClick={() => handleDeletePractical(practical._id)} className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-[10px] hover:bg-red-600 hover:text-white transition-all"><Trash className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    )
}
