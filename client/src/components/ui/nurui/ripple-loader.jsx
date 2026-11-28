import React from "react";

const RippleLoader = () => {
  const colors = [
    "#c7d2fe",
    "#a5b4fc",
    "#818cf8",
    "#6366f1",
    "#4f46e5",
    "#4338ca",
    "#34d399",
    "#10b981",
    "#059669",
  ];
  const delays = [0, 100, 200, 100, 200, 200, 300, 300, 400];

  return (
    <>
      <style>{`
        @keyframes rippleCell {
          0%, 60%, 100% {
            background-color: transparent;
            opacity: 0.25;
          }
          30% {
            background-color: var(--cell-color);
            opacity: 1;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ripple-loader-cell {
            animation: none !important;
            background-color: var(--cell-color) !important;
            opacity: 0.75 !important;
          }
        }
      `}</style>

      <div
        role="status"
        aria-label="Loading workspace"
        className="flex flex-wrap w-[162px] h-[162px]"
      >
        {colors.map((color, index) => (
          <div
            key={index}
            style={{
              "--cell-color": color,
              animationName: "rippleCell",
              animationDuration: "1.5s",
              animationTimingFunction: "ease",
              animationIterationCount: "infinite",
              animationDelay: `${delays[index]}ms`,
            }}
            className="ripple-loader-cell flex-none w-[52px] h-[52px] m-[1px] rounded-md border border-border/30"
          />
        ))}
      </div>
    </>
  );
};

export default RippleLoader;
