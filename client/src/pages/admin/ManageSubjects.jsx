
import React, { useState } from "react"
import { motion } from "framer-motion"
import { Trash } from "lucide-react"
import { createSection, deleteSection } from "@/Api/api"
import { useTitle } from "@/hooks/useTitle"

export function ManageSubjects({ subjects, uniqueSubjectSections, setUniqueSubjectSections }) {
    useTitle("Manage Subjects");
    const [newSubject, setNewSubject] = useState("")

    // console.log(subjects)
    // console.log(uniqueSubjectSections)

    const handleAddSection = async (sectionName) => {
        if (!sectionName || !sectionName.trim()) {
            alert("Subject name cannot be empty.");
            return;
        }
        try {
            const res = await createSection(sectionName.trim());
            const addedItem = res.data?.data || res.data;
            setUniqueSubjectSections(prev => [...(Array.isArray(prev) ? prev : []), addedItem]);
            setNewSubject(""); // Clear input!
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteSection = async (sectionId) => {
        try {
            await deleteSection(sectionId);
            setUniqueSubjectSections(prev => (Array.isArray(prev) ? prev : []).filter(section => section._id !== sectionId));
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

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 p-4">
            <motion.div variants={itemVariants} className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Manage Subjects</h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                {/* Add Subject Form */}
                <motion.div variants={itemVariants} className="lg:col-span-1 neo-flat p-6 h-fit border-none shadow-none">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-6">Add New Subject</h3>
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Subject Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Machine Learning"
                                value={newSubject}
                                onChange={(e) => setNewSubject(e.target.value)}
                                className="w-full px-4 h-10 neo-inset text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none"
                            />
                        </div>

                        <button
                            onClick={() => handleAddSection(newSubject)}
                            className="w-full neo-btn text-slate-800 dark:text-white font-bold h-11 mt-2 active:scale-[0.98] cursor-pointer"
                        >
                            Create Subject
                        </button>
                    </div>
                </motion.div>

                {/* Subjects List */}
                <motion.div variants={itemVariants} className="lg:col-span-2 neo-flat overflow-hidden border-none shadow-none">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-100/10 dark:bg-slate-900/10">
                                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sr No.</th>
                                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sections</th>
                                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Practical Notes</th>
                                <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(Array.isArray(uniqueSubjectSections) ? uniqueSubjectSections : uniqueSubjectSections?.data || []).map((sub, idx) => (
                                <tr key={idx} className="border-b border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/10 dark:hover:bg-slate-900/10 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{idx + 1}</td>
                                    <td className="px-6 py-4 font-bold text-sm text-slate-600 dark:text-slate-300">{sub.name}</td>
                                    <td className="px-6 py-4 font-bold text-sm text-slate-500 dark:text-slate-400">{subjects.filter((s) => s.section == sub.name).length || 0}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                className="flex items-center justify-center w-8 h-8 rounded-lg neo-btn text-slate-400 hover:text-red-500 transition-colors"
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
    )
}
