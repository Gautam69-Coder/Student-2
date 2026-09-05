import React from 'react';
import { X } from 'lucide-react';
import { theme } from "@/lib/theme";

export function FilePreview({ fileUrl, fileType, fileName, title, onDownload, customClass = "" }) {
    if (!fileUrl) return null;

    const isImage = fileType?.startsWith("image/") || 
                    fileUrl.startsWith("data:image/") || 
                    (!fileType && /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(fileUrl));
    
    const isPdf = fileType === "application/pdf" || 
                  fileType?.includes("pdf") ||
                  /\.pdf$/i.test(fileName || "") || 
                  fileUrl.toLowerCase().includes('.pdf');

    if (isImage) {
        return (
            <img
                src={fileUrl}
                alt={title || fileName || "Reference attachment"}
                className={`max-w-full max-h-full object-contain rounded-2xl shadow-xl bg-white p-2 ${customClass}`}
            />
        );
    }

    if (isPdf) {
        return (
            <iframe
                src={fileUrl}
                className={`w-full h-full rounded-2xl border bg-white ${customClass}`}
                style={{ borderColor: theme.colors.lightGray }}
                title={title || fileName || "Document Preview"}
            />
        );
    }

    return (
        <div className="text-center p-8 bg-white rounded-2xl border border-zinc-250 shadow-sm max-w-sm my-auto flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <X className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-zinc-950 font-bold mb-2">Preview Unavailable</p>
            <p className="text-zinc-400 text-sm mb-6 max-w-xs">
                This file type cannot be displayed directly in-browser. Please download it to view.
            </p>
            {onDownload && (
                <button
                    onClick={onDownload}
                    className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-sm"
                >
                    Download to View
                </button>
            )}
        </div>
    );
}
