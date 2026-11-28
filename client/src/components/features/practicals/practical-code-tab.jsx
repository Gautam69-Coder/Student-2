import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HighlightComponent from "react-highlight";
import Editor from "@monaco-editor/react";
import "highlight.js/styles/atom-one-dark.css";
import { useTheme } from "@/context/ThemeContext";

const Highlight = HighlightComponent.default || HighlightComponent;

export default function CodeTabs({
    tabs = [],
    activeTab: controlledActiveTab,
    onTabChange,
    layoutId = "activeTabUnderline",
}) {
    const [internalActiveTab, setInternalActiveTab] = useState(0);
    const { darkMode } = useTheme();
    const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
    const setActiveTab = onTabChange !== undefined ? onTabChange : setInternalActiveTab;

    if (tabs.length === 0) return null;

    return (
        <div className="overflow-hidden bg-card font-mono">
            <div className="flex border-b border-border bg-secondary/40 px-2 overflow-x-auto" role="tablist">
                {tabs.map((tab, index) => {
                    const isActive = activeTab === index;
                    return (
                        <button
                            key={index}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            id={`tab-${index}`}
                            aria-controls={`panel-${index}`}
                            onClick={() => setActiveTab(index)}
                            className={`relative px-4 py-2.5 font-mono text-xs font-semibold transition-colors ${
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {tab.label || `Tab ${index + 1}`}
                            {isActive && (
                                <motion.div
                                    layoutId={layoutId}
                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="relative min-h-[100px]">
                <AnimatePresence mode="wait">
                    {tabs.map((tab, index) => {
                        if (activeTab !== index) return null;
                        return (
                            <motion.div
                                key={index}
                                id={`panel-${index}`}
                                role="tabpanel"
                                aria-labelledby={`tab-${index}`}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.15 }}
                                className="overflow-x-auto text-sm leading-relaxed"
                            >
                                <div className="sm:hidden bg-[#0D1117] text-slate-200 p-2">
                                    <Highlight className="javascript">
                                        {tab.code || "// No content"}
                                    </Highlight>
                                </div>
                                <div style={{ height: "420px" }} className="hidden sm:block">
                                    <Editor
                                        height="100%"
                                        defaultLanguage="javascript"
                                        value={tab.code || "// No content"}
                                        options={{
                                            readOnly: true,
                                            minimap: { enabled: false },
                                            scrollbar: { vertical: "hidden", horizontal: "auto" },
                                            lineNumbers: "on",
                                            fontSize: 14,
                                            fontFamily: "JetBrains Mono, Fira Code, monospace",
                                            wordWrap: "on",
                                            wrappingIndent: "indent",
                                            renderLineHighlight: "all",
                                            automaticLayout: true,
                                        }}
                                        theme={darkMode ? "vs-dark" : "light"}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
