
import React, { useState } from "react"
import { motion } from "framer-motion"
import { FileQuestion, Download, Eye, Calendar, ChevronRight } from "lucide-react"
import { pyqSubjects } from "@/data/student-data";
import ComingSoonPage from "../../Utils/ComingSoon";
// UI imports removed




export function PYQSection() {
    const [expandedSubject, setExpandedSubject] = useState("Java Programming")

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Previous Year Questions</h2> */}

            {/* <div className="space-y-4">
                {pyqSubjects.map((subject, index) => (
                    <motion.div
                        key={subject.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-white rounded-xl overflow-hidden border transition-all duration-300 ${expandedSubject === subject.name ? "border-slate-300 shadow-sm" : "border-[#E5E5E5] hover:border-slate-300"
                            }`}
                    >
                        <button
                            onClick={() => setExpandedSubject(expandedSubject === subject.name ? null : subject.name)}
                            className="w-full flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors"
                        >
                            <div className="flex items-center gap-5">
                                <div className={`p-3 rounded-xl transition-colors ${expandedSubject === subject.name ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>
                                    <FileQuestion className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-slate-900 text-lg">{subject.name}</h3>
                                    <p className="text-sm text-slate-500 font-medium">{subject.papers.length} papers available</p>
                                </div>
                            </div>
                            <ChevronRight
                                className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${expandedSubject === subject.name ? "rotate-90 text-slate-900" : ""
                                    }`}
                            />
                        </button>

                        {expandedSubject === subject.name && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-slate-100"
                            >
                                <div className="p-4 space-y-2 bg-slate-50/30">
                                    {subject.papers.map((paper, pIndex) => (
                                        <div
                                            key={pIndex}
                                            className="flex items-center justify-between p-4 rounded-lg bg-white border border-slate-100 hover:border-slate-200 transition-all shadow-sm"
                                        >
                                            <div className="flex items-center gap-4">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                <span className="font-semibold text-slate-700">
                                                    {paper.semester} {paper.year}
                                                </span>
                                                <span className="text-sm text-slate-400 font-medium px-2 py-0.5 rounded-full bg-slate-100">{paper.questions} Qs</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="inline-flex items-center justify-center px-3 py-1.5 rounded-md text-sm font-medium gap-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                                                    <Eye className="w-3.5 h-3.5" /> View
                                                </button>
                                                <button className="inline-flex items-center justify-center px-3 py-1.5 rounded-md text-sm font-medium gap-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                                                    <Download className="w-3.5 h-3.5" /> Download
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div> */}
            <ComingSoonPage />
        </motion.div>
    )
}
