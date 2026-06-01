import React, { useMemo } from 'react';

const DEFAULT_THEME = {
    bg: 'bg-slate-950/40 dark:bg-black/40',
    border: 'border-slate-800 dark:border-slate-800',
    text: 'text-slate-100 dark:text-slate-200',
    hint: 'text-slate-400 dark:text-slate-500',
    btn: 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/20 text-indigo-200',
};

/**
 * MVP “editor” (no monaco/moneco in deps):
 * - editable textarea
 * - simple tab indentation support
 */
export function PracticeEditor({
    language = 'javascript',
    value,
    onChange,
    placeholder = 'Write your code here...',
}) {
    const theme = useMemo(() => DEFAULT_THEME, []);

    const handleKeyDown = (e) => {
        if (e.key !== 'Tab') return;
        e.preventDefault();

        const textarea = e.currentTarget;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const insert = '  ';
        const next = value.slice(0, start) + insert + value.slice(end);
        onChange?.(next);

        // Restore caret on next tick
        requestAnimationFrame(() => {
            textarea.selectionStart = textarea.selectionEnd = start + insert.length;
        });
    };

    return (
        <div className={`w-full rounded-[12px] overflow-hidden ${theme.bg} ${theme.border} border`}
            aria-label={`Practice editor for ${language}`}
        >
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-300">Language</span>
                    <span className={theme.text + ' text-xs font-semibold'}>{language}</span>
                </div>
                <div className={theme.hint + ' text-xs'}>Tab = indent</div>
            </div>

            <textarea
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                className={`w-full min-h-[320px] px-4 py-3 ${theme.text} bg-transparent outline-none resize-y font-mono text-sm leading-relaxed`}
                placeholder={placeholder}
            />

            <div className="px-4 py-2 border-t border-slate-800">
                <div className="text-[11px] text-slate-500">MVP editor (textarea). For monaco/moneco integration we need extra deps.</div>
            </div>
        </div>
    );
}

