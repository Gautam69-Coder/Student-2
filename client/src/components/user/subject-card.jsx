
import React from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, BookOpen } from "lucide-react"

export function SubjectCard({ subject, index, onClick }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.08)" }}
            onClick={onClick}
            className="group bg-white rounded-xl p-6 cursor-pointer border border-[#E5E5E5] transition-all duration-300 hover:border-slate-300"
        >
            <div className="flex items-start justify-between mb-5">
                <div className="p-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 group-hover:bg-white group-hover:border-solid group-hover:border-slate-300 transition-all">
                    <BookOpen className="w-5 h-5" style={{ color: subject.color }} />
                </div>
                <div className="p-1 rounded-full hover:bg-slate-100 transition-colors">
                    <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                </div>
            </div>

            <h3 className="font-bold text-slate-900 text-lg mb-1 tracking-tight group-hover:text-black">{subject.name}</h3>
            {/* <p className="text-sm text-slate-500 font-medium mb-6"></p> */}

            <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
                    <span className="text-slate-400">Progress</span>
                    <span style={{ color: "#8b5cf6" }}>
                        75%
                    </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `75%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: "aqua" }}
                    />
                </div>
            </div>
        </motion.div>
    )
}
