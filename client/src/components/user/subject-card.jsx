import React from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, BookOpen } from "lucide-react"
import { useEffect } from "react"
import { useState } from "react"

export function SubjectCard({ subject, index, onClick, subjectPracticals }) {


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            whileHover={{ y: -6, scale: 1.02 }}
            onClick={onClick}
            className="group glass-card rounded-2xl interactive-card cursor-pointer sm:p-5 p-3 relative overflow-hidden"
        >
            {/* Neon Glow Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-cyan-500/5 group-hover:via-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none" />

            <div className="relative z-10">
                <div className="flex  items-start sm:justify-between justify-center mb-4">
                    <div className="p-3 rounded-xl glass-card group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all duration-300">
                        <BookOpen className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-cyan-500 transition-colors" style={subject.color ? { color: subject.color } : {}} />
                    </div>
                    <div className="p-1.5 rounded-full hover:bg-cyan-500/10 transition-colors sm:block hidden">
                        <ArrowUpRight className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-cyan-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-left mb-3 text-center tracking-tight group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                    {subject.name}
                </h3>

                <div className="space-y-2">
                    <div className="flex items-center justify-between glass-card rounded-full p-2 sm:px-4 text-xs sm:text-sm font-bold group-hover:border-cyan-500/20 transition-all">
                        <span className="text-slate-500 dark:text-slate-400 sm:text-sm text-xs">Practicals</span>
                        <span className="text-slate-900 dark:text-white bg-cyan-500/10 px-2.5 py-0.5 rounded-full text-cyan-600 dark:text-cyan-400">
                            {subjectPracticals.map(i => i.section).filter(same => same === subject.name).length}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
