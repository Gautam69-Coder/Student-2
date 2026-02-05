
import React from "react"
import { motion } from "framer-motion"
import { FileText, Eye, Check, X } from "lucide-react"

export function ManageContent({ pendingNotes }) {
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
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Pending Approvals</h2>
                <p className="text-slate-500 dark:text-slate-400">Review and approve peer-to-peer notes submissions</p>
            </motion.div>

            <div className="space-y-4">
                {pendingNotes.map((note, index) => (
                    <motion.div
                        key={note.id}
                        variants={itemVariants}
                        className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#E5E5E5] dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm flex items-center justify-between"
                    >
                        <div className="flex items-center gap-5">
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                <FileText className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{note.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                                    By <span className="text-slate-900 dark:text-white">{note.author}</span> • {note.subject} • {note.date}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <Eye className="w-4 h-4 mr-1.5" /> Preview
                            </button>
                            <button className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
                                <Check className="w-4 h-4 mr-1.5" /> Approve
                            </button>
                            <button className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-colors">
                                <X className="w-4 h-4 mr-1.5" /> Reject
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}
