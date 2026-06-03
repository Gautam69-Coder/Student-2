// Global Theme Configuration
export const theme = {
    colors: {
        lime: "#CCFF00",
        limeLight: "rgba(204,255,0,0.18)",
        limeMedium: "rgba(204,255,0,0.35)",
        limeDim: "rgba(204,255,0,0.12)",
        limeDimmer: "rgba(204,255,0,0.20)",
        purple: "#C4B5FD",
        purpleLight: "rgba(196,181,253,0.18)",
        dark: "#111113",
        darkGray: "#6B7280",
        lightGray: "#E5E7EB",
        white: "#fff",
        softGray: "rgba(17,17,19,0.08)",
        softGrayDarker: "rgba(17,17,19,0.10)",
        black: "#000",
    },
    fonts: {
        primary: "system-ui, -apple-system, sans-serif",
    },
    shadows: {
        sm: "0 1px 3px rgba(0,0,0,0.06)",
        md: "0 4px 6px rgba(0,0,0,0.1)",
    },
};

export const colorVariants = {
    primary: {
        bg: theme.colors.limeDim,
        text: theme.colors.dark,
        border: theme.colors.limeLight,
    },
    secondary: {
        bg: theme.colors.purpleLight,
        text: theme.colors.dark,
        border: theme.colors.purpleLight,
    },
    success: {
        bg: theme.colors.limeMedium,
        text: theme.colors.dark,
    },
};
