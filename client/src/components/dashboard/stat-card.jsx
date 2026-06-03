import React from "react";
import { theme } from "@/lib/theme";
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card";

export function TrendBadge({ text, variant = "success" }) {
    const variants = {
        success: {
            bg: `rgba(204,255,0,0.18)`,
            text: theme.colors.dark,
            border: `rgba(204,255,0,0.35)`,
        },
        danger: {
            bg: "rgba(239,68,68,0.18)",
            text: theme.colors.dark,
            border: "rgba(239,68,68,0.35)",
        },
    };

    const style = variants[variant];

    return (
        <span
            style={{
                // display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4px 10px",
                borderRadius: 999,
                backgroundColor: style.bg,
                color: style.text,
                border: `1px solid ${style.border}`,
                fontWeight: 700,
                fontSize: 12,
            }}
            className="sm:block hidden sm:inline-flex"
        >
            {text}
        </span>
    );
}

export function DashStatCard({ icon: Icon, title, value, trend, variant = "primary" }) {
    return (
      <Card
  className="rounded-2xl h-full transition-all hover:shadow-lg"
  style={{
    background: theme.colors.white,
    borderColor: theme.colors.lightGray,
  }}
>
  <CardHeader className="pb-3">
    <div className="flex items-start justify-between">
      <div
        className="p-2.5 rounded-xl shrink-0"
        style={{
          background:
            variant === "primary"
              ? theme.colors.limeDim
              : theme.colors.purpleLight,
        }}
      >
        <Icon size={18} color={theme.colors.dark} />
      </div>

      <TrendBadge
        text={trend}
        variant={trend.includes("-") ? "danger" : "success"}
      />
    </div>

    <CardTitle
      className="mt-3 text-xs sm:text-sm font-medium leading-tight"
      style={{ color: theme.colors.darkGray }}
    >
      {title}
    </CardTitle>
  </CardHeader>

  <CardContent className="pt-0">
    <div
      className="text-xl sm:text-2xl lg:text-3xl font-bold break-words"
      style={{ color: theme.colors.dark }}
    >
      {value}
    </div>
  </CardContent>
</Card>
    );
}

export function Pill({ children, style = {} }) {
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4px 10px",
                borderRadius: 999,
                fontWeight: 800,
                border: `1px solid ${theme.colors.lightGray}`,
                ...style,
            }}
        >
            {children}
        </span>
    );
}
