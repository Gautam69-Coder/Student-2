import React, { memo } from "react";
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
    Edit
} from "lucide-react";
import { Card, CardContent } from "/components/ui/card";
import { theme } from "@/lib/theme";
import { formatDate } from "@/Utils/date";

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
        onShowCode,
    }) => {
        const isOwner = user?._id === note.user;
        const hasFile = note.fileType !== "NAN";
        const isImage = note.fileType?.startsWith("image/");
        const isPdf = note.fileType === "application/pdf";

        return (
            <Card
                className="rounded-2xl overflow-hidden h-full"
                style={{
                    background: theme.colors.white,
                    borderColor: theme.colors.lightGray,
                    boxShadow: "0 10px 0 rgba(17,17,19,0.05)",
                }}
            >
                <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <div
                                className="p-2.5 rounded-xl flex-shrink-0 border"
                                style={{
                                    background: hasFile ? theme.colors.limeDim : theme.colors.softGray,
                                    borderColor: theme.colors.lightGray,
                                    color: theme.colors.dark,
                                }}
                            >
                                {hasFile ? (
                                    isImage ? (
                                        <ImageIcon className="w-5 h-5" />
                                    ) : (
                                        <File className="w-5 h-5" />
                                    )
                                ) : (
                                    <Code className="w-5 h-5" />
                                )}
                            </div>
                            <h3 className="font-bold text-base truncate" style={{ color: theme.colors.dark }}>
                                {note.title}
                            </h3>
                        </div>

                        {isOwner && (
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => {
                                        onUpdate(note._id);
                                    }}
                                    className="p-2 rounded-xl transition-colors cursor-pointer"
                                    style={{
                                        background: "rgba(239,68,68,0.08)",
                                        color: "#DC2626",
                                    }}
                                    aria-label="Delete note"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(note._id);
                                    }}
                                    className="p-2 rounded-xl transition-colors cursor-pointer"
                                    style={{
                                        background: "rgba(239,68,68,0.08)",
                                        color: "#DC2626",
                                    }}
                                    aria-label="Delete note"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center mb-4 text-[11px] font-semibold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5" style={{ color: theme.colors.darkGray }}>
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(note.createdAt)}
                        </span>

                        {(user?.role === "admin" || user?.role === "superadmin") && (
                            <button
                                className={`rounded-full border px-3 py-1.5 text-[11px] font-bold transition-colors ${
                                    note.isGlobal
                                        ? "bg-indigo-600 text-white border-indigo-600"
                                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                                }`}
                                onClick={() => onPublic(note._id)}
                            >
                                {note.isGlobal ? "Public" : "Private"}
                            </button>
                        )}
                    </div>

                    <div className="flex-1 mb-4">
                        {hasFile ? (
                            isImage ? (
                                <img
                                    src={note.fileData}
                                    alt={note.title}
                                    onClick={() => onSelect(note)}
                                    className="w-full h-40 object-cover rounded-2xl border cursor-pointer hover:opacity-90 transition-opacity"
                                    style={{ borderColor: theme.colors.lightGray }}
                                    loading="lazy"
                                />
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => onSelect(note)}
                                    className="w-full p-4 rounded-2xl border flex items-center gap-3 text-left transition-colors hover:bg-slate-50"
                                    style={{
                                        background: theme.colors.softGray,
                                        borderColor: theme.colors.lightGray,
                                    }}
                                >
                                    <FileText className="w-8 h-8" style={{ color: theme.colors.dark }} />
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold truncate" style={{ color: theme.colors.dark }}>
                                            {note.fileName}
                                        </p>
                                        <p className="text-[11px]" style={{ color: theme.colors.darkGray }}>
                                            {isPdf ? "PDF Document" : "Attachment"}
                                        </p>
                                    </div>
                                </button>
                            )
                        ) : (
                            <div className="relative group/code">
                                <button
                                    onClick={() => onCopy(note._id, note.content)}
                                    className="absolute top-2 right-2 p-1.5 rounded-md border shadow-sm opacity-0 group-hover/code:opacity-100 z-10 transition-opacity"
                                    style={{
                                        background: theme.colors.white,
                                        borderColor: theme.colors.lightGray,
                                        color: theme.colors.darkGray,
                                    }}
                                >
                                    {copying === note._id ? (
                                        <Check className="w-3.5 h-3.5" style={{ color: "#16A34A" }} />
                                    ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                    )}
                                </button>

                                <div
                                    className="p-4 rounded-2xl border max-h-40 overflow-hidden relative"
                                    style={{
                                        background: theme.colors.softGray,
                                        borderColor: theme.colors.lightGray,
                                    }}
                                >
                                    <pre
                                        className="font-mono text-xs whitespace-pre-wrap"
                                        style={{ color: theme.colors.darkGray }}
                                    >
                                        {note.content}
                                    </pre>
                                    <div
                                        className="absolute inset-x-0 bottom-0 h-10"
                                        style={{
                                            background:
                                                "linear-gradient(180deg, rgba(244,244,245,0) 0%, rgba(244,244,245,1) 100%)",
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {hasFile ? (
                            <>
                                {isPdf ? (
                                    <>
                                        <button
                                            className="flex-1 hidden sm:flex justify-center items-center gap-2 py-2.5 border rounded-xl text-sm font-semibold transition-colors hover:bg-slate-50"
                                            style={{
                                                background: theme.colors.white,
                                                borderColor: theme.colors.lightGray,
                                                color: theme.colors.dark,
                                            }}
                                            onClick={() => onSelect(note)}
                                        >
                                            <Eye className="w-4 h-4" />
                                            Open
                                        </button>

                                        <button
                                            className="flex-1 sm:hidden flex justify-center items-center gap-2 py-2.5 border rounded-xl text-sm font-semibold transition-colors hover:bg-slate-50"
                                            style={{
                                                background: theme.colors.white,
                                                borderColor: theme.colors.lightGray,
                                                color: theme.colors.dark,
                                            }}
                                            onClick={() => {
                                                window.open(note.fileData, "_blank");
                                            }}
                                        >
                                            <Eye className="w-4 h-4" />
                                            View File
                                        </button>
                                    </>
                                ) : null}

                                <button
                                    onClick={() => onDownload(note)}
                                    className="flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-transform active:scale-[0.99] shadow-md shadow-indigo-100"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => onShowCode(note)}
                                className="w-full flex justify-center items-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-transform active:scale-[0.99] shadow-md shadow-indigo-100"
                            >
                                <Code className="w-4 h-4" />
                                View Code
                            </button>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }
);
