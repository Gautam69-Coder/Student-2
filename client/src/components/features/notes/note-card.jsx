import { memo, useState } from "react";
import {
    FileText,
    Download,
    Eye,
    Calendar,
    Trash2,
    Copy,
    Check,
    Code,
    File,
    Image as ImageIcon,
    Edit,
    Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/Utils/date";
import { ImproveNoteModal } from "./improve-note";

export const NoteCard = memo(
    ({
        note,
        user,
        copying,
        onDelete,
        onUpdate,
        onCopy,
        onDownload,
        onPublic,
        onSelect,
        onAiReview,
    }) => {
        const [showImproveModal, setShowImproveModal] = useState(false);
        const isOwner = user?._id === note.user;
        const hasFile = note.fileType !== "NAN";
        const isImage = note.fileType?.startsWith("image/");
        const isPdf = note.fileType === "application/pdf";
        const hasContent = note.content && note.content !== "NAN";
        const isPreviewable = isPdf || isImage || (hasFile && hasContent);

        return (
            <Card className="surface-card rounded-2xl py-0 overflow-hidden h-full">
                <CardContent className="p-5 flex flex-col h-full">
                    {/* Top Row */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <div
                                className={`p-2.5 rounded-xl shrink-0 border ${
                                    hasFile
                                        ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400"
                                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                }`}
                            >
                                {hasFile ? (
                                    isImage ? (
                                        <ImageIcon className="w-5 h-5" aria-hidden="true" />
                                    ) : (
                                        <File className="w-5 h-5" aria-hidden="true" />
                                    )
                                ) : (
                                    <Code className="w-5 h-5" aria-hidden="true" />
                                )}
                            </div>
                            <h3 className="font-bold text-base truncate text-foreground">
                                {note.title}
                            </h3>
                        </div>

                        {isOwner && (
                            <div className="flex gap-1.5 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => onUpdate(note._id)}
                                    className="p-2 rounded-xl bg-secondary hover:bg-indigo-500/15 text-muted-foreground hover:text-primary transition-colors"
                                    aria-label="Edit note"
                                    title="Edit note"
                                >
                                    <Edit className="w-4 h-4" aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(note._id);
                                    }}
                                    className="p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                                    aria-label="Delete note"
                                    title="Delete note"
                                >
                                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Metadata + Badges */}
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-4 text-[11px] font-semibold">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1.5 text-muted-foreground tabular-nums">
                                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                                {formatDate(note.createdAt)}
                            </span>
                            {hasFile && hasContent && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 uppercase">
                                    Note
                                </span>
                            )}
                        </div>

                        <div className="flex gap-1.5 items-center">
                            {((hasFile && hasContent) || !hasFile) && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onAiReview) onAiReview(note);
                                        else setShowImproveModal(true);
                                    }}
                                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition-all active:scale-95"
                                >
                                    <Sparkles className="w-3 h-3" aria-hidden="true" />
                                    AI Review
                                </button>
                            )}

                            {(user?.role === "admin" || user?.role === "superadmin") && (
                                <button
                                    type="button"
                                    className={`rounded-full border px-2.5 py-1 text-[10px] font-bold transition-colors ${
                                        note.isGlobal
                                            ? "bg-emerald-600 text-white border-emerald-600"
                                            : "bg-card text-foreground border-border hover:bg-secondary"
                                    }`}
                                    onClick={() => onPublic(note._id)}
                                >
                                    {note.isGlobal ? "Public" : "Private"}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Preview Body */}
                    <div className="flex-1 mb-4">
                        {hasFile ? (
                            isImage ? (
                                <img
                                    src={note.fileData}
                                    alt={note.title}
                                    onClick={() => onSelect(note)}
                                    className="w-full h-40 object-cover rounded-2xl border border-border cursor-pointer hover:opacity-90 transition-opacity"
                                    loading="lazy"
                                />
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => onSelect(note)}
                                    className="w-full p-4 rounded-2xl border border-border bg-background hover:bg-secondary/60 flex items-center gap-3 text-left transition-colors"
                                >
                                    <FileText className="w-8 h-8 text-primary shrink-0" aria-hidden="true" />
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold truncate text-foreground">
                                            {note.fileName}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">
                                            {isPdf ? "PDF Document" : "Attachment"}
                                        </p>
                                    </div>
                                </button>
                            )
                        ) : (
                            <div className="relative group/code">
                                <button
                                    type="button"
                                    onClick={() => onCopy(note._id, note.content)}
                                    aria-label="Copy snippet"
                                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground shadow-xs opacity-0 group-hover/code:opacity-100 z-10 transition-opacity"
                                >
                                    {copying === note._id ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                                    ) : (
                                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                                    )}
                                </button>

                                <div
                                    onClick={() => onSelect(note)}
                                    className="p-4 rounded-2xl border border-border bg-background max-h-40 overflow-hidden relative cursor-pointer hover:border-primary/40 transition-colors"
                                    title="Click to view note"
                                >
                                    <pre className="font-mono text-xs whitespace-pre-wrap text-muted-foreground">
                                        {note.content}
                                    </pre>
                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background to-transparent" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex gap-2 mt-auto">
                        {hasFile ? (
                            <>
                                {isPreviewable && (
                                    <>
                                        <button
                                            type="button"
                                            className="flex-1 hidden sm:flex justify-center items-center gap-2 min-h-[40px] border border-border bg-background hover:bg-secondary text-foreground rounded-xl text-xs font-bold transition-colors"
                                            onClick={() => onSelect(note)}
                                        >
                                            <Eye className="w-4 h-4" aria-hidden="true" />
                                            Open
                                        </button>

                                        <button
                                            type="button"
                                            className="flex-1 sm:hidden flex justify-center items-center gap-2 min-h-[40px] border border-border bg-background hover:bg-secondary text-foreground rounded-xl text-xs font-bold transition-colors"
                                            onClick={() => {
                                                if (isPdf || isImage) {
                                                    window.open(note.fileData, "_blank");
                                                } else {
                                                    onSelect(note);
                                                }
                                            }}
                                        >
                                            <Eye className="w-4 h-4" aria-hidden="true" />
                                            View File
                                        </button>
                                    </>
                                )}

                                <button
                                    type="button"
                                    onClick={() => onDownload(note)}
                                    className="flex-1 flex justify-center items-center gap-2 min-h-[40px] rounded-xl text-xs font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition-all active:scale-[0.98]"
                                >
                                    <Download className="w-4 h-4" aria-hidden="true" />
                                    Download
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => onSelect(note)}
                                className="w-full flex justify-center items-center gap-2 min-h-[40px] rounded-xl text-xs font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition-all active:scale-[0.98]"
                            >
                                <Eye className="w-4 h-4" aria-hidden="true" />
                                View Note
                            </button>
                        )}
                    </div>
                </CardContent>

                {showImproveModal && (
                    <ImproveNoteModal
                        isOpen={showImproveModal}
                        onClose={() => setShowImproveModal(false)}
                        note={note}
                    />
                )}
            </Card>
        );
    }
);
