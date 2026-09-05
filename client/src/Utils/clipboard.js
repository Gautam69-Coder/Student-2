import { useState, useCallback } from "react";

/**
 * Copies text to the system clipboard.
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
    if (!text && text !== "") return false;
    try {
        if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);
        return successful;
    } catch (err) {
        console.error("Failed to copy to clipboard:", err);
        return false;
    }
}

/**
 * React hook for managing clipboard copy state with an auto-reset timeout.
 * @param {number} [timeout=2000]
 * @returns {{ copied: boolean, copy: (text: string) => Promise<boolean>, copiedId: any, copyWithId: (id: any, text: string) => Promise<boolean> }}
 */
export function useClipboard(timeout = 2000) {
    const [copied, setCopied] = useState(false);
    const [copiedId, setCopiedId] = useState(null);

    const copy = useCallback(
        async (text) => {
            const success = await copyToClipboard(text);
            if (success) {
                setCopied(true);
                setTimeout(() => setCopied(false), timeout);
            }
            return success;
        },
        [timeout]
    );

    const copyWithId = useCallback(
        async (id, text) => {
            const success = await copyToClipboard(text);
            if (success) {
                setCopiedId(id);
                setTimeout(() => setCopiedId(null), timeout);
            }
            return success;
        },
        [timeout]
    );

    return { copied, copy, copiedId, copyWithId };
}
