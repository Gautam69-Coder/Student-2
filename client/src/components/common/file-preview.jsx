import React from "react";
import { X } from "lucide-react";

export function FilePreview({ fileUrl, fileType, fileName, title, onDownload, customClass = "" }) {
    if (!fileUrl) return null;

    const isImage =
        fileType?.startsWith("image/") ||
        fileUrl.startsWith("data:image/") ||
        (!fileType && /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(fileUrl));

    const isPdf =
        fileType === "application/pdf" ||
        fileType?.includes("pdf") ||
        /\.pdf$/i.test(fileName || "") ||
        fileUrl.toLowerCase().includes(".pdf");

    if (isImage) {
        return (
            <img
                src={fileUrl}
                alt={title || fileName || "Reference attachment"}
                className={`max-w-full max-h-full object-contain rounded-2xl shadow-lg bg-card border border-border p-2 ${customClass}`}
                loading="lazy"
            />
        );
    }

    if (isPdf) {
        return (
            <iframe
                src={fileUrl}
                className={`w-full h-full rounded-2xl border border-border bg-white ${customClass}`}
                title={title || fileName || "Document Preview"}
                loading="lazy"
            />
        );
    }

    return (
        <div className="text-center p-8 surface-card rounded-2xl max-w-sm my-auto flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-4">
                <X className="w-6 h-6" aria-hidden="true" />
            </div>
            <p className="text-foreground font-bold mb-1.5">Preview Unavailable</p>
            <p className="text-muted-foreground text-xs mb-6 max-w-xs leading-relaxed">
                This file type cannot be displayed directly in-browser. Please download it to view.
            </p>
            {onDownload && (
                <button
                    type="button"
                    onClick={onDownload}
                    className="px-6 min-h-[42px] bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold transition-all active:scale-[0.98] text-xs"
                >
                    Download to View
                </button>
            )}
        </div>
    );
}
