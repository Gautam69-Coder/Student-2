
import React from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, BookOpen } from "lucide-react"
import { useEffect } from "react"

export function SubjectCard({ subject, index, onClick, subjectPracticals }) {

    useEffect(() => {
    }, [subjectPracticals]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
            onClick={onClick}
            className="group bg-white dark:bg-slate-900 rounded-xl sm:p-6 p-2 cursor-pointer border border-[#E5E5E5] dark:border-slate-800 transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-600"
        >
            <div className="flex items-start sm:justify-between justify-center mb-5">
                <div className="p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 group-hover:bg-white dark:group-hover:bg-slate-900 group-hover:border-solid transition-all">
                    <BookOpen className="w-5 h-5 text-slate-700 dark:text-slate-300" style={subject.color ? { color: subject.color } : {}} />
                </div>
                <div className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors sm:block hidden">
                    <ArrowUpRight className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                </div>
            </div>

            <h3 className="font-bold text-slate-900 dark:text-white text-lg sm:text-left sm:mb-3 mb-2 text-center tracking-tight group-hover:text-black dark:group-hover:text-white">{subject.name}</h3>
            {/* <p className="text-sm text-slate-500 font-medium mb-6"></p> */}

            <div className="space-y-2.5">
                <div className="flex items-center justify-between border dark:border-slate-800 rounded-full p-2 sm:p-2 sm:px-4 text-xs sm:text-[13px] font-semibold tracking-wider bg-slate-50/50 dark:bg-slate-950/50">
                    <span className="text-slate-400 dark:text-slate-500 sm:text-[13px] text-[10px]">Practicals : </span>
                    <span className="text-slate-900 dark:text-white">
                        {subjectPracticals[subject.name]?.length || 0}
                    </span>
                </div>
                {/* <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `75%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: "aqua" }}
                    />
                </div> */}
            </div>
        </motion.div>
    )
}
