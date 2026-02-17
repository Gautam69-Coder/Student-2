
import React, { useState } from "react"
import { motion } from "framer-motion"
import { Upload } from "lucide-react"
import { useTitle } from "@/hooks/useTitle"

export function ManagePYQs() {
    useTitle("Manage PYQs");
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
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Upload PYQs</h2>
                <p className="text-slate-500 dark:text-slate-400">Add previous year question papers for students</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-[#E5E5E5] dark:border-slate-800 shadow-sm max-w-2xl">
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="pyq-subject" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Subject
                            </label>
                            <select className="mt-2 w-full h-11 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 rounded-lg appearance-none cursor-pointer text-slate-900 dark:text-white">
                                <option value="">Select</option>
                                <option value="java">Java Programming</option>
                                <option value="scilab">Scilab</option>
                                <option value="dsa">Data Structures</option>
                                <option value="webdev">Web Development</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="pyq-year" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Year
                            </label>
                            <select className="mt-2 w-full h-11 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 rounded-lg appearance-none cursor-pointer text-slate-900 dark:text-white">
                                <option value="">Select</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="pyq-semester" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Semester
                        </label>
                        <select className="mt-2 w-full h-11 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 rounded-lg appearance-none cursor-pointer text-slate-900 dark:text-white">
                            <option value="">Select semester</option>
                            <option value="spring">Spring</option>
                            <option value="fall">Fall</option>
                            <option value="summer">Summer</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Upload File</label>
                        <div className="mt-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer">
                            <Upload className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                <span className="text-slate-900 dark:text-white underline decoration-slate-300 dark:decoration-slate-600 underline-offset-4">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">PDF files only, up to 20MB</p>
                        </div>
                    </div>

                    <button className="w-full bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-medium rounded-lg h-12 flex items-center justify-center gap-2 transition-all active:scale-[0.99]">
                        <Upload className="w-4 h-4" /> Upload PYQ
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}
