import { toUpperName } from './toUpperName';

// Lightweight, zero-dependency, high-performance toast manager replacing heavy antd message
let toastContainer = null;

function getToastContainer() {
    if (typeof document === 'undefined') return null;
    if (!toastContainer || !document.body.contains(toastContainer)) {
        toastContainer = document.getElementById('custom-toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'custom-toast-container';
            toastContainer.className = 'fixed top-5 right-5 z-[999999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none';
            document.body.appendChild(toastContainer);
        }
    }
    return toastContainer;
}

const ICONS = {
    success: `<svg class="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>`,
    error: `<svg class="w-5 h-5 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`,
    warning: `<svg class="w-5 h-5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`,
    info: `<svg class="w-5 h-5 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="9" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01" /></svg>`
};

const BORDER_COLORS = {
    success: 'border-emerald-500/40 bg-zinc-950/95 text-zinc-100 shadow-emerald-950/20',
    error: 'border-rose-500/40 bg-zinc-950/95 text-zinc-100 shadow-rose-950/20',
    warning: 'border-amber-500/40 bg-zinc-950/95 text-zinc-100 shadow-amber-950/20',
    info: 'border-indigo-500/40 bg-zinc-950/95 text-zinc-100 shadow-indigo-950/20'
};

export const customMessage = ({ content, type = 'info', duration = 3000 }) => {
    if (typeof window === 'undefined') return;
    const container = getToastContainer();
    if (!container) return;

    const formatted = typeof content === 'string' ? toUpperName(content) : (content || '');
    const validKey = ICONS[type] ? type : 'info';

    const toast = document.createElement('div');
    toast.className = `pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-300 transform translate-x-full opacity-0 ${BORDER_COLORS[validKey]}`;
    
    toast.innerHTML = `
        <div class="flex items-center gap-3 min-w-0">
            ${ICONS[validKey]}
            <p class="text-xs font-semibold tracking-wide truncate max-w-[280px]">${formatted}</p>
        </div>
        <button class="text-zinc-400 hover:text-zinc-100 shrink-0 transition-colors cursor-pointer" aria-label="Close">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
    `;

    const closeBtn = toast.querySelector('button');
    let removeTimer = null;

    const dismiss = () => {
        if (removeTimer) clearTimeout(removeTimer);
        toast.classList.remove('translate-x-0', 'opacity-100');
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            if (toast.parentElement) toast.parentElement.removeChild(toast);
        }, 300);
    };

    if (closeBtn) {
        closeBtn.onclick = dismiss;
    }

    container.appendChild(toast);

    // Trigger enter animation on next frame
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
            toast.classList.add('translate-x-0', 'opacity-100');
        });
    });

    removeTimer = setTimeout(dismiss, duration);
};

// Backwards-compatible message object mimicking antd message
export const message = {
    success: (content) => customMessage({ content, type: 'success' }),
    error: (content) => customMessage({ content, type: 'error' }),
    warning: (content) => customMessage({ content, type: 'warning' }),
    info: (content) => customMessage({ content, type: 'info' }),
};

export { toUpperName };
export default customMessage;
