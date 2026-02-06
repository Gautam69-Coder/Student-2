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
        <div className="border-b mb-2 last:border-b-0 border-slate-100/50 dark:border-white/[0.06]">
            <div className="sm:p-5 p-3  ">
                {/* Compact Header with Better Data Density */}
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                        <span className="inline-flex items-center justify-center text-xs font-bold text-cyan-400 dark:text-cyan-400 font-mono shrink-0 w-7 h-7 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/10 border border-cyan-500/20 dark:border-cyan-500/20">
                            {index + 1}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold line-clamp-1 text-slate-900 dark:text-white tracking-tight leading-snug">
                            {question.question}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            className="group flex items-center justify-center w-9 h-9 glass-card hover:bg-cyan-500/10 dark:hover:bg-cyan-500/10 border-slate-200 dark:border-white/[0.08] hover:border-cyan-500/30 rounded-lg transition-all duration-300"
                            onClick={() => setShowModal(true)}
                            title="View Code"
                        >
                            <Code className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-cyan-500 transition-colors" />
                        </button>
                        <button
                            className="group flex items-center justify-center w-9 h-9 glass-card hover:bg-cyan-500/10 dark:hover:bg-cyan-500/10 border-slate-200 dark:border-white/[0.08] hover:border-cyan-500/30 rounded-lg transition-all duration-300"
                            onClick={handleCopy}
                            title="Copy Code"
                        >
                            {copied ?
                                <Check className="w-4 h-4 text-green-500 dark:text-green-400" /> :
                                <Copy className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-cyan-500 transition-colors" />
                            }
                        </button>
                    </div>
                </div>

                {/* High-End IDE Code Viewer */}
                <div className="code-viewer mt-4">
                    <div className="code-viewer-header">
                        <div className="code-viewer-dot bg-red-500"></div>
                        <div className="code-viewer-dot bg-yellow-500"></div>
                        <div className="code-viewer-dot bg-green-500"></div>
                    </div>
                    <Highlight className="javascript">
                        {question.code}
                    </Highlight>
                </div>

                {/* Reference File/Image Display */}
                {question.fileData && (
                    <div className="mt-4 glass-card rounded-xl overflow-hidden">
                        {question.fileType?.startsWith('image/') ? (
                            <div className="relative group cursor-pointer" onClick={() => window.open(question.fileData, '_blank')}>
                                <img src={question.fileData} alt="Reference" className="w-full h-auto max-h-[400px] object-contain bg-slate-50 dark:bg-slate-950" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                                    <div className="flex gap-2">
                                        <button className="px-4 py-2 glass-card hover:bg-cyan-500/20 border-cyan-500/30 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2 neon-glow">
                                            <ExternalLink className="w-4 h-4" /> Open Full View
                                        </button>
                                        <a
                                            href={question.fileData}
                                            download={question.fileName || 'reference-image'}
                                            onClick={(e) => e.stopPropagation()}
                                            className="relative z-10 px-4 py-2 glass-card hover:bg-cyan-500/20 border-cyan-500/30 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2"
                                        >
                                            <Download className="w-4 h-4" /> Download
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-11 h-11 glass-card rounded-lg flex items-center justify-center shrink-0">
                                        <FileText className="w-5 h-5 text-cyan-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{question.fileName || 'Reference File'}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Attachment</p>
                                    </div>
                                </div>
                                <a
                                    href={question.fileData}
                                    download={question.fileName || 'reference-file'}
                                    onClick={(e) => e.stopPropagation()}
                                    className="relative z-50 cursor-pointer pointer-events-auto px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 shrink-0"
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
            whileHover={{ y: -2, scale: 1.005 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="glass-card interactive-card rounded-xl overflow-hidden mb-6"
        >
            <div>
                {practical.questions.map((question, index) => (
                    <QuestionBlock key={index} question={question} index={index} />
                ))}
            </div>
        </motion.div>
    )
}
