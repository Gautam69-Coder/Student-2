// Unified Semantic Theme Bridge (Light Default + Dark Adaptive, Electric Indigo & Emerald)
export const theme = {
    colors: {
        primary: "hsl(var(--primary))",
        primaryForeground: "hsl(var(--primary-foreground))",
        emerald: "#10B981",
        emeraldText: "#059669",
        indigo: "#4F46E5",
        background: "hsl(var(--background))",
        surface: "hsl(var(--card))",
        border: "hsl(var(--border))",
        dark: "hsl(var(--foreground))",
        darkGray: "hsl(var(--muted-foreground))",
        lightGray: "hsl(var(--border))",
        white: "hsl(var(--card))",
        softGray: "hsl(var(--muted))",
        softGrayDarker: "hsl(var(--secondary))",
        lime: "hsl(var(--primary))",
        limeDim: "hsl(var(--primary) / 0.12)",
        limeLight: "hsl(var(--primary) / 0.18)",
        limeMedium: "hsl(var(--primary) / 0.28)",
        purple: "hsl(var(--primary))",
        purpleLight: "hsl(var(--accent))",
    },
    fonts: {
        display: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
        primary: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif",
        mono: "'JetBrains Mono', monospace",
    },
    shadows: {
        sm: "0 1px 2px rgba(15, 23, 42, 0.05)",
        md: "0 8px 24px -8px rgba(15, 23, 42, 0.12)",
    },
};

export const colorVariants = {
    primary: {
        bg: "hsl(var(--accent))",
        text: "hsl(var(--accent-foreground))",
        border: "hsl(var(--primary) / 0.25)",
    },
    secondary: {
        bg: "hsl(var(--secondary))",
        text: "hsl(var(--secondary-foreground))",
        border: "hsl(var(--border))",
    },
    success: {
        bg: "rgba(16, 185, 129, 0.14)",
        text: "#059669",
    },
};
