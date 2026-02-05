import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check } from "lucide-react";
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { androidstudio } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export function CodeModal({ isOpen, onClose, title, code }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        console.log(title)
    }, [])


    if (typeof document === 'undefined') return null;

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10 border dark:border-slate-800"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
                            <div className="w-full">
                                <div className="flex justify-between items-center mb-4 ">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Code Preview</h3>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleCopy}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold transition-all"
                                        >
                                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                            {copied ? "Copied!" : "Copy"}
                                        </button>
                                        <button
                                            onClick={onClose}
                                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">{title}</p>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 sm:p-8">
                            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                                <pre className="font-mono text-sm leading-relaxed bg-[#0d1117]! sm:block hidden p-4 overflow-x-auto">
                                    <SyntaxHighlighter
                                        language="javascript"
                                        style={atomOneDark}
                                        showLineNumbers={true}
                                        customStyle={{ margin: 0, padding: 0, background: 'transparent' }}
                                    >
                                        {code}
                                    </SyntaxHighlighter>
                                </pre>
                                <pre className="font-mono text-sm leading-relaxed bg-[#0d1117]! sm:hidden block p-4 overflow-x-auto">
                                    <SyntaxHighlighter
                                        language="javascript"
                                        style={atomOneDark}
                                        showLineNumbers={false}
                                        customStyle={{ margin: 0, padding: 0, background: 'transparent' }}
                                    >
                                        {code}
                                    </SyntaxHighlighter>
                                </pre>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
