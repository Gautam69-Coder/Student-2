import React, { useState, memo, useCallback } from "react"
// import { motion, AnimatePresence } from "framer-motion"
import CodeTabs from "@/components/features/practicals/practical-code-tab"
import { AICodeHelper } from "../coding/ai-code-helper"
import {
    Code,
    Copy,
    Check,
    Image as ImageIcon,
    FileText,
    Download,
    ExternalLink,
    Cpu,
    Sparkles
} from "lucide-react"

import { CodeModal } from "@/components/features/coding/code-modal"
import HighlightComponent from "react-highlight"
const Highlight = HighlightComponent.default || HighlightComponent
import "highlight.js/styles/atom-one-dark.css"
import { useClipboard } from "@/Utils/clipboard";

const QuestionBlock = memo(function QuestionBlock({ question, index, section }) {
    const { copied, copy } = useClipboard(2000)
    const [showModal, setShowModal] = useState(false)
    const [showModalCodeHelper, setShowModalCodeHelper] = useState(false)
    const handleCopy = useCallback(() => {
        const codeToCopy = Array.isArray(question.code)
            ? question.code.map(item => `// --- ${item.languageName} ---\n${item.code}`).join('\n\n')
            : question.code || "";
        copy(codeToCopy)
    }, [question.code, copy])

    const handleOpenModal = useCallback(() => {
        setShowModal(true)
    }, [])

    const handleOpenCodeHelper = useCallback(() => {
        setShowModalCodeHelper(true)
    }, [])

    const handleCloseCodeHelper = useCallback(() => {
        setShowModalCodeHelper(false)
    }, [])

    const handleCloseModal = useCallback(() => {
        setShowModal(false)
    }, [])

    return (
        <div
            className="group/q relative border-b last:border-b-0 border-slate-100/50 dark:border-white/5"
        >
            {/* Side Accent Line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 scale-y-0 group-hover/q:scale-y-100 transition-transform duration-300 origin-top" />

            <div className="sm:p-6 p-4">
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="relative shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700/50 group-hover/q:border-indigo-500/30 transition-colors font-bold text-slate-700 dark:text-slate-300">
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

                    <div className="flex items-center gap-2 self-end sm:self-start">
                        {/* Premium AI Assistant Button */}
                        <button
                            onClick={handleOpenCodeHelper}
                            className="hidden sm:flex h-9 px-4 items-center gap-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all active:scale-[0.98] cursor-pointer"
                        >
                            <Sparkles size={13} className="fill-current text-indigo-200 animate-pulse" />
                            <span>AI Assistant</span>
                        </button>

                        {/* View Button */}
                        <button
                            className="h-9 px-4 flex items-center gap-2 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 transition-all duration-300 font-bold text-xs cursor-pointer"
                            onClick={handleOpenModal}
                        >
                            <Code className="w-3.5 h-3.5" />
                            <p className="sm:block hidden">View</p>
                        </button>

                        {/* Copy Button */}
                        <button
                            className={`h-9 px-4 flex items-center gap-2 rounded-lg transition-all duration-300 font-bold text-xs border cursor-pointer ${copied
                                ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                                : "bg-slate-50 hover:bg-indigo-50 border-slate-200 hover:border-indigo-200 text-slate-600 hover:text-indigo-600"
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
                        <div className="flex items-center justify-between gap-2 w-full">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400/50"></div>
                            </div>

                            {/* Mobile AI Assistant Button */}
                            <button
                                onClick={handleOpenCodeHelper}
                                className="sm:hidden flex h-8 px-3 items-center gap-1.5 rounded-lg text-[10px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all active:scale-[0.98] cursor-pointer"
                            >
                                <Sparkles size={11} className="fill-current text-indigo-200 animate-pulse" />
                                <span>AI Assistant</span>
                            </button>
                        </div>
                    </div>

                    <CodeTabs
                        tabs={
                            Array.isArray(question.code)
                                ? question.code.map((item) => ({
                                    label: item.languageName || "Default",
                                    code: item.code || ""
                                }))
                                : [{ label: "Default", code: question.code || "" }]
                        }
                    />

                    {/* Floating Glow */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/code:opacity-100 bg-linear-to-tr from-indigo-500/5 via-transparent to-transparent transition-opacity duration-700" />
                </div>

                {/* Multimedia Attachments */}
                {question.fileUrl && (
                    <div className="mt-6 flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-[1px] flex-1 bg-slate-100 dark:bg-white/5" />
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Exhibits & Assets</span>
                            <div className="h-[1px] flex-1 bg-slate-100 dark:bg-white/5" />
                        </div>

                        {question.fileType?.startsWith('image/') ? (
                            <div className="relative group/asset rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/50">
                                <img
                                    src={question.fileUrl}
                                    alt="Practical Reference"
                                    className="w-full h-auto max-h-[500px] object-contain transition-transform duration-500 group-hover/asset:scale-[1.02]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-0 group-hover/asset:opacity-100 transition-all duration-300 flex items-end justify-center p-8">
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => window.open(question.fileUrl, '_blank')}
                                            className="px-5 py-2.5 bg-white text-slate-900 text-sm font-bold rounded-xl shadow-2xl flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
                                        >
                                            <ExternalLink className="w-4 h-4" /> Expand View
                                        </button>
                                        {/* <button
                                            onClick={() => requireAuth(() => {
                                                const link = document.createElement('a')
                                                link.href = question.fileUrl
                                                link.download = question.fileName || 'asset'
                                                link.click()
                                            })}
                                            className="px-5 py-2.5 bg-slate-800 text-white text-sm font-bold rounded-xl shadow-2xl flex items-center gap-2 hover:bg-slate-700 transition-colors cursor-pointer"
                                        >
                                            <Download className="w-4 h-4" /> Get Asset
                                        </button> */}
                                        <a className="" href={question.fileUrl} download target="_blank" rel="noopener noreferrer"
                                            onClick={(e) => {
                                                // e.preventDefault();
                                                console.log("Downloading asset");
                                            }}
                                        >

                                            <button className="px-5 py-2.5 bg-slate-800 text-white text-sm font-bold rounded-xl shadow-2xl flex items-center gap-2 hover:bg-slate-700 transition-colors cursor-pointer">
                                                <Download className="w-4 h-4" /> Get Asset
                                            </button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-wrap text-center items-center justify-between p-4 rounded-2xl border border-dashed border-indigo-400  hover:border-indigo-400 transition-colors group/file">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl  border border-indigo-400 flex items-center justify-center text-indigo-600">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-0.5 text-left">
                                        <p className="text-sm font-bold text-slate-850 group-hover/file:text-indigo-650 transition-colors">
                                            {question.fileName || 'Attachment'}
                                        </p>
                                        <p className="text-[11px] font-medium text-slate-400">Application Resource</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => window.open(question.fileUrl, '_blank')}
                                    className="h-10 px-5 w-full text-center mt-4 sm:mt-0 sm:w-fit bg-indigo-600  hover:bg-indigo-700 text-white text-sm font-bold rounded-xl flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-xs shadow-indigo-100"
                                >
                                    <div className="flex items-center justify-center w-full">
                                        <Download className="w-4 h-4 mr-1.5" />
                                        View File
                                    </div>
                                </button>
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
                section={question.section}
            />

            <AICodeHelper
                isOpen={showModalCodeHelper}
                onClose={handleCloseCodeHelper}
                title={question.question}
                code={question.code}
                section={section}
            />
        </div>
    )
})

export const PracticalCard = memo(function PracticalCard({ practical }) {
    return (
        <div className="relative h-full">
            <div className="max-w-sm sm:max-w-full relative h-full rounded-[10px] overflow-hidden border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 shadow-2xl antialiased">
                {/* Header Section */}
                <div className="flex items-center sm:flex-row sm:items-center justify-between sm:p-4 p-2 sm:px-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                    {practical.section && (
                        <span className="px-3 py-1 rounded-lg bg-indigo-50 text-[10px] font-black text-indigo-600 uppercase tracking-widest border border-indigo-100">
                            {practical.section}
                        </span>
                    )}
                </div>

                {/* Content Section */}
                <div>
                    {practical.questions.map((question, index) => (
                        <QuestionBlock key={index} question={question} index={index} section={practical.section} />
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
                </div>
            </div>
        </div>
    )
})
