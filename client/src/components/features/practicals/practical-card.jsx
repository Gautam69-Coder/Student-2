import React, { useState, memo, useCallback } from "react";
import CodeTabs from "@/components/features/practicals/practical-code-tab";
import { AICodeHelper } from "../coding/ai-code-helper";
import {
    Code,
    Copy,
    Check,
    FileText,
    Download,
    ExternalLink,
    Cpu,
    Sparkles,
    Eye,
} from "lucide-react";
import { FilePreviewModal } from "../../common/file-preview-modal";
import { CodeModal } from "@/components/features/coding/code-modal";
import { useClipboard } from "@/Utils/clipboard";
import { downloadFile } from "@/Utils/download";

const QuestionBlock = memo(function QuestionBlock({ question, index, section }) {
    const { copied, copy } = useClipboard(2000);
    const [showModal, setShowModal] = useState(false);
    const [showModalCodeHelper, setShowModalCodeHelper] = useState(false);
    const [showPdfModal, setShowPdfModal] = useState(false);

    const isPdf =
        question.fileType === "application/pdf" ||
        question.fileType?.includes("pdf") ||
        /\.pdf$/i.test(question.fileName || "") ||
        (question.fileUrl || question.fileData)?.toLowerCase().includes(".pdf");

    const handleCopy = useCallback(() => {
        const codeToCopy = Array.isArray(question.code)
            ? question.code.map((item) => `// --- ${item.languageName} ---\n${item.code}`).join("\n\n")
            : question.code || "";
        copy(codeToCopy);
    }, [question.code, copy]);

    const handleOpenModal = useCallback(() => setShowModal(true), []);
    const handleOpenCodeHelper = useCallback(() => setShowModalCodeHelper(true), []);
    const handleCloseCodeHelper = useCallback(() => setShowModalCodeHelper(false), []);
    const handleCloseModal = useCallback(() => setShowModal(false), []);

    return (
        <div className="group/q relative border-b last:border-b-0 border-border">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover/q:scale-y-100 transition-transform duration-200 origin-top" />

            <div className="p-4 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center border border-border font-mono font-bold text-xs text-foreground shrink-0">
                            {index + 1}
                        </div>

                        <div className="space-y-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-bold text-foreground line-clamp-2 leading-snug">
                                {question.question}
                            </h3>
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                <Cpu className="w-3 h-3 text-primary" aria-hidden="true" />
                                <span>Source Code</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={handleOpenCodeHelper}
                            className="hidden sm:inline-flex min-h-[38px] px-3.5 items-center gap-1.5 rounded-xl text-xs font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition-all active:scale-[0.98]"
                        >
                            <Sparkles size={13} aria-hidden="true" />
                            <span>AI Assistant</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleOpenModal}
                            className="min-h-[38px] px-3.5 inline-flex items-center gap-1.5 rounded-xl bg-background hover:bg-secondary text-foreground border border-border transition-colors font-bold text-xs"
                        >
                            <Code className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                            <span className="hidden sm:inline">View</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleCopy}
                            className={`min-h-[38px] px-3.5 inline-flex items-center gap-1.5 rounded-xl transition-colors font-bold text-xs border ${
                                copied
                                    ? "bg-emerald-500/12 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                                    : "bg-background hover:bg-secondary border-border text-foreground"
                            }`}
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span className="hidden sm:inline">Copied</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span className="hidden sm:inline">Copy</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Code Window */}
                <div className="relative rounded-2xl overflow-hidden border border-border shadow-xs">
                    <div className="flex items-center justify-between px-4 py-2 bg-secondary/50 border-b border-border">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                        </div>

                        <button
                            type="button"
                            onClick={handleOpenCodeHelper}
                            className="sm:hidden inline-flex h-8 px-3 items-center gap-1.5 rounded-lg text-[11px] font-bold text-primary-foreground bg-primary"
                        >
                            <Sparkles size={11} aria-hidden="true" />
                            <span>AI Helper</span>
                        </button>
                    </div>

                    <CodeTabs
                        tabs={
                            Array.isArray(question.code)
                                ? question.code.map((item) => ({
                                      label: item.languageName || "Default",
                                      code: item.code || "",
                                  }))
                                : [{ label: "Default", code: question.code || "" }]
                        }
                    />
                </div>

                {/* Attachments */}
                {(question.fileUrl || question.fileData) && (
                    <div className="mt-6 flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-px flex-1 bg-border" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                Exhibits & Assets
                            </span>
                            <div className="h-px flex-1 bg-border" />
                        </div>

                        {question.fileType?.startsWith("image/") ||
                        (question.fileUrl || question.fileData)?.startsWith("data:image/") ? (
                            <div className="relative group/asset rounded-2xl overflow-hidden border border-border bg-background">
                                <img
                                    src={question.fileUrl || question.fileData}
                                    alt="Practical Reference"
                                    className="w-full h-auto max-h-[460px] object-contain"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent opacity-0 group-hover/asset:opacity-100 transition-opacity flex items-end justify-center p-6">
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const url = question.fileUrl || question.fileData;
                                                if (url.startsWith("data:")) {
                                                    downloadFile(url, question.fileName || "image");
                                                } else {
                                                    window.open(url, "_blank");
                                                }
                                            }}
                                            className="px-4 min-h-[40px] bg-white text-slate-900 text-xs font-bold rounded-xl shadow-lg flex items-center gap-2"
                                        >
                                            <ExternalLink className="w-4 h-4" aria-hidden="true" />
                                            Expand View
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                downloadFile(
                                                    question.fileUrl || question.fileData,
                                                    question.fileName || "asset"
                                                )
                                            }
                                            className="px-4 min-h-[40px] bg-primary text-primary-foreground text-xs font-bold rounded-xl shadow-lg flex items-center gap-2"
                                        >
                                            <Download className="w-4 h-4" aria-hidden="true" />
                                            Get Asset
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-dashed border-indigo-500/40 bg-indigo-500/5">
                                <div className="flex items-center gap-3.5 min-w-0">
                                    <div className="w-11 h-11 rounded-xl border border-indigo-500/30 bg-card flex items-center justify-center text-primary shrink-0">
                                        <FileText className="w-5 h-5" aria-hidden="true" />
                                    </div>
                                    <div className="min-w-0 text-left">
                                        <p className="text-sm font-bold text-foreground truncate">
                                            {question.fileName || "Attachment"}
                                        </p>
                                        <p className="text-[11px] font-medium text-muted-foreground">
                                            {isPdf ? "PDF Document" : "Application Resource"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                    {isPdf && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPdfModal(true)}
                                            className="min-h-[40px] px-4 bg-card hover:bg-secondary text-foreground border border-border text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Eye className="w-4 h-4" aria-hidden="true" />
                                            View PDF
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            downloadFile(
                                                question.fileUrl || question.fileData,
                                                question.fileName || "Attachment"
                                            )
                                        }
                                        className="min-h-[40px] px-4 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Download className="w-4 h-4" aria-hidden="true" />
                                        Download File
                                    </button>
                                </div>
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

            <FilePreviewModal
                isOpen={showPdfModal}
                onClose={() => setShowPdfModal(false)}
                fileUrl={question.fileUrl || question.fileData}
                fileType={question.fileType || "application/pdf"}
                fileName={question.fileName}
                title={question.question}
                subtitle={`${section} • Attachment`}
            />
        </div>
    );
});

export const PracticalCard = memo(function PracticalCard({ practical }) {
    return (
        <div className="surface-card rounded-3xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-secondary/40">
                {practical.section && (
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider border border-indigo-500/20">
                        {practical.section}
                    </span>
                )}
            </div>

            <div>
                {practical.questions.map((question, index) => (
                    <QuestionBlock
                        key={index}
                        question={question}
                        index={index}
                        section={practical.section}
                    />
                ))}
            </div>
        </div>
    );
});
