
import React from "react"

export function SparklineChart({ color = "var(--primary)" }) {
    const points = [10, 25, 15, 35, 20, 40, 30]
    const max = Math.max(...points)
    const min = Math.min(...points)
    const range = max - min

    const pathData = points
        .map((point, index) => {
            const x = (index / (points.length - 1)) * 80
            const y = 20 - ((point - min) / range) * 16
            return `${index === 0 ? "M" : "L"} ${x} ${y}`
        })
        .join(" ")

    return (
        <svg width="80" height="24" viewBox="0 0 80 24" className="opacity-70">
            <path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}
