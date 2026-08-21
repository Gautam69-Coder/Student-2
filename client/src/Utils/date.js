/**
 * Formats a date into a localized date string.
 * @param {string | number | Date} date
 * @param {Intl.DateTimeFormatOptions} [options]
 * @param {string} [locale='en-IN']
 * @returns {string}
 */
export function formatDate(date, options, locale = "en-IN") {
    if (!date) return "N/A";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString(locale, options);
}

/**
 * Formats a date into a human-friendly relative time string (e.g. "Just now", "5m ago", "2h ago", "3d ago").
 * @param {string | number | Date} date
 * @returns {string}
 */
export function formatTimeAgo(date) {
    if (!date) return "";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "";

    const now = new Date();
    const diffMs = now - d;
    if (diffMs < 0) return "Just now";

    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}
