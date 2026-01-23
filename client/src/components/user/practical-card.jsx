import React, { useState } from "react"
import { motion } from "framer-motion"
import { Code, Copy, Check } from "lucide-react"

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
        <div className="border-b last:border-b-0 border-gray-100">
            <div className="p-6">
                <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-slate-900 tracking-tight pr-4 line-clamp-1">
                        <span className="text-slate-400 font-mono mr-2">Q{index + 1}.</span>
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
                    <div className="flex-1 overflow-y-auto h-[30vh] bg-slate-50 pt-3">
                        <pre className="font-mono text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                            <code>{question.code}</code>
                        </pre>
                    </div>
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
