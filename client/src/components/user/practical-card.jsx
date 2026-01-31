import React, { useState,useEffect } from "react"
import { motion } from "framer-motion"
import { Code, Copy, Check, Image as ImageIcon, FileText, Download, ExternalLink } from "lucide-react"

import { CodeModal } from "@/components/common/code-modal"

function QuestionBlock({ question, index }) {
    const [copied, setCopied] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(question.code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="border-b mb-2 last:border-b-0 border-gray-100">
            <div className="sm:p-6 p-4">
                <div className="flex items-start justify-between">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight sm:pr-4 pr-2 line-clamp-1">
                        <span className="text-xs sm:text-sm text-slate-400 font-mono mr-2 border border-blue-300 rounded-full px-2 py-1">Q{index + 1}.</span>
                        {question.question}
                    </h3>
                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            className="flex items-center justify-center w-8 h-8 bg-white border border-gray-200 hover:bg-gray-50 rounded-md shadow-sm transition-all text-slate-500 hover:text-slate-900"
                            onClick={() => setShowModal(true)}
                            title="View Code"
                        >
                            <Code className="w-4 h-4" />
                        </button>
                        <button
                            className="flex items-center justify-center w-8 h-8 bg-white border border-gray-200 hover:bg-gray-50 rounded-md shadow-sm transition-all text-slate-500 hover:text-slate-900"
                            onClick={handleCopy}
                            title="Copy Code"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                <div className="flex-1 border rounded-xl overflow-y-auto max-w-[80vw]  h-[30vh] bg-slate-50 mt-6">
                    <pre className="font-mono text-[13px] sm:text-sm leading-relaxed text-slate-700 p-4 ">
                        <code className="overflow-x-auto">{question.code}</code>
                    </pre>
                </div>

                {/* Reference File/Image Display */}
                {question.fileData && (
                    <div className="mt-6 border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
                        {question.fileType?.startsWith('image/') ? (
                            <div className="relative group cursor-pointer" onClick={() => window.open(question.fileData, '_blank')}>
                                <img src={question.fileData} alt="Reference" className="w-full h-auto max-h-[500px] object-contain bg-white" />
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="flex gap-3">
                                        <button className="p-2 bg-white rounded-lg text-slate-900 shadow-xl flex items-center gap-2 text-sm font-bold">
                                            <ExternalLink className="w-4 h-4" /> Full View
                                        </button>
                                        <a
                                            href={question.fileData}
                                            download={question.fileName || 'reference-image'}
                                            onClick={(e) => e.stopPropagation()}
                                            className="p-2 bg-white rounded-lg text-slate-900 shadow-xl flex items-center gap-2 text-sm font-bold"
                                        >
                                            <Download className="w-4 h-4" /> Save
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 sm:flex  items-center justify-between gap-4 border rounded-2xl ">
                                <div className="flex items-center gap-4 sm:mb-0 mb-4 ">
                                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
                                        <FileText className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div className="min-w-0 ">
                                        <p className="text-sm font-bold text-slate-900 truncate text-wrap mb-1">{question.fileName || 'Reference File'}</p>
                                        <p className="text-xs text-slate-400 capitalize font-medium">{'file'}</p>
                                    </div>
                                </div>
                                <a
                                    href={question.fileData}
                                    download={question.fileName || 'reference-file'}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-all shadow-sm"
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
            className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] h-fit"
        >


            <div>
                {practical.questions.map((question, index) => (
                    <QuestionBlock key={index} question={question} index={index} />
                ))}
            </div>
        </motion.div>
    )
}
