/**
 * Sanitize user messages to reduce prompt injection risk.
 * @param {string} text
 * @returns {string}
 */
export function sanitizeForPrompt(text) {
    if (typeof text !== 'string') return '';
    return text
        .replace(/\bsystem\s*:/gi, '[filtered]:')
        .replace(/\bignore\s+(all\s+)?previous\s+instructions?\b/gi, '[filtered]')
        .replace(/\byou\s+are\s+now\b/gi, '[filtered]')
        .replace(/\bnew\s+instructions?\s*:/gi, '[filtered]:');
}
