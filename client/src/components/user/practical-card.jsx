
import React, { useState, memo, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Code,
    Copy,
    Check,
    Image as ImageIcon,
    FileText,
    Download,
    ExternalLink,
    Bookmark,
    Terminal,
    ChevronRight,
    Cpu
} from "lucide-react"

import { CodeModal } from "@/components/common/code-modal"
import Highlight from "react-highlight"
import "highlight.js/styles/atom-one-dark.css"

const QuestionBlock = memo(function QuestionBlock({ question, index }) {
    const [copied, setCopied] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(question.code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }, [question.code])

    const handleOpenModal = useCallback(() => {
        setShowModal(true)
    }, [])

    const handleCloseModal = useCallback(() => {
        setShowModal(false)
    }, [])

    return (
        <div
            className="group/q relative border-b last:border-b-0 border-slate-100/50 dark:border-white/5"
        >
            {/* Simplified Side Accent - CSS only */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500/50 scale-y-0 group-hover/q:scale-y-100 transition-transform duration-300 origin-top" />

            <div className="sm:p-6 p-4">
                <div className="flex   items-start justify-between gap-4 mb-6">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="relative shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700/50 group-hover/q:border-cyan-500/30 transition-colors">
                                {index + 1}
                            </div>
                        </div>

                        <div className="space-y-1 mt-0.5">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1 max-w-sm dark:text-white leading-tight tracking-tight">
                                {question.question}
                            </h3>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                    <Cpu className="w-3 h-3" /> Source Code
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex  items-center gap-2 self-end sm:self-start">
                        <button
                            className="h-9 px-4 flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-cyan-500/10 dark:hover:bg-cyan-500/20 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 font-bold text-xs"
                            onClick={handleOpenModal}
                        >
                            <Code className="w-3.5 h-3.5" />
                            <p className="sm:block hidden">View</p>
                        </button>
                        <button
                            className={`h-9 px-4 flex items-center gap-2 rounded-lg transition-all duration-300 font-bold text-xs border ${copied
                                ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400"
                                : "bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-600 dark:hover:text-cyan-400"
                                }`}
                            onClick={handleCopy}
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3.5 h-3.5 " />
                                    <p className="sm:block hidden">Copied</p>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <p className="sm:block hidden">Copy</p>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Cyber IDE Container */}
                <div className="relative group/code rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl shadow-black/5">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-white/5">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400/50"></div>
                            </div>

                        </div>

                    </div>

                    <div
                        className=" bg-[#0d1117] hover:overflow-y-auto sm:hover:overflow-y-auto overscroll-contain"
                        style={{ height: '300px' }}
                    >
                        <Highlight className="javascript">
                            {question.code}
                        </Highlight>
                    </div>

                    {/* Floating Glow */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/code:opacity-100 bg-linear-to-tr from-cyan-500/5 via-transparent to-transparent transition-opacity duration-700" />
                </div>

                {/* Multimedia Attachments */}
                {question.fileData && (
                    <div className="mt-6 flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-[1px] flex-1 bg-slate-100 dark:bg-white/5" />
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Exhibits & Assets</span>
                            <div className="h-[1px] flex-1 bg-slate-100 dark:bg-white/5" />
                        </div>

                        {question.fileType?.startsWith('image/') ? (
                            <div className="relative group/asset rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/50">
                                <img
                                    src={question.fileData}
                                    alt="Practical Reference"
                                    className="w-full h-auto max-h-[500px] object-contain transition-transform duration-500 group-hover/asset:scale-[1.02]"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent opacity-0 group-hover/asset:opacity-100 transition-all duration-300 flex items-end justify-center p-8">
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => window.open(question.fileData, '_blank')}
                                            className="px-5 py-2.5 bg-white text-slate-900 text-sm font-bold rounded-xl shadow-2xl flex items-center gap-2 hover:scale-105 transition-transform"
                                        >
                                            <ExternalLink className="w-4 h-4" /> Expand View
                                        </button>
                                        <a
                                            href={question.fileData}
                                            download={question.fileName || 'practical-ref'}
                                            className="px-5 py-2.5 bg-slate-800 text-white text-sm font-bold rounded-xl shadow-2xl flex items-center gap-2 hover:bg-slate-700 transition-colors"
                                        >
                                            <Download className="w-4 h-4" /> Get Asset
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-white/5 group/file hover:border-cyan-500/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover/file:text-cyan-500 transition-colors">
                                            {question.fileName || 'Attachment'}
                                        </p>
                                        <p className="text-[11px] font-medium text-slate-400">Application Resource</p>
                                    </div>
                                </div>
                                <a
                                    href={question.fileData}
                                    download={question.fileName || 'attachment'}
                                    className="h-10 px-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-xl flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
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
                onClose={handleCloseModal}
                title={question.question}
                code={question.code}
            />
        </div>
    )
})

export const PracticalCard = memo(function PracticalCard({ practical, isBookmarked, onToggleBookmark }) {
    const handleToggle = useCallback(() => {
        if (onToggleBookmark) {
            onToggleBookmark(practical._id)
        }
    }, [onToggleBookmark, practical._id])

    return (
        <div className="relative h-full">
            {/* Removed expensive background glow animation */}

            <div className="max-w-sm sm:max-w-full  relative h-full glass-card rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 shadow-2xl antialiased">
                {/* Header Section */}
                <div className="flex items-center  sm:flex-row sm:items-center justify-between sm:p-4 p-2 sm:px-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                    <div className="flex items-center gap-6">

                        {practical.section && (
                            <span className="px-3 py-1 rounded-lg  bg-cyan-500/10 dark:bg-cyan-500/20 text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest border border-cyan-500/20">
                                {practical.section}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                        {onToggleBookmark && (
                            <button
                                onClick={handleToggle}
                                className={`group/btn w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isBookmarked
                                    ? "bg-orange-500 shadow-lg shadow-orange-500/40"
                                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                                    }`}
                                title={isBookmarked ? "Release Bookmark" : "Store in Archive"}
                            >
                                <Bookmark
                                    className={`w-5 h-5 transition-all duration-300 ${isBookmarked
                                        ? "fill-white text-white scale-110"
                                        : "text-slate-400 group-hover/btn:text-slate-600 dark:group-hover/btn:text-slate-200"
                                        }`}
                                />
                            </button>
                        )}

                    </div>
                </div>

                {/* Content Section */}
                <div>
                    {practical.questions.map((question, index) => (
                        <QuestionBlock key={index} question={question} index={index} />
                    ))}
                </div>

                {/* Card Footer */}
                <div className="px-8 py-4 hidden bg-slate-50 dark:bg-white/[0.01] border-t border-slate-100 dark:border-white/5 sm:flex items-center justify-between">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600" />
                            </div>
                        ))}
                    </div>
                    {/* <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Modified: Feb 2026</span> */}
                </div>
            </div>
        </div>
    )
})
