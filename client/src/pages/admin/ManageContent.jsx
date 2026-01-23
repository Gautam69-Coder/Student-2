
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
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Pending Approvals</h2>
                <p className="text-slate-500">Review and approve peer-to-peer notes submissions</p>
            </motion.div>

            <div className="space-y-4">
                {pendingNotes.map((note, index) => (
                    <motion.div
                        key={note.id}
                        variants={itemVariants}
                        className="bg-white rounded-xl p-6 border border-[#E5E5E5] hover:border-slate-300 transition-all shadow-sm flex items-center justify-between"
                    >
                        <div className="flex items-center gap-5">
                            <div className="p-3 rounded-xl bg-orange-50 border border-orange-100">
                                <FileText className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">{note.title}</h3>
                                <p className="text-sm text-slate-500 font-medium mt-1">
                                    By <span className="text-slate-900">{note.author}</span> • {note.subject} • {note.date}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                                <Eye className="w-4 h-4 mr-1.5" /> Preview
                            </button>
                            <button className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors">
                                <Check className="w-4 h-4 mr-1.5" /> Approve
                            </button>
                            <button className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors">
                                <X className="w-4 h-4 mr-1.5" /> Reject
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}
