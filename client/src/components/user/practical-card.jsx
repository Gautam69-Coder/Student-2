import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Code, Copy, Check, Image as ImageIcon, FileText, Download, ExternalLink } from "lucide-react"

import { CodeModal } from "@/components/common/code-modal"

import Highlight from "react-highlight"
import "highlight.js/styles/atom-one-dark.css"

function QuestionBlock({ question, index }) {
    const [copied, setCopied] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(question.code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="border-b mb-2 last:border-b-0 border-gray-100 dark:border-slate-800">
            <div className="sm:p-6 p-4">
                <div className="flex items-start justify-between">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white tracking-tight sm:pr-4 pr-2 line-clamp-1">
                        <span className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 font-mono mr-2 border border-blue-300 dark:border-slate-700 rounded-full px-2 py-1">Q{index + 1}.</span>
                        {question.question}
                    </h3>
                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            className="flex items-center justify-center w-8 h-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-md shadow-sm transition-all text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            onClick={() => setShowModal(true)}
                            title="View Code"
                        >
                            <Code className="w-4 h-4" />
                        </button>
                        <button
                            className="flex items-center justify-center w-8 h-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-md shadow-sm transition-all text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            onClick={handleCopy}
                            title="Copy Code"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                <div className="flex-1 border dark:border-slate-800 rounded-xl overflow-hidden max-w-[80vw] font-bold bg-slate-100 dark:bg-[#0d1117] mt-6">
                    <div className="h-[30vh]  overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent">
                        <Highlight className="javascript">
                            {question.code}
                        </Highlight>
                    </div>
                </div>

                {/* Reference File/Image Display */}
                {question.fileData && (
                    <div className="mt-6 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
                        {question.fileType?.startsWith('image/') ? (
                            <div className="relative group cursor-pointer" onClick={() => window.open(question.fileData, '_blank')}>
                                <img src={question.fileData} alt="Reference" className="w-full h-auto max-h-[500px] object-contain bg-white dark:bg-slate-900" />
                                <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="flex gap-3">
                                        <button className="p-2 bg-white dark:bg-slate-800 rounded-lg text-slate-900 dark:text-orange-500 shadow-xl flex items-center gap-2 text-sm font-bold border border-transparent dark:border-slate-700">
                                            <ExternalLink className="w-4 h-4" /> Full View
                                        </button>
                                        <a
                                            href={question.fileData}
                                            download={question.fileName || 'reference-image'}
                                            onClick={(e) => e.stopPropagation()}
                                            className="p-2 bg-white dark:bg-slate-800 rounded-lg text-slate-900 dark:text-orange-500 shadow-xl flex items-center gap-2 text-sm font-bold border border-transparent dark:border-slate-700"
                                        >
                                            <Download className="w-4 h-4" /> Save
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 sm:flex items-center justify-between gap-4 border dark:border-slate-800 rounded-2xl">
                                <div className="flex items-center gap-4 sm:mb-0 mb-4 ">
                                    <div className="w-12 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center shadow-sm">
                                        <FileText className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <div className="min-w-0 ">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate text-wrap mb-1">{question.fileName || 'Reference File'}</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 capitalize font-medium">{'file'}</p>
                                    </div>
                                </div>
                                <a
                                    href={question.fileData}
                                    download={question.fileName || 'reference-file'}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white text-sm font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition-all shadow-sm"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <CodeModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={question.question}
                code={question.code}
            />
        </div>
    )
}

export function PracticalCard({ practical }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-slate-900 rounded-xl border border-[#E5E5E5] dark:border-slate-800 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] h-fit mb-6"
        >


            <div>
                {practical.questions.map((question, index) => (
                    <QuestionBlock key={index} question={question} index={index} />
                ))}
            </div>
        </motion.div>
    )
}
