import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { Trash, X } from "lucide-react"
import { createSection, deleteSection } from "@/Api/api"
import { useTitle } from "@/hooks/useTitle"
import ReactDOM from "react-dom";
import { getLenis } from "@/hooks/useLenis"



const AddSections = ({ isOpen, onClose, uniqueSubjectSections, subjects, setUniqueSubjectSections }) => {

    const [newSubject, setNewSubject] = useState("");
    // console.log("hello")


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
    }, [isOpen]);

    const handleAddSection = async (sectionName) => {
        try {
            const res = await createSection(sectionName);
            setUniqueSubjectSections([...uniqueSubjectSections, res.data])
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteSection = async (sectionId) => {
        try {
            await deleteSection(sectionId);
            setUniqueSubjectSections(uniqueSubjectSections.filter(section => section._id !== sectionId))
        } catch (error) {
            console.error(error);
        }
    };

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

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed  inset-0 z-50 flex items-center justify-center px-2 sm:px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="
                        
                        relative sm:p-6 p-2 w-full h-[80vh] sm:h-full max-w-4xl bg-white dark:bg-slate-900 rounded-[10px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 border dark:border-slate-800"
                    >
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4 
                        ">
                            <motion.div variants={itemVariants} className="flex items-center justify-between ">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Manage Subjects</h2>
                                <button
                                    onClick={() => {
                                        onClose()
                                    }}
                                    className="p-2 rounded-[10px] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </motion.div>


                            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8
                             overflow-y-scroll overflow-x-hidden
                                overscroll-contain
                                [&::-webkit-scrollbar]:hidden
                                [-ms-overflow-style:none]
                                [scrollbar-width:none]
                            
                            ">
                                {/* Add Subject Form */}
                                <motion.div variants={itemVariants} className="lg:col-span-2 border border-[#E5E5E5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[10px] p-6 shadow-sm h-fit">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-6">Add New Subject</h3>
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Subject Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Machine Learning"
                                                value={newSubject}
                                                onChange={(e) => setNewSubject(e.target.value)}
                                                className="w-full px-3 h-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 rounded-[10px] text-sm transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                            />
                                        </div>


                                        <button
                                            onClick={() => handleAddSection(newSubject)}
                                            className="w-full bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-medium rounded-[10px] h-11 mt-2 transition-colors active:scale-[0.98]"
                                        >
                                            Create Subject
                                        </button>
                                    </div>
                                </motion.div>

                                {/* Subjects List */}
                                <motion.div variants={itemVariants} className="lg:col-span-2 border border-[#E5E5E5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[10px] overflow-hidden shadow-sm">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                                                <th className="text-left sm:px-6 px-2 sm:py-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sr No.</th>
                                                <th className="text-left sm:px-6 px-2 sm:py-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sections</th>
                                                <th className="text-left sm:px-6 px-2 sm:py-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Practical Notes</th>
                                                <th className="text-right sm:px-6 px-2 sm:py-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {uniqueSubjectSections.map((sub, idx) => (
                                                <tr key={idx} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{idx + 1}</td>
                                                    <td className="px-6 py-4 font-mono text-sm text-slate-500 dark:text-slate-400">{sub.name}</td>
                                                    <td className="px-6 py-4 font-mono text-sm text-slate-500 dark:text-slate-400">{subjects.filter((s) => s.section == sub.name).length || 0}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                className="flex items-center justify-center w-8 h-8 rounded-[10px] text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                                onClick={() => handleDeleteSection(sub._id)}
                                                            >
                                                                <Trash className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    )
}

export default AddSections
