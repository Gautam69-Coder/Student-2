
import React from "react"
import { motion } from "framer-motion"
import { FileText, Download, Eye, Calendar, User } from "lucide-react"
import { notes } from "@/data/student-data";
// UI imports removed




export function NotesSection() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">My Notes</h2>
                <div className="flex gap-2">
                    {["All", "Java", "Scilab", "DSA", "Web Dev"].map((filter) => (
                        <button
                            key={filter}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${filter === "All"
                                ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {notes.map((note, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -2, boxShadow: "0 4px 20px -5px rgba(0,0,0,0.05)" }}
                        className="bg-white rounded-xl p-6 border border-[#E5E5E5] transition-all duration-300"
                    >
                        <div className="flex items-start gap-5">
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                                <FileText className="w-6 h-6 text-slate-700" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-slate-900 truncate text-lg">{note.title}</h3>
                                <p className="text-sm text-slate-500 font-medium mt-0.5">{note.subject}</p>

                                <div className="flex items-center gap-4 mt-4 text-xs font-medium text-slate-400">
                                    <span className="flex items-center gap-1.5 ml-0">
                                        <User className="w-3.5 h-3.5" /> {note.author}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" /> {note.date}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Download className="w-3.5 h-3.5" /> {note.downloads}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors">
                                    <Eye className="w-4 h-4" />
                                </button>
                                <button className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}
