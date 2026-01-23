
import React, { useState } from "react"
import { motion } from "framer-motion"
import { Trash } from "lucide-react"
import { createSection, deleteSection } from "@/Api/api"

export function ManageSubjects({ subjects, uniqueSubjectSections, setUniqueSubjectSections }) {
    const [newSubject, setNewSubject] = useState("")

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

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
            <motion.div variants={itemVariants} className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Subjects</h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                {/* Add Subject Form */}
                <motion.div variants={itemVariants} className="lg:col-span-1 border border-[#E5E5E5] bg-white rounded-xl p-6 shadow-sm h-fit">
                    <h3 className="font-bold text-slate-900 mb-6">Add New Subject</h3>
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600">Subject Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Machine Learning"
                                value={newSubject}
                                onChange={(e) => setNewSubject(e.target.value)}
                                className="w-full px-3 h-10 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 rounded-lg text-sm transition-all"
                            />
                        </div>


                        <button
                            onClick={() => handleAddSection(newSubject)}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg h-11 mt-2 transition-colors active:scale-[0.98]"
                        >
                            Create Subject
                        </button>
                    </div>
                </motion.div>

                {/* Subjects List */}
                <motion.div variants={itemVariants} className="lg:col-span-2 border border-[#E5E5E5] bg-white rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Sr No.</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Sections</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Practical Notes</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {uniqueSubjectSections.map((sub, idx) => (
                                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-slate-900">{idx + 1}</td>
                                    <td className="px-6 py-4 font-mono text-sm text-slate-500">{sub.name}</td>
                                    <td className="px-6 py-4 font-mono text-sm text-slate-500">{subjects.filter((s) => s.section == sub.name).length || 0}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
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
